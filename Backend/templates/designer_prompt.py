from langchain.prompts import PromptTemplate

designer_prompt = PromptTemplate(
    input_variables=["name", "contact_info", "summary", "experience_block", "projects_block", "skills_text", "education_block", "portfolio_link"],
    template=r"""
<h1 style="text-align:center;"><strong>{name}</strong></h1>
<p style="text-align:center;">{contact_info}</p>

<h2>SUMMARY</h2>
<p>{summary}</p>

<h2>DESIGN EXPERIENCE</h2>
{experience_block}

<h2>PROJECTS</h2>
{projects_block}

<h2>SKILLS</h2>
<p>{skills_text}</p>

<h2>EDUCATION</h2>
{education_block}

<h2>PORTFOLIO</h2>
<p>{portfolio_link}</p>
"""
)
