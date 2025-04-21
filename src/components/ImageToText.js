import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const ImageToText = ({ onResult }) => {
    const [text, setText] = useState('');

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        Tesseract.recognize(file, 'eng').then(({ data: { text } }) => {
            setText(text);
            onResult(text);
        });
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow">
            <h2 className="text-xl mb-2 font-semibold">🖼️ Image to Text</h2>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {text && <p className="mt-2 p-2 bg-gray-100 rounded">{text}</p>}
        </div>
    );
};

export default ImageToText;

