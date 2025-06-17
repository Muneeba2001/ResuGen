# main.py  ─── FastAPI backend aligned with current React JSON
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
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

# ───────────── DATA MODELS ─────────────
class ExperienceItem(BaseModel):
    title: str
    company: str
    duration: str

class ProjectItem(BaseModel):
    title: str                  # <- matches ProjectsSection
    link: Optional[str] = None

class EducationItem(BaseModel):
    degree: str
    institution: str            # <- matches EducationSection
    year: str

class ResumeInput(BaseModel):
    name: str
    phone: str
    email: str
    linkedin: Optional[str] = None
    github:  Optional[str] = None
    devpost: Optional[str] = None
    summary: str
    experiences: List[ExperienceItem]
    projects:    List[ProjectItem]
    skills:      List[str]
    education:   List[EducationItem]
# ───────────────────────────────────────

# ───────────── PROMPT ─────────────
prompt = PromptTemplate(
    input_variables=[
        "name", "contact_info", "summary",
        "experience_block", "projects_block",
        "skills_text", "education_block",
    ],
    template=r"""
You are an expert résumé writer. Output valid pure HTML.

<h1><strong>{name}</strong></h1>
<p>{contact_info}</p>

<p><strong>SUMMARY</strong></p>
<p>{summary}</p>

<p><strong>WORK EXPERIENCE</strong></p>
{experience_block}

<p><strong>PROJECTS</strong></p>
{projects_block}

<p><strong>SKILLS</strong></p>
<p>{skills_text}</p>

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

# ───────────── HELPERS ─────────────
def build_experience_block(items: List[ExperienceItem]) -> str:
    blocks = []
    for job in items:
        bullets = llm.invoke(
            f"Write 3 concise resume bullets for a {job.title} at {job.company}. "
            "Each bullet <=18 words."
        ).content.strip().split("\n")[:3]
        li = "\n".join(f"<li>{b.lstrip('•- ')}.</li>" for b in bullets)
        blocks.append(f"<h3><em>{job.company} | {job.title} ({job.duration})</em></h3><ul>{li}</ul>")
    return "\n".join(blocks)

def build_projects_block(items: List[ProjectItem]) -> str:
    blocks = []
    for proj in items:
        bullets = llm.invoke(
            f"Write 3 concise accomplishments for project '{proj.title}'. "
            "Start with a verb, <=18 words."
        ).content.strip().split("\n")[:3]
        li = "\n".join(f"<li>{b.lstrip('•- ')}.</li>" for b in bullets)
        title = f"<strong>{proj.title}</strong>" + (f" | {proj.link}" if proj.link else "")
        blocks.append(f"{title}<ul>{li}</ul>")
    return "\n".join(blocks)

def build_education_block(items: List[EducationItem]) -> str:
    return "\n".join(
        f"<h3>{e.degree} ({e.year})</h3><p>{e.institution}</p>" for e in items
    )

def build_contact_info(d: ResumeInput) -> str:
    links = [f"LinkedIn: {d.linkedin}" if d.linkedin else "",
             f"GitHub: {d.github}"     if d.github   else "",
             f"Devpost: {d.devpost}"   if d.devpost  else ""]
    links = " | ".join(filter(None, links))
    return f"{d.phone} | {d.email}" + (f" | {links}" if links else "")

# ───────────── ENDPOINTS ─────────────
@app.post("/generate")
async def generate_html(data: ResumeInput):
    html = chain.run(
        name=data.name,
        contact_info=build_contact_info(data),
        summary=data.summary,
        experience_block=build_experience_block(data.experiences),
        projects_block=build_projects_block(data.projects),
        skills_text=", ".join(data.skills),
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
        p  {{ margin:6px 0; }}
        ul {{ margin:8px 0; padding-left:20px; }}
        li {{ margin-bottom:4px; }}
      </style></head><body>{html_resp['html']}</body></html>
    """
    pdf_bytes = HTML(string=styled).write_pdf()
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=resume.pdf"}
    )
