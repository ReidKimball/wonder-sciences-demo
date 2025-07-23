import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage, AIMessage

load_dotenv()

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

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    system_prompt: str
    history: List[ChatMessage]
    user_message: str

@app.get("/api/prompts")
async def get_prompts():
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

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        gemini_model = os.getenv("GEMINI_MODEL")
        if not gemini_api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY not found in .env file")
        if not gemini_model:
            raise HTTPException(status_code=500, detail="GEMINI_MODEL not found in .env file")

        llm = ChatGoogleGenerativeAI(model=gemini_model, google_api_key=gemini_api_key)

        messages = [SystemMessage(content=request.system_prompt)]
        for msg in request.history:
            if msg.role == 'user':
                messages.append(HumanMessage(content=msg.content))
            elif msg.role == 'assistant':
                messages.append(AIMessage(content=msg.content))
        
        messages.append(HumanMessage(content=request.user_message))

        response = llm.invoke(messages)
        return {"reply": response.content}

    except Exception as e:
        print(f"Error during chat processing: {e}")
        raise HTTPException(status_code=500, detail=str(e))
