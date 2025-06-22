from .developer_prompt import developer_prompt
from .teacher_prompt import teacher_prompt
from .doctor_prompt import doctor_prompt
from .banker_prompt import banker_prompt
from .designer_prompt import designer_prompt

def get_prompt_by_category(category: str):
    return {
        "developer": developer_prompt,
        "teacher": teacher_prompt,
        "doctor": doctor_prompt,
        "banker": banker_prompt,
        "designer": designer_prompt,
    }.get(category, developer_prompt)  # fallback default
