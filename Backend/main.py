from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.resume import router as resume_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router)
