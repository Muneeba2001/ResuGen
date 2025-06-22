from models.resume import ResumeInput

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
