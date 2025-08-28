import spacy
import rake_nltk
from sentence_transformers import SentenceTransformer

nlp = spacy.load("en_core_web_sm")
model = SentenceTransformer('all-MiniLM-L6-v2')

print("All libraries loaded successfully!")
