import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",  # The address of the React frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROMPTS_DIR = "ai_prompts"

@app.get("/api/prompts")
def get_prompts():
    prompts = []
    for filename in os.listdir(PROMPTS_DIR):
        if filename.startswith("sys_prompt_v") and filename.endswith(".md"):
            prompts.append(filename)
    return prompts

@app.get("/api/prompts/{prompt_name}")
def get_prompt_content(prompt_name: str):
    file_path = os.path.join(PROMPTS_DIR, prompt_name)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        return {"content": content}
    return {"error": "File not found"}, 404
