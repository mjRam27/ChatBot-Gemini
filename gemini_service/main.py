from fastapi import FastAPI, Request, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import httpx
import io

# Load environment variables
load_dotenv()

# Chat logic
from chat import ask_gemini

# OCR logic
from PIL import Image
import pytesseract
from ocr import ask_gemini_about_image_file



# Speech-to-text logic
import speech_recognition as sr
from speech import convert_audio_to_text, ask_gemini_from_transcript

# Create app
app = FastAPI()

# CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chat endpoint
@app.post("/chat")
async def chat_endpoint(request: Request):
    try:
        data = await request.json()
        user_input = data.get("message")  # safer with .get
        if not user_input:
            return {"error": "Missing message input."}
        
        response = await ask_gemini(user_input)
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}

# OCR + chat endpoint
@app.post("/ocr")
async def ocr_endpoint(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        response = await ask_gemini_about_image_file(contents)
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}



# Speech to text + chat endpoint


@app.post("/speech2text")
async def speech_to_text_endpoint(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as f:
            f.write(contents)

        transcript = convert_audio_to_text(file_path)
        os.remove(file_path)

        # Call Gemini only if transcription is valid
        response = await ask_gemini_from_transcript(transcript) if transcript else None

        return {
            "transcription": transcript,
            "response": response
        }

    except Exception as e:
        return {"error": str(e)}

