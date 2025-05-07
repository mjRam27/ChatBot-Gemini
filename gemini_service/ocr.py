import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
GOOGLE_API_KEY = os.getenv("GEMINI_VERTEX_API_KEY")

# Configure Vertex AI client
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")



# Send image and ask a question
async def ask_gemini_about_image_file(image_bytes: bytes, prompt: str = "What is in this image?") -> str:
    try:
        response = model.generate_content(
            contents=[
                {
                    "role": "user",
                    "parts": [
                        {"mime_type": "image/jpeg", "data": image_bytes},
                        {"text": prompt}
                    ]
                }
            ]
        )
        return response.text
    except Exception as e:
        return f" Vertex Gemini OCR Error: {e}"