import os
from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from models.resume import ResumeInput, ExperienceItem, ProjectItem, EducationItem
from templates.resume_prompt import resume_prompt
from utils.helpers import build_contact_info, anchor
from dotenv import load_dotenv
load_dotenv()

llm = ChatOpenAI(
    model="openai/gpt-4o-mini",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
    temperature=0.7,
)
chain = LLMChain(llm=llm, prompt=resume_prompt)

def polish_summary(summary: str) -> str:
    return llm.invoke(
        f"Improve the following resume summary to be concise, professional, under 50 words:\n\n{summary}"
    ).content.strip()

def build_experience_block(experiences: list[ExperienceItem]) -> str:
    blocks = []
    for job in experiences:
        bullets = llm.invoke(
            f"Write 3 concise bullets (<=18 words, no percentage signs) for a {job.title} at {job.company}."
        ).content.replace('%', '').strip().split("\n")[:3]
        li = "\n".join(f"<li>{b.lstrip('•- ')}.</li>" for b in bullets)
        blocks.append(
            f"<h3><em>{job.company} | {job.title} ({job.duration})</em></h3><ul>{li}</ul>"
        )
    return "\n".join(blocks)

def build_projects_block(projects: list[ProjectItem]) -> str:
    blocks = []
    for proj in projects:
        bullets = llm.invoke(
            f"Write 3 concise accomplishments (<=18 words, no percentage signs) for project '{proj.title}'. Start with a verb."
        ).content.replace('%', '').strip().split("\n")[:3]
        li = "\n".join(f"<li>{b.lstrip('•- ')}.</li>" for b in bullets)
        title = f"<strong>{proj.title}</strong>" + (f" | {proj.link}" if proj.link else "")
        blocks.append(f"{title}<ul>{li}</ul>")
    return "\n".join(blocks)

def build_education_block(education: list[EducationItem]) -> str:
    return "\n".join(
        f"<h3><em>{e.degree} ({e.year})</em></h3><p>{e.institution}</p>" for e in education
    )

def generate_resume_html(data: ResumeInput) -> str:
    return chain.run(
        name=data.name,
        contact_info=build_contact_info(data),
        summary=polish_summary(data.summary),
        experience_block=build_experience_block(data.experiences),
        projects_block=build_projects_block(data.projects),
        skills_text=", ".join(data.skills),
        education_block=build_education_block(data.education),
    ).strip()
