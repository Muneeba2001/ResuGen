from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
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

# ──────────────── Data models ────────────────
class ExperienceItem(BaseModel):
    title: str
    company: str
    duration: str                        # e.g. "Apr 2024 – Jul 2024"

class ResumeInput(BaseModel):
    # contact
    name: str
    phone: str
    email: str
    linkedin: str
    github: str
    devpost: str
    # profile
    summary: str
    # core‑skill buckets
    programming_languages: str           # "JavaScript, C++, Python"
    developer_tools: str                 # "Git, GitHub, Postman"
    libraries_frameworks: str            # "Express.js, React.js, Tailwind CSS"
    databases: str                       # "MongoDB, PostgreSQL"
    # main sections
    experience: List[ExperienceItem]
    projects: str                        # one line per project: "Project Name | Link"
    education: str                       # "BS IT (2019 – 2023) | GCUF"
# ─────────────────────────────────────────────

# ──────────────── Prompt ────────────────
prompt = PromptTemplate(
    input_variables=[
        "name", "phone", "email", "linkedin", "github", "devpost",
        "summary",
        "programming_languages", "developer_tools",
        "libraries_frameworks", "databases",
        "experience_block",
        "projects_block",
        "education_block"
    ],
    template=r"""
You are an expert résumé writer.  Output **pure HTML** (no Markdown, no commentary).
Required layout:

<h1><strong>{name}</strong></h1>
<p>{phone} | {email} | LinkedIn: {linkedin} | Github: {github} | Devpost: {devpost}</p>

<p><strong>SUMMARY</strong></p>
<p>{summary}</p>

<p><strong>WORK EXPERIENCE</strong></p>
{experience_block}

<p><strong>PROJECTS</strong></p>
{projects_block}

<p><strong>CORE SKILLS</strong></p>
<p>Programming Languages: {programming_languages}</p>
<p>Developer Tools: {developer_tools}</p>
<p>Libraries and Frameworks: {libraries_frameworks}</p>
<p>Databases: {databases}</p>

<p><strong>EDUCATION</strong></p>
{education_block}
"""
)

llm = ChatOpenAI(
    model="openai/gpt-4o-mini",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
    temperature=0.7,
)
chain = LLMChain(llm=llm, prompt=prompt)

# ──────────────── Helpers ────────────────
def build_experience_block(exps: List[ExperienceItem]) -> str:
    out = []
    for job in exps:
        # generate exactly 3 bullets for each job title
        bullets = llm.invoke(
            f"Write 3 concise resume bullets for a {job.title} at {job.company}. "
            f"No more than 18 words each."
        ).content.strip().split("\n")[:3]
        bullet_html = "\n".join(f"<li>{b.lstrip('•- ')}.</li>" for b in bullets)
        out.append(
            f"<h3><em>{job.company} | {job.title} ({job.duration})</em></h3>\n<ul>\n{bullet_html}\n</ul>"
        )
    return "\n".join(out)

def build_projects_block(projects_raw: str) -> str:
    """
    Input format: one line per project =>  'Project Name | OptionalLink'
    Generates 2‑3 bullets per project.
    """
    out = []
    for line in filter(None, [l.strip() for l in projects_raw.splitlines()]):
        title, *link = [p.strip() for p in line.split("|")]
        link_part = f" | {link[0]}" if link else ""
        # bullets
        bullets = llm.invoke(
            f"Write 3 concise accomplishments for project '{title}'. "
            "Start each with a strong verb, <=18 words."
        ).content.strip().split("\n")[:3]
        bullet_html = "\n".join(f"<li>{b.lstrip('•- ')}.</li>" for b in bullets)
        out.append(
            f"<strong>{title}</strong>{link_part}\n<ul>\n{bullet_html}\n</ul>"
        )
    return "\n".join(out)

def build_education_block(edu_raw: str) -> str:
    """
    Input example: 'BS IT (2019 - 2023) | Government College University Faisalabad'
    Returns formatted HTML.
    """
    if "|" in edu_raw:
        degree_part, inst = [p.strip() for p in edu_raw.split("|", 1)]
    else:
        degree_part, inst = edu_raw, ""
    return f"<h3>{degree_part}</h3>\n<p>{inst}</p>"

# ──────────────── Endpoints ────────────────
@app.post("/generate")
async def generate_html(data: ResumeInput):
    html = chain.run(
        name=data.name,
        phone=data.phone,
        email=data.email,
        linkedin=data.linkedin,
        github=data.github,
        devpost=data.devpost,
        summary=data.summary,
        programming_languages=data.programming_languages,
        developer_tools=data.developer_tools,
        libraries_frameworks=data.libraries_frameworks,
        databases=data.databases,
        experience_block=build_experience_block(data.experience),
        projects_block=build_projects_block(data.projects),
        education_block=build_education_block(data.education),
    )
    return {"html": html}

@app.post("/generate-pdf")
async def generate_pdf(data: ResumeInput):
    html_resp = await generate_html(data)
    styled = f"""
    <html><head>
      <style>
        body {{ font-family: Arial, sans-serif; margin:4px; line-height:1.55; }}
        h1 {{ font-size:26px; margin-bottom:0; }}
        h3 {{ font-size:18px; margin-top:18px; }}
        p {{ margin:6px 0; }}
        ul {{ margin:8px 0; padding-left:20px; }}
        li {{ margin-bottom:4px; }}
      </style></head><body>{html_resp['html']}</body></html>"""
    pdf_bytes = HTML(string=styled).write_pdf()
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=resume.pdf"}
    )
