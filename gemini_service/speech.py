# Gemini_service/speech.py

import os
import httpx
import speech_recognition as sr
from dotenv import load_dotenv

load_dotenv()
OPENROUTER_API_KEY = os.getenv("GEMINI_API_KEY")

# 🎙️ Transcribe uploaded audio file
def convert_audio_to_text(audio_path: str) -> str:
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        audio = recognizer.record(source)
    try:
        return recognizer.recognize_google(audio)
    except sr.UnknownValueError:
        return "Sorry, could not understand the audio."
    except sr.RequestError as e:
        return f"Request error: {e}"

# 🎤 Transcribe from microphone
def convert_microphone_to_text() -> str:
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("🎙️ Speak now...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)
    try:
        return recognizer.recognize_google(audio)
    except sr.UnknownValueError:
        return "Sorry, could not understand the audio."
    except sr.RequestError as e:
        return f"Request error: {e}"

# 🤖 Send transcript to Gemini
async def ask_gemini_from_transcript(transcribed_text: str) -> str:
    if not OPENROUTER_API_KEY:
        return "API key missing."

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",  # frontend origin
                    "X-Title": "Gemini Speech Bot"
                },
                json={
                    "model": "google/gemini-2.5-pro-exp-03-25:free",
                    "messages": [{"role": "user", "content": transcribed_text}]
                }
            )
        result = response.json()
        print("📢 Gemini Speech Raw Response:", result)
        return result["choices"][0]["message"]["content"] if "choices" in result else "No valid response."

    except Exception as e:
        return f"❌ Gemini Speech Chat Error: {e}"
