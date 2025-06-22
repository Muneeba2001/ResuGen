from langchain.prompts import PromptTemplate

banker_prompt = PromptTemplate(
    input_variables=["name", "contact_info", "summary", "experience_block", "skills_text", "education_block", "achievements_block"],
    template=r"""
<h1 style="text-align:center;"><strong>{name}</strong></h1>
<p style="text-align:center;">{contact_info}</p>

<h2>SUMMARY</h2>
<p>{summary}</p>

<h2>FINANCIAL EXPERIENCE</h2>
{experience_block}

<h2>SKILLS</h2>
<p>{skills_text}</p>

<h2>EDUCATION</h2>
{education_block}

<h2>ACHIEVEMENTS</h2>
{achievements_block}
"""
)
