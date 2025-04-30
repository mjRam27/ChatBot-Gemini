import axios from 'axios';

// Gemini Endpoints
const GEMINI_BASE = 'http://localhost:8002';

// DeepSeek Endpoints
const DEEPSEEK_BASE = 'http://localhost:8003'; // Example port for DeepSeek

// Use model = 'gemini' or 'deepseek'
export const fetchChatResponse = async (text, model) => {
    const BASE = model === 'deepseek' ? DEEPSEEK_BASE : GEMINI_BASE;
    const res = await axios.post(`${BASE}/chat`, { prompt: text });
    return res.data.response;
};

export const sendSpeechToText = async (audioBlob, model) => {
    const BASE = model === 'deepseek' ? DEEPSEEK_BASE : GEMINI_BASE;
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const res = await axios.post(`${BASE}/speech2text`, formData);
    return res.data.text;
};

export const sendImageToOCR = async (imageFile, model) => {
    const BASE = model === 'deepseek' ? DEEPSEEK_BASE : GEMINI_BASE;
    const formData = new FormData();
    formData.append('image', imageFile);

    const res = await axios.post(`${BASE}/ocr`, formData);
    return res.data.text;
};
