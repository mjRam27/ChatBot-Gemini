import os
import speech_recognition as sr
from dotenv import load_dotenv
from pydub import AudioSegment
import google.generativeai as genai

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GEMINI_VERTEX_API_KEY")

# Configure Vertex AI client
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")


# Convert .webm audio to .wav for compatibility with speech recognition
def convert_webm_to_wav(input_path: str) -> str:
    output_path = input_path.replace(".webm", ".wav")
    audio = AudioSegment.from_file(input_path, format="webm")
    audio.export(output_path, format="wav")
    return output_path


# Transcribe uploaded audio file to text
def convert_audio_to_text(audio_path: str) -> str:
    if audio_path.endswith(".webm"):
        audio_path = convert_webm_to_wav(audio_path)

    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        audio = recognizer.record(source)
    try:
        return recognizer.recognize_google(audio)
    except sr.UnknownValueError:
        return "Sorry, could not understand the audio."
    except sr.RequestError as e:
        return f"Request error: {e}"


# Send transcribed text to Gemini model for response
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
        return f"Vertex Gemini Speech Error: {e}"
