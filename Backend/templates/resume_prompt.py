from langchain.prompts import PromptTemplate

resume_prompt = PromptTemplate(
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
