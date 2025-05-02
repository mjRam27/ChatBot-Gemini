import os
import httpx
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("GEMINI_VERTEX_API_KEY")

async def ask_gemini(user_input: str) -> str:
    if not GOOGLE_API_KEY:
        return "Vertex API key missing."

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url=f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key={GOOGLE_API_KEY}",
                headers={
                    "Content-Type": "application/json"
                },
                json={
                    "contents": [
                        {
                            "role": "user",
                            "parts": [
                                {"text": user_input}
                            ]
                        }
                    ]
                }
            )

        result = response.json()
        print(" Vertex Gemini Response:", result)

        return result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "No response.")

    except Exception as e:
        return f" Vertex Gemini Chat Error: {e}"
