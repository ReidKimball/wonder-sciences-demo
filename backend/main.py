"""Main FastAPI application for the Wonder Sciences demo backend.

This file initializes the FastAPI application, configures CORS middleware, and defines
the API endpoints for handling chat interactions and retrieving AI prompts.

Attributes:
    app (FastAPI): The main FastAPI application instance.
    PROMPTS_DIR (str): The directory where AI system prompts are stored.
"""
import os
from fastapi import FastAPI, HTTPException  # Core FastAPI framework and exception handling
from fastapi.middleware.cors import CORSMiddleware  # Middleware for handling Cross-Origin Resource Sharing
from pydantic import BaseModel, Field  # For data validation and settings management
from typing import List, Dict  # Python's standard typing library
import re  # Regular expression library for parsing AI responses

# Third-Party Libraries
from dotenv import load_dotenv  # For loading environment variables from a .env file
from langchain_google_genai import ChatGoogleGenerativeAI  # Google Generative AI chat models
from langchain.schema import HumanMessage, SystemMessage, AIMessage  # LangChain schema for message types

# Load environment variables from .env file
load_dotenv()

# --- FastAPI App Initialization ---
app = FastAPI(
    title="Wonder Sciences Demo API",
    version="1.0.0",
    description="API for the Wonder Sciences AI chat demo, powered by FastAPI and LangChain."
)

# --- CORS Middleware Configuration ---
# This allows the frontend application to communicate with this backend API.
origins = [
    "http://localhost:3000",  # Local React development server
    "https://wsdemo-app-165871915889.us-central1.run.app",  # Deployed frontend application
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Whitelisted origins
    allow_credentials=True, # Allow cookies to be sent
    allow_methods=["*"],    # Allow all HTTP methods
    allow_headers=["*"],    # Allow all request headers
)

# --- Constants ---
PROMPTS_DIR = "ai_prompts"  # Directory for storing system prompt files

# --- Pydantic Models ---

class ChatMessage(BaseModel):
    """Represents a single message in the chat history.

    Attributes:
        role (str): The role of the message sender ('user' or 'assistant').
        content (str): The text content of the message.
    """
    role: str = Field(..., description="The role of the message sender, e.g., 'user' or 'assistant'.")
    content: str = Field(..., description="The text content of the message.")

class ChatRequest(BaseModel):
    """Represents the request body for the /api/chat endpoint.

    Attributes:
        system_prompt (str): The template for the system prompt.
        system_prompt_filename (str): The filename of the selected system prompt.
        history (List[ChatMessage]): The list of previous messages in the conversation.
        user_message (str): The new message from the user.
    """
    system_prompt: str = Field(..., description="The system prompt template.")
    system_prompt_filename: str = Field(..., description="The filename of the system prompt being used.")
    history: List[ChatMessage] = Field(..., description="A list of previous chat messages.")
    user_message: str = Field(..., description="The new message from the user.")

# --- API Endpoints ---

@app.get("/api/prompts", summary="Get Available Prompts")
async def get_prompts():
    """Retrieves a list of available system prompt filenames.

    Reads the `PROMPTS_DIR` and returns a list of all files that match the
    pattern 'sys_prompt_v*.md'.

    Returns:
        List[str]: A list of available prompt filenames.
    """
    prompts = []
    for filename in os.listdir(PROMPTS_DIR):
        if filename.startswith("sys_prompt_v") and filename.endswith(".md"):
            prompts.append(filename)
    return prompts

@app.get("/api/prompts/{prompt_name}", summary="Get Prompt Content")
def get_prompt_content(prompt_name: str):
    """Fetches the content of a specific system prompt file.

    Args:
        prompt_name (str): The filename of the prompt to retrieve.

    Returns:
        dict: A dictionary containing the content of the file, or an error
              message if the file is not found.
    """
    file_path = os.path.join(PROMPTS_DIR, prompt_name)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        return {"content": content}
    raise HTTPException(status_code=404, detail="File not found")

@app.post("/api/chat", summary="Process a Chat Message")
async def chat(request: ChatRequest):
    """Processes a user's chat message and returns the AI's response.

    This endpoint takes the current chat history and a new user message,
    constructs a conversation chain, sends it to the Google Generative AI model,
    and parses the response to separate the user-facing reply from the internal
    AI analysis.

    Args:
        request (ChatRequest): The request body containing the chat history,
                               system prompt, and new user message.

    Raises:
        HTTPException: If the required API keys are not configured or if an
                       error occurs during AI model invocation.

    Returns:
        dict: A dictionary containing the AI's `reply` and internal `analysis`.
    """
    try:
        # --- Environment Variable and LLM Initialization ---
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        gemini_model = os.getenv("GEMINI_MODEL")
        if not gemini_api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY not found in .env file")
        if not gemini_model:
            raise HTTPException(status_code=500, detail="GEMINI_MODEL not found in .env file")

        llm = ChatGoogleGenerativeAI(model=gemini_model, google_api_key=gemini_api_key)

        # --- Message Construction ---
        # Dynamically replace the placeholder with the actual filename
        processed_system_prompt = request.system_prompt.replace(
            "{{SYSTEM_PROMPT_FILENAME}}", 
            request.system_prompt_filename
        )

        # Construct the list of messages for the LLM
        messages = [SystemMessage(content=processed_system_prompt)]
        for msg in request.history:
            if msg.role == 'user':
                messages.append(HumanMessage(content=msg.content))
            elif msg.role == 'assistant':
                messages.append(AIMessage(content=msg.content))
        
        messages.append(HumanMessage(content=request.user_message))

        # --- LLM Invocation ---
        response = llm.invoke(messages)
        full_response_content = response.content

        # For debugging purposes, print the full raw response from the AI
        print("--- Full AI Response ---")
        print(full_response_content)
        print("-------------------------")

        # --- Response Parsing ---
        # Extract the AI's internal analysis and the user-facing reply
        analysis_content = ""
        user_reply = full_response_content

        # Use regex to find and extract content within <AI_ANALYSIS> tags
        analysis_match = re.search(r'<AI_ANALYSIS>(.*?)</AI_ANALYSIS>', full_response_content, re.DOTALL)
        if analysis_match:
            print("Found <AI_ANALYSIS> tags.")
            analysis_content = analysis_match.group(1).strip()
            # Remove the analysis part from the user-facing reply
            user_reply = re.sub(r'<AI_ANALYSIS>.*?</AI_ANALYSIS>', '', user_reply, flags=re.DOTALL).strip()
        else:
            print("Did not find <AI_ANALYSIS> tags.")

        # For debugging purposes, print the parsed components
        print(f"\n--- Extracted Analysis ---\n{analysis_content}")
        print(f"\n--- Cleaned User Reply ---\n{user_reply}\n")

        return {"reply": user_reply, "analysis": analysis_content}

    except Exception as e:
        # Log the exception and return a generic server error
        print(f"Error during chat processing: {e}")
        raise HTTPException(status_code=500, detail=str(e))
