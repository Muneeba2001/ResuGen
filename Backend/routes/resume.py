from fastapi import APIRouter, Response
from models.resume import ResumeInput
from services.generator import generate_resume_html
from services.pdf import generate_pdf_from_html

router = APIRouter()

@router.post("/generate")
async def generate(data: ResumeInput):
    html = generate_resume_html(data)
    return {"html": html}

@router.post("/generate-pdf")
async def generate_pdf(data: ResumeInput):
    html = generate_resume_html(data)
    pdf = generate_pdf_from_html(html)
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=resume.pdf"}
    )
