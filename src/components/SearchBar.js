import React, { useRef, useState } from 'react';
import axios from 'axios';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [pendingFile, setPendingFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);

  const handleSend = async () => {
    let userBlock = null;
    let botResponse = '';

    const fileToSend = recordedBlob || pendingFile;

    if (fileToSend) {
      const formData = new FormData();
      formData.append('file', fileToSend);

      const isAudio = fileToSend.type.startsWith('audio/');
      const endpoint = isAudio ? 'speech2text' : 'ocr';

      try {
        const response = await axios.post(`http://localhost:8002/${endpoint}`, formData);
        botResponse = response.data.response;

        userBlock = (
          <div>
            <div>[Uploaded {isAudio ? 'Audio' : 'Image'}]</div>
            {!isAudio && previewURL && (
              <img src={previewURL} alt="preview" style={{ maxWidth: '200px', marginTop: '5px' }} />
            )}
            {input && <div style={{ marginTop: '5px' }}>{input}</div>}
          </div>
        );
      } catch (err) {
        botResponse = '❌ Failed to process file.';
        userBlock = `[Upload Error]`;
      }

      setPendingFile(null);
      setPreviewURL(null);
      setRecordedBlob(null);
      setInput('');
    } else if (input.trim()) {
      const response = await axios.post('http://localhost:8002/chat', { message: input });
      botResponse = response.data.response;
      userBlock = input;
      setInput('');
    } else {
      return; // skip if both input and file are empty
    }

    setMessages([...messages, { user: userBlock, bot: botResponse }]);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setPendingFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewURL(null);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('hidden-file-input').click();
  };

  const handleRecord = async () => {
    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedBlob(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
    } else {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div style={{ marginTop: '20px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '100vh' }}>
      <div style={{
        flex: 1,
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginBottom: '10px'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div><strong>You:</strong> {msg.user}</div>
            <div><strong>Gemini:</strong> {msg.bot}</div>
            <hr />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px' }}>
        <input
          id="hidden-file-input"
          type="file"
          accept="image/*,audio/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <button onClick={triggerFileInput} title="Upload file" style={{ padding: '10px', fontSize: '20px', cursor: 'pointer' }}>➕</button>
        <button onClick={handleRecord} title="Record" style={{ padding: '10px', fontSize: '20px', cursor: 'pointer' }}>{recording ? '🛑' : '🎤'}</button>

        <input
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          value={input || ''}
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
