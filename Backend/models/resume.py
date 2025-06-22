from pydantic import BaseModel
from typing import List, Optional

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
    category: str 
    name: str
    phone: str
    email: str
    linkedin: Optional[str] = None
    github: Optional[str] = None
    devpost: Optional[str] = None
    summary: str
    experiences: List[ExperienceItem]
    projects: List[ProjectItem]
    skills: List[str]
    education: List[EducationItem]
