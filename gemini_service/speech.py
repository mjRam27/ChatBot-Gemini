import os
import speech_recognition as sr
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GEMINI_VERTEX_API_KEY")

# Configure Vertex AI client
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")


# Convert uploaded audio to text
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


# Convert from microphone input
def convert_microphone_to_text() -> str:
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print(" Speak now...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)
    try:
        return recognizer.recognize_google(audio)
    except sr.UnknownValueError:
        return "Sorry, could not understand the audio."
    except sr.RequestError as e:
        return f"Request error: {e}"


# Ask Gemini using transcribed text
async def ask_gemini_from_transcript(transcribed_text: str) -> str:
    try:
        response = model.generate_content(
            contents=[
                {
                    "role": "user",
                    "parts": [{"text": transcribed_text}]
                }
            ]
        )
        return response.text
    except Exception as e:
        return f" Vertex Gemini Speech Error: {e}"
