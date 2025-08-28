This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Resume builder
- Created a resume builder with Next.js and psql. Used Python for AI tasks
- Used special svg images and effects.
- Next.js routing. I set up a side bar for easy navigation.
- Main resume builder page which displays the created resumes and button to create new resume using built in templates.
- api/resumes/[id]/page.tsx so each resume has seperate url ID
- Created templates from scratch using typescript to follow ats standards.
- Includes required headers such as name, title, contact info, summary, work history, education, skills, and other add ons such as projects, and certifications.
- Implemented Machine Learning. The app can
 - scan resume for headers to check ats friendliness, implementing other techniques as well. Used 
 Python language to implement this. API set up with FastAPI, NLP using nltk library, and spacy LLM such as 
 openai api, etc.
 - Python function that takes job description and matches keywords. Keywords suggestions are 
 sent back to frontend and displayed for user to add to resume.
 - Next.js on front end makes the API calls to Python backend set up with FastAPI.
- Postgres DB to store resumes after saving.
- Used react/pdf-renderer to create PDF file and add preview to front end. Can download and print pdf as well.
- Created a resume builder with Next.js and psql. Used Python for AI tasks - Used special svg images and effects. - Next.js routing. I set up a side bar for easy navigation. - Main resume builder page which displays the created resumes and button to create new resume using built in templates. - api/resumes/[id]/page.tsx so each resume has seperate url ID - Created templates from scratch using typescript to follow ats standards. - Includes required headers such as name, title, contact info, summary, work history, education, skills, and other add ons such as projects, and certifications. - Implemented Machine Learning. The app can - scan resume for headers to check ats friendliness, implementing other techniques as well. Used Python language to implement this. API set up with FastAPI, NLP using nltk library, and spacy LLM such as openai api, etc. - Python function that takes job description and matches keywords. Keywords suggestions are sent back to frontend and displayed for user to add to resume. - Next.js on front end makes the API calls to Python backend set up with FastAPI. - Postgres DB to store resumes after saving. - Used react/pdf-renderer to create PDF file and add preview to front end. Can download and print pdf as well.
Skills: React · Next.js · TypeScript · JavaScript · Python (Programming Language) · Natural Language Processing (NLP) · Large Language Models (LLM) · PostgreSQL · Artificial Intelligence (AI) · Machine Learning · API Development
