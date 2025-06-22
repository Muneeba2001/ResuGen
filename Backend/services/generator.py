# services/generator.py
import os
from typing import Dict
from templates import get_prompt_by_category

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain

from models.resume import (
    ResumeInput,
    ExperienceItem,
    ProjectItem,
    EducationItem,
)

from utils.helpers import build_contact_info  # anchor() no longer needed

# ---- load env & initialise LLM --------------------------------------------
load_dotenv()

llm = ChatOpenAI(
    model="openai/gpt-4o-mini",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
    temperature=0.7,
)

# ---- import category-specific prompts -------------------------------------
from templates import get_prompt_by_category  # centralised map of templates


# ----------------- helper builders (common for all categories) -------------
def polish_summary(raw: str) -> str:
    """AI-polish the summary into 1–2 crisp lines."""
    return (
        llm.invoke(
            f"Improve the following resume summary to be concise, professional, "
            f"under 50 words:\n\n{raw}"
        )
        .content.strip()
    )


def build_experience_block(items: list[ExperienceItem]) -> str:
    blocks = []
    for job in items:
        bullets = (
            llm.invoke(
                f"Write 3 concise bullets (<=18 words, no percentage signs) for a "
                f"{job.title} at {job.company}."
            )
            .content.replace("%", "")
            .strip()
            .split("\n")[:3]
        )
        li = "\n".join(f"<li>{b.lstrip('•- ')}.</li>" for b in bullets)
        blocks.append(
            f"<h3><em>{job.company} | {job.title} ({job.duration})</em></h3><ul>{li}</ul>"
        )
    return "\n".join(blocks)


def build_projects_block(items: list[ProjectItem]) -> str:
    blocks = []
    for proj in items:
        bullets = (
            llm.invoke(
                f"Write 3 concise accomplishments (<=18 words, no percentage signs) "
                f"for project '{proj.title}'. Start with a verb."
            )
            .content.replace("%", "")
            .strip()
            .split("\n")[:3]
        )
        li = "\n".join(f"<li>{b.lstrip('•- ')}.</li>" for b in bullets)
        title = f"<strong>{proj.title}</strong>" + (f" | {proj.link}" if proj.link else "")
        blocks.append(f"{title}<ul>{li}</ul>")
    return "\n".join(blocks)


def build_education_block(items: list[EducationItem]) -> str:
    return "\n".join(
        f"<h3><em>{e.degree} ({e.year})</em></h3><p>{e.institution}</p>" for e in items
    )


# --------------- main entry -------------------------------------------------
def generate_resume_html(data: ResumeInput) -> str:
    """
    Pick the right prompt for `data.category`, fill all required variables,
    run the LLM, and return clean HTML.
    """
    prompt = get_prompt_by_category(data.category)
    chain = LLMChain(llm=llm, prompt=prompt)

    # --- core context every template is likely to need ----------------------
    ctx: Dict[str, str] = {
        "name": data.name,
        "contact_info": build_contact_info(data),
        "summary": polish_summary(data.summary),
        "experience_block": build_experience_block(data.experiences),
        "projects_block": build_projects_block(data.projects),
        "skills_text": ", ".join(data.skills),
        "education_block": build_education_block(data.education),
    }

    # --- ensure any extra variables required by the template exist ---------
    for var in prompt.input_variables:
        ctx.setdefault(var, "")  # leave blank if we didn't build it

    # --- run chain & return cleaned html -----------------------------------
    return chain.run(**ctx).strip()
