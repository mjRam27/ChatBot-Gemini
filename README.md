# ChatBot-Gemini

A multimodal AI chatbot powered by **Gemini (via OpenRouter)** with a fullstack architecture combining **React + FastAPI**, supporting:

-  Speech-to-Text via microphone or uploaded audio
-  Image OCR using Google Vision
-  Text chat powered by Gemini AI
-  Dockerized frontend, backend & MongoDB integration

---

##  Why ChatBot-Gemini?

This project demonstrates how to build a production-grade AI chatbot that supports **multimodal inputs** and integrates:

- Modern frontend architecture (React, hooks, modular UI)
- Microservice-style backend (FastAPI + MongoDB)
- Real-time speech + image processing
- Gemini 1.5 Flash model via OpenRouter

---

## ⚙️ Features

| Feature | Description |
|--------|-------------|
| Speech-to-Text | Users can record via mic or upload `.webm` / `.wav` files |
| OCR | Upload an image and extract text using Google Cloud Vision |
|  Text Chat | Ask questions, get contextual answers from Gemini |
| Docker | Run entire stack with `docker-compose` |

---

##  Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/mjRam27/ChatBot-Gemini.git
cd ChatBot-Gemini

**2.Add Environment Variables**
GEMINI_VERTEX_API_KEY=your_openrouter_api_key
GOOGLE_APPLICATION_CREDENTIALS=/app/gcp-key.json.json
OCR_APPLICATION_CREDENTIALS=/app/ocr-key.json.json

**3. Start the Project **
docker-compose up --build


