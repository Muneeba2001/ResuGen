from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from weasyprint import HTML
import os

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────── Resume Input ────────────────
class ResumeInput(BaseModel):
    name: str
    phone: str
    email: str
    linkedin: str
    github: str
    devpost: str
    summary: str
    skills: str
    experience: str
    projects: str
    education: str

# ──────────────── Sample Format ───────────────
SAMPLE = """
<resume>
  <h1><strong>Muneeba Waseem</strong></h1>
  <p>+92 300 0076057 | muneebawaseem2001@gmail.com |
     LinkedIn: Muneeba Waseem | Github: Muneeba2001 | Devpost: Muneeba2001</p>

  <p><strong>Work Experience</strong></p>
  <h3><em>Knowledge Streams | Trainee MERN Stack (Apr 2024 – Jul 2024)</em></h3>
  <ul>
    <li>Front‑end with React (JSX & Hooks).</li>
    <li>Built REST APIs in Node/Express.</li>
    <li>Optimised PostgreSQL schema.</li>
  </ul>

  <p><strong>Projects</strong></p>
  <ul>
    <li><strong>Attendify</strong> – React + Express + MongoDB attendance system.</li>
    <li><strong>Foody</strong> – Restaurant workflow with PostgreSQL.</li>
  </ul>

  <p><strong>Summary</strong></p>
  <p>Energetic MERN stack developer with real-world internship experience building full-stack apps...</p>

  <p><strong>Core Skills</strong></p>
  <p>JavaScript, C++, Python • React, Node, Express • MongoDB, PostgreSQL</p>

  <p><strong>Education</strong></p>
  <p>BS Information Technology – GCUF (2019–2023)</p>
</resume>
"""

# ──────────────── LangChain Prompt ───────────────
prompt = PromptTemplate(
    input_variables=[
        "name", "phone", "email", "linkedin", "github", "devpost",
        "summary", "skills", "experience", "projects", "education"
    ],
    template=f"""
You are an expert résumé writer. Copy the HTML structure in the example below
EXACTLY, but fill it with the provided data.

Example:
{SAMPLE}

Now create the résumé:

Name: {{name}}
Phone: {{phone}}
Email: {{email}}
LinkedIn: {{linkedin}}
Github: {{github}}
Devpost: {{devpost}}

Summary: {{summary}}

Skills: {{skills}}

Experience: {{experience}}

Projects: {{projects}}

Education: {{education}}

Return ONLY valid HTML (no markdown, no commentary).
"""
)

llm = ChatOpenAI(
    model="openai/gpt-4o-mini",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
    temperature=0.7,
)
chain = LLMChain(llm=llm, prompt=prompt)

# ──────────────── HTML Resume Endpoint ───────────────
@app.post("/generate")
async def generate_html(data: ResumeInput):
    html = chain.run(**data.dict())
    return {"html": html}

# ──────────────── PDF Resume Endpoint ───────────────
@app.post("/generate-pdf")
async def generate_pdf(data: ResumeInput):
    html = chain.run(**data.dict())

    # Optional inline CSS for consistent layout
    styled_html = f"""
    <html>
    <head>
      <style>
        body {{
          font-family: Arial, sans-serif;
          margin: 4px;
          line-height: 1.6;
        }}
        h1 {{ font-size: 26px; margin-bottom: 0; }}
        h2, h3 {{ font-size: 18px; margin-top: 20px; }}
        p {{ margin: 6px 0; }}
        ul {{ margin: 8px 0; padding-left: 20px; }}
        li {{ margin-bottom: 4px; }}
      </style>
    </head>
    <body>{html}</body>
    </html>
    """

    pdf_bytes = HTML(string=styled_html).write_pdf()
    return Response(content=pdf_bytes, media_type="application/pdf", headers={
        "Content-Disposition": "attachment; filename=resume.pdf"
    })
