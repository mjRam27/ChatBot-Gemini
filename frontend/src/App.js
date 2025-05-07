import React from 'react';
import ChatInterface from './components/SearchBar';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Gemini x DeepSeek</h1>
      <ChatInterface model="gemini" />
    </div>
  );
}

export default App;
