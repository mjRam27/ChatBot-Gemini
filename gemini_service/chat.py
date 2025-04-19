import os
import httpx
from dotenv import load_dotenv

load_dotenv()
OPENROUTER_API_KEY = os.getenv("GEMINI_API_KEY")

async def ask_gemini(user_input: str) -> str:
    if not OPENROUTER_API_KEY:
        return "API key missing."

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:8002",
                    "X-Title": "Gemini ChatBot"
                },
                json={
                    "model": "google/gemini-pro",  # <-- Confirm this matches your model access
                    "messages": [{"role": "user", "content": user_input}]
                }
            )

        result = response.json()
        print("🔍 Gemini Raw Response:", result)

        if "choices" in result and result["choices"]:
            return result["choices"][0]["message"]["content"]
        else:
            return "No valid response."

    except Exception as e:
        print("❌ Gemini API Error:", e)
        return "Something went wrong. Check logs."
