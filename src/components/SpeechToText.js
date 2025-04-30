import React, { useRef, useState } from 'react';
import { sendSpeechToText } from '../api';

const SpeechInput = ({ onText, model }) => {
    const mediaRecorderRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [chunks, setChunks] = useState([]);

    const handleRecord = async () => {
        if (!recording) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            setChunks([]);

            mediaRecorder.ondataavailable = (e) => {
                setChunks((prev) => [...prev, e.data]);
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const text = await sendSpeechToText(blob, model);
                onText(text);
            };

            mediaRecorder.start();
            setRecording(true);
        } else {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    return <button onClick={handleRecord}>{recording ? '🛑 Stop' : '🎤 Speak'}</button>;
};

export default SpeechInput;
