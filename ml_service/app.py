# ml_service/app.py
# http://127.0.0.1:8000/docs

from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel, Field
import spacy
from rake_nltk import Rake
from sentence_transformers import SentenceTransformer, util
import nltk
import pdfplumber
import re
from openai import OpenAI
import os

# Set your OpenAI API key
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
app = FastAPI()

# Load NLP models
nlp = spacy.load("en_core_web_sm")
model = SentenceTransformer('all-MiniLM-L6-v2')

# Ensure required NLTK resources are available
resources = {
    "stopwords": "corpora/stopwords",
    "punkt": "tokenizers/punkt",
    "punkt_tab": "tokenizers/punkt_tab",
}

for resource, path in resources.items():
    try:
        nltk.data.find(path)
    except LookupError:
        nltk.download(resource)

# Candidate skills list (can expand with synonyms)
base_skills = [
    "Python", "JavaScript", "Java", "C++", "AWS", "Docker",
    "Kubernetes", "Agile", "Scrum", "SQL", "NoSQL",
    "Machine Learning", "Data Analysis", "Communication",
    "Teamwork", "Problem-solving"
]

# Skill synonyms mapping
skill_synonyms = {
    "JS": "JavaScript",
    "ML": "Machine Learning",
    "AWS Cloud": "AWS",
    "Data Analytics": "Data Analysis",
    "Team Collaboration": "Teamwork",
    "Problem Solving": "Problem-solving"
}

# Define standard ATS-friendly headings
ATS_HEADINGS = [
    "experience", "work experience", "education", 
    "skills", "certifications", "projects", "summary", "contact"
]

# Expand base skills with synonyms
candidate_skills = list(set(base_skills + list(skill_synonyms.keys())))

class JobData(BaseModel):
    # job_description: str = Field(..., alias="jobDescription")
    job_description: str 

def extract_keywords(job_description, top_n=10):
    # Step 1: RAKE keyword extraction
    rake = Rake()
    rake.extract_keywords_from_text(job_description)
    rake_keywords = rake.get_ranked_phrases()
    
    # Step 2: spaCy noun chunks
    doc = nlp(job_description)
    noun_chunks = [chunk.text.lower() for chunk in doc.noun_chunks]
    
    # Combine RAKE + noun chunks
    combined_keywords = list(set(rake_keywords + noun_chunks))
    
    # Step 3: Semantic similarity ranking
    job_embedding = model.encode(job_description)
    skill_embeddings = model.encode(candidate_skills)
    similarities = util.cos_sim(job_embedding, skill_embeddings)[0]
    
    # Rank skills by similarity
    skill_ranking = sorted(
        zip(candidate_skills, similarities.tolist()),
        key=lambda x: x[1], reverse=True
    )
    top_skills = [skill for skill, score in skill_ranking[:top_n]]
    
    # Step 4: Map synonyms
    mapped_skills = [skill_synonyms.get(skill, skill) for skill in top_skills]
    
    # Step 5: Combine skills + extracted keywords
    final_keywords = list(dict.fromkeys(mapped_skills + combined_keywords))[:top_n]
    
    return final_keywords

def check_pdf_resume(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"

    headings_found = [h for h in ATS_HEADINGS if re.search(r'\b' + h + r'\b', text, re.I)]

    # PDF detection for tables/images is more complex; we’ll just warn
    return {
        "headings_found": headings_found
    }

# @app.post("/match")
# def generate_skills_bank(data: JobData):

#     # Build the prompt
#     prompt = f"""
# I want to build a master skills bank for my resume that I can use. Please analyze the following job description and create a comprehensive skills bank organized into categories. 

# For each skill or group of skills, include short action/context phrases that demonstrate how the skill is applied in real-world projects. Format it in a clean, resume-ready way so I can:
# - Pull concise keyword-only versions (ATS-optimized).
# - Pull action-oriented versions (for human recruiters/managers).
# - Expand beyond the job description to include industry-relevant skills that are commonly expected for the role, even if not explicitly stated.

# Return the result strictly in JSON format.

# Job Description:
# {data.job_description}
# """

#     # NEW API call for openai>=1.0
#     response = client.chat.completions.create(
#         model="gpt-5-mini",
#         messages=[{"role": "user", "content": prompt}],
#         temperature=0.2
#     )

#     raw_gpt_text = response.choices[0].message.content
#     print("Raw GPT output:\n", raw_gpt_text)

    # Return JSON (attempt parsing if possible)
    # try:
    #     import json
    #     skills_bank_json = json.loads(skills_bank_text)
    # except Exception:
    #     # fallback: return raw string if parsing fails
    #     skills_bank_json = {"error": "Failed to parse JSON from AI", "raw_text": skills_bank_text}

    # return skills_bank_json

@app.post("/match")
def match_resume(data: JobData):
    print("Received job description:", data.job_description)
    keywords = extract_keywords(data.job_description)
    print("Extracted keywords:", keywords)
    return {"keyword_suggestions": keywords}

@app.post("/matchScore")
def match_resume(data: JobData):
    print("Received job description:", data.job_description)
    keywords = extract_keywords(data.job_description)
    print("Extracted keywords:", keywords)
    return {"keyword_suggestions": keywords}

@app.post("/upload")
def upload_resume(file: UploadFile = File(...)):
    """
    Receives a PDF file, extracts headings, and returns them.
    """
    try:
        # Save uploaded PDF temporarily
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as f:
            f.write(file.file.read())

        # Extract headings from PDF
        result = check_pdf_resume(temp_file_path)

        # Optionally remove temp file here
        # os.remove(temp_file_path)

        print("Headings found:", result["headings_found"])
        return result

    except Exception as e:
        print("Error processing PDF:", str(e))
        return {"error": str(e)}


