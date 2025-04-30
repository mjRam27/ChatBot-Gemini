import React, { useState } from 'react';
import { fetchChatResponse } from '../Api';

const ChatInterface = ({ model }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const response = await fetchChatResponse(input, model);
        setMessages([...messages, { user: input, bot: response, model }]);
        setInput('');
    };

    return (
        <div style={{ marginTop: '20px', width: '100%' }}>
            <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{ marginBottom: '10px' }}>
                        <div><strong>You:</strong> {msg.user}</div>
                        <div><strong>{msg.model}:</strong> {msg.bot}</div>
                        <hr />
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button
                    onClick={handleSend}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;
