from fastapi import FastAPI, Request, UploadFile, File
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
import httpx
import io

# 🧠 Chat logic
from chat import ask_gemini

# 🖼️ OCR logic
from PIL import Image
import pytesseract
from ocr import extract_text_from_image_file

# 🎙️ Speech-to-text logic
import speech_recognition as sr
from speech import convert_audio_to_text, convert_microphone_to_text


app = FastAPI()

@app.post("/chat")
async def chat_endpoint(request: Request):
    try:
        data = await request.json()
        user_input = data["message"]
        response = await ask_gemini(user_input)
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}

@app.post("/ocr")
async def ocr_endpoint(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        text = extract_text_from_image_file(contents)
        response = await ask_gemini(text)
        return {
            "extracted_text": text,
            "response": response
        }
    except Exception as e:
        return {"error": str(e)}


@app.post("/speech2text")
async def speech_to_text_endpoint(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as f:
            f.write(contents)

        transcript = convert_audio_to_text(file_path)
        os.remove(file_path)

        response = await ask_gemini(transcript)

        return {
            "transcription": transcript,
            "response": response
        }

    except Exception as e:
        return {"error": str(e)}
