# Gemini_service/ocr.py

import os
import io
import httpx
from PIL import Image
from dotenv import load_dotenv
import pytesseract

load_dotenv()

OPENROUTER_API_KEY = os.getenv("GEMINI_API_KEY")

def extract_text_from_image_file(image_bytes: bytes) -> str:
    try:
        image = Image.open(io.BytesIO(image_bytes))
        return pytesseract.image_to_string(image).strip()
    except Exception as e:
        return f"❌ OCR extraction error: {e}"

async def ask_gemini_about_image_text(extracted_text: str) -> str:
    if not OPENROUTER_API_KEY:
        return "API key missing."

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",  # should match frontend origin
                    "X-Title": "Gemini OCR Bot"
                },
                json={
                    "model": "google/gemini-2.5-pro-exp-03-25:free",
                    "messages": [
                        {"role": "user", "content": extracted_text}
                    ]
                }
            )
        result = response.json()
        print("📦 Gemini OCR Raw Response:", result)
        return result["choices"][0]["message"]["content"] if "choices" in result else "No valid response."

    except Exception as e:
        return f"❌ Gemini OCR Chat Error: {e}"
