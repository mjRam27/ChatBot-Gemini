import React, { useState } from 'react';
import ChatInterface from './components/SearchBar';
import SpeechInput from './components/SpeechToText';
import ImageUploader from './components/ImageToText';
import './App.css';

function App() {
  const [model, setModel] = useState('gemini');

  return (
    <div className="App">
      <h1>Gemini x DeepSeek AI Assistant 🤖</h1>

      <div>
        <label htmlFor="modelSelect"><strong>Choose a model:</strong></label>{' '}
        <select id="modelSelect" value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="gemini">Gemini</option>
          <option value="deepseek">DeepSeek</option>
        </select>
      </div>

      <SpeechInput model={model} />
      <ImageUploader model={model} />
      <ChatInterface model={model} />
    </div>
  );
}

export default App;
