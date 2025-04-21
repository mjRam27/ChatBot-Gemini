import React, { useState } from 'react';
import SpeechToText from './components/SpeechToText';
import ImageToText from './components/ImageToText';
import SearchBar from './components/SearchBar';

function App() {
  const [inputText, setInputText] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Gemini + DeepSeek Interface</h1>
      <SpeechToText onResult={setInputText} />
      <ImageToText onResult={setInputText} />
      <div className="p-4 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">📝 Query</h2>
        <textarea
          className="w-full p-2 border rounded"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>
      <SearchBar searchText={inputText} />
    </div>
  );
}

export default App;
