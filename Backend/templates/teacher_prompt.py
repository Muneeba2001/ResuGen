from langchain.prompts import PromptTemplate

teacher_prompt = PromptTemplate(
    input_variables=[
        "name", "contact_info", "summary",
        "experience_block", "skills_text",
        "education_block", "certifications_block"
    ],
    template=r"""
<h1 style="text-align:center;font-size:32px;margin-bottom:4px;">
  <strong>{name}</strong>
</h1>
<p style="text-align:center;">{contact_info}</p>

<p style="font-size:18px;font-weight:700;margin-top:18px;"><strong>SUMMARY</strong></p>
<p>{summary}</p>

<p style="font-size:18px;font-weight:700;margin-top:18px;"><strong>TEACHING EXPERIENCE</strong></p>
{experience_block}

<p style="font-size:18px;font-weight:700;margin-top:18px;"><strong>SKILLS</strong></p>
<p>{skills_text}</p>

<p style="font-size:18px;font-weight:700;margin-top:18px;"><strong>EDUCATION</strong></p>
{education_block}

<p style="font-size:18px;font-weight:700;margin-top:18px;"><strong>CERTIFICATIONS</strong></p>
{certifications_block}
"""
)
