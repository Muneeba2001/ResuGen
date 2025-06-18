# main.py  ── FastAPI backend with new styling rules
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

# ────────── MODELS ──────────
class ExperienceItem(BaseModel):
    title: str
    company: str
    duration: str

class ProjectItem(BaseModel):
    title: str
    link: Optional[str] = None

class EducationItem(BaseModel):
    degree: str
    institution: str
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
# ────────────────────────────

# ────────── PROMPT ──────────
prompt = PromptTemplate(
    input_variables=[
        "name", "contact_info", "summary",
        "experience_block", "projects_block",
        "skills_text", "education_block",
    ],
    template=r"""
<h1 style="text-align:center;font-size:32px;margin-bottom:4px;">
  <strong>{name}</strong>
</h1>
<p style="text-align:center;">{contact_info}</p>

<p style="font-size:18px;font-weight:700;margin-top:18px;"><strong>SUMMARY</strong></p>
<p>{summary}</p>

<p style="font-size:18px;font-weight:700;margin-top:18px;"><strong>WORK EXPERIENCE</strong></p>
{experience_block}

<p style="font-size:18px;font-weight:700;margin-top:18px;"><strong>PROJECTS</strong></p>
{projects_block}

<p style="font-size:18px;font-weight:700;margin-top:18px;"><strong>SKILLS</strong></p>
<p>{skills_text}</p>

<p style="font-size:18px;font-weight:700;margin-top:18px;"><strong>EDUCATION</strong></p>
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

# ────────── HELPERS ──────────
def polish_summary(raw: str) -> str:
    """AI‑polish the summary into 1–2 crisp lines."""
    return llm.invoke(
        f"Improve the following resume summary to be concise, professional, under 50 words:\n\n{raw}"
    ).content.strip()

def build_experience_block(items: List[ExperienceItem]) -> str:
    blocks = []
    for job in items:
        bullets = llm.invoke(
            f"Write 3 concise bullets (<=18 words, no percentage signs) for a {job.title} at {job.company}."
        ).content.replace('%', '').strip().split("\n")[:3]
        li = "\n".join(f"<li>{b.lstrip('•- ')}.</li>" for b in bullets)
        blocks.append(
            f"<h3><em>{job.company} | {job.title} ({job.duration})</em></h3><ul>{li}</ul>"
        )
    return "\n".join(blocks)

def build_projects_block(items: List[ProjectItem]) -> str:
    blocks = []
    for proj in items:
        bullets = llm.invoke(
            f"Write 3 concise accomplishments (<=18 words, no percentage signs) for project '{proj.title}'. "
            "Start with a verb."
        ).content.replace('%', '').strip().split("\n")[:3]
        li = "\n".join(f"<li>{b.lstrip('•- ')}.</li>" for b in bullets)
        title = f"<strong>{proj.title}</strong>" + (f" | {proj.link}" if proj.link else "")
        blocks.append(f"{title}<ul>{li}</ul>")
    return "\n".join(blocks)

def build_education_block(items: List[EducationItem]) -> str:
    return "\n".join(
        f"<h3><em>{e.degree} ({e.year})</em></h3><p>{e.institution}</p>" for e in items
    )

def anchor(url: str, label: str) -> str:
    return f'<a href="{url}" style="color:#2563eb;text-decoration:none;">{label}</a>'

def build_contact_info(d: ResumeInput) -> str:
    links = []
    if d.linkedin:
        links.append(anchor(d.linkedin, "LinkedIn"))
    if d.github:
        links.append(anchor(d.github, "GitHub"))
    if d.devpost:
        links.append(anchor(d.devpost, "Devpost"))
    email_link = anchor(f"mailto:{d.email}", d.email)
    base = f"{d.phone} | {email_link}"
    return base + (" | " + " | ".join(links) if links else "")

# ────────── ENDPOINTS ──────────
@app.post("/generate")
async def generate_html(data: ResumeInput):
    raw_html = chain.run(
        name=data.name,
        contact_info=build_contact_info(data),
        summary=polish_summary(data.summary),
        experience_block=build_experience_block(data.experiences),
        projects_block=build_projects_block(data.projects),
        skills_text=", ".join(data.skills),
        education_block=build_education_block(data.education),
    )

    # Remove any leading/trailing non-HTML commentary
    cleaned_html = raw_html.strip()
    start_index = cleaned_html.find("<h1")
    end_index = cleaned_html.rfind("</p>")
    if start_index != -1 and end_index != -1:
        cleaned_html = cleaned_html[start_index:end_index + 4]

    return {"html": cleaned_html}


@app.post("/generate-pdf")
async def generate_pdf(data: ResumeInput):
    html_resp = await generate_html(data)
    styled = f"""
    <html><head>
      <style>
        @page {{
          size: A4;
          margin: 1cm;  /* Narrow margin (default is ~2cm) */
        }}
        body {{
          font-family: Arial, sans-serif;
          line-height: 1.55;
        }}
        h1 {{
          font-size: 32px;
          text-align: center;
          margin-bottom: 4px;
        }}
        p {{
          margin: 6px 0;
        }}
        h3 {{
          font-size: 18px;
          margin-top: 18px;
        }}
        ul {{
          margin: 8px 0;
          padding-left: 20px;
        }}
        li {{
          margin-bottom: 4px;
        }}
        a {{
          color: #2563eb;
          text-decoration: none;
        }}
      </style>
    </head>
    <body>{html_resp['html']}</body></html>
    """
    pdf_bytes = HTML(string=styled).write_pdf()
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=resume.pdf"}
    )

