import React, { useRef, useState } from 'react';
import { sendSpeechToText } from '../Api';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

const SpeechInput = ({ onText }) => {
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
        const webmBlob = new Blob(chunks, { type: 'audio/webm' });

        // Convert WebM to WAV using ffmpeg.wasm
        if (!ffmpeg.isLoaded()) await ffmpeg.load();
        ffmpeg.FS('writeFile', 'input.webm', await fetchFile(webmBlob));
        await ffmpeg.run('-i', 'input.webm', 'output.wav');
        const wavData = ffmpeg.FS('readFile', 'output.wav');
        const wavBlob = new Blob([wavData.buffer], { type: 'audio/wav' });

        const text = await sendSpeechToText(wavBlob); // ensure this expects .wav
        onText(text);
      };

      mediaRecorder.start();
      setRecording(true);
    } else {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <button onClick={handleRecord} title="Record audio">
      {recording ? '🛑 Stop' : '🎤 Speak'}
    </button>
  );
};

export default SpeechInput;
