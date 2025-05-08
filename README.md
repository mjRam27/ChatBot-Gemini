Here’s the updated `README.md` reflecting your latest changes:

---

# ChatBot-Gemini x DeepSeek

A multimodal AI chatbot powered by **Gemini 1.5 Flash** and **DeepSeek R1** integrated into a single frontend. Built with **React + FastAPI**, it supports:

* Parallel LLM responses from Gemini and DeepSeek
* Speech-to-text via microphone or uploaded audio
* Image OCR using Google Vision API
* Realtime text chat with both models
* Fully containerized deployment via Docker

---

## 🚀 Highlights

| Feature        | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| Dual LLMs      | Sends user prompts to both Gemini and DeepSeek simultaneously |
| Speech-to-Text | Record via mic or upload `.webm` / `.wav` files               |
| OCR            | Extract text from uploaded images                             |
| Chat Interface | Compare responses side-by-side                                |
| Tech Stack     | React, FastAPI, MongoDB, Docker, Google Cloud                 |

---

## 📦 Stack Details

* **Frontend:** React, Axios, Hooks-based UI
* **Backend - Gemini:** FastAPI + Google Generative AI SDK (`gemini-1.5-flash`)
* **Backend - DeepSeek:** FastAPI + OpenRouter API (`deepseek-chat-R1`)
* **Database:** MongoDB (for logging chat history)
* **Deployment:** Google App Engine + Docker Compose

---

## 🛠 Setup

### 1. Clone the Repo

```bash
git clone https://github.com/mjRam27/ChatBot-Gemini.git
cd ChatBot-Gemini
```

### 2. Add Environment Variables

**For Gemini Service (.env):**

```
GEMINI_VERTEX_API_KEY=your_google_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
```

**For DeepSeek Service (.env):**

```
DEEPSEEK_API_KEY=your_openrouter_api_key
MONGODB_URI=your_mongodb_connection_string
```

### 3. Run the Project

```bash
docker-compose up --build
```

---

## 🌐 Deployment Notes

* Gemini and DeepSeek backends deployed on **Google App Engine**.
* Frontend sends requests to both model endpoints simultaneously.
* Responses are shown side-by-side in the chat UI for easy comparison.

---


