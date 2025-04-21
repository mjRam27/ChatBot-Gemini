import React, { useState } from 'react';

const SpeechToText = ({ onResult }) => {
    const [listening, setListening] = useState(false);
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        onResult(text);
    };

    const startListening = () => {
        recognition.start();
        setListening(true);
    };

    const stopListening = () => {
        recognition.stop();
        setListening(false);
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow">
            <h2 className="text-xl mb-2 font-semibold">🎙️ Speech to Text</h2>
            <button
                onClick={listening ? stopListening : startListening}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                {listening ? 'Stop' : 'Start'} Listening
            </button>
        </div>
    );
};

export default SpeechToText;
