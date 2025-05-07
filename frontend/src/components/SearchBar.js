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
    const fileToSend = recordedBlob || pendingFile;

    if (fileToSend) {
      const formData = new FormData();
      formData.append('file', fileToSend, recordedBlob ? 'mic.webm' : fileToSend.name);
      const isAudio = fileToSend.type.startsWith('audio/');
      const endpoint = isAudio ? 'speech2text' : 'ocr';

      const messageIndex = messages.length;
      const initialUserBlock = (
        <div>
          {!recordedBlob && <div>[Uploaded {isAudio ? 'Audio' : 'Image'}]</div>}
          {previewURL && isAudio && <audio controls src={previewURL} style={{ marginTop: '5px' }} />}
          {previewURL && !isAudio && <img src={previewURL} alt="preview" style={{ maxWidth: '200px', marginTop: '5px' }} />}
        </div>
      );

      setMessages([...messages, { user: initialUserBlock, gemini: '⏳', deepseek: '⏳' }]);

      const geminiReq = axios.post(`http://localhost:8002/${endpoint}`, formData);
      const deepseekReq = axios.post(`http://localhost:8001/${endpoint}`, formData);

      geminiReq.then(res => {
        setMessages(prev => {
          const updated = [...prev];
          updated[messageIndex].user = (
            <div>
              {!recordedBlob && <div>[Uploaded {isAudio ? 'Audio' : 'Image'}]</div>}
              {previewURL && isAudio && <audio controls src={previewURL} style={{ marginTop: '5px' }} />}
              {previewURL && !isAudio && <img src={previewURL} alt="preview" style={{ maxWidth: '200px', marginTop: '5px' }} />}
              {res.data.transcription && <div style={{ fontStyle: 'italic', marginTop: '5px' }}>{res.data.transcription}</div>}
            </div>
          );
          updated[messageIndex].gemini = res.data.response || 'No Gemini response';
          return updated;
        });
      }).catch(() => {
        setMessages(prev => {
          const updated = [...prev];
          updated[messageIndex].gemini = 'Gemini error';
          return updated;
        });
      });

      deepseekReq.then(res => {
        setMessages(prev => {
          const updated = [...prev];
          updated[messageIndex].deepseek = res.data.response || 'No DeepSeek response';
          return updated;
        });
      }).catch(() => {
        setMessages(prev => {
          const updated = [...prev];
          updated[messageIndex].deepseek = 'DeepSeek error';
          return updated;
        });
      });

      setPendingFile(null);
      setPreviewURL(null);
      setRecordedBlob(null);
      setInput('');
    } else if (input.trim()) {
      const userMessage = input;
      const messageIndex = messages.length;
      setInput('');

      setMessages([...messages, { user: userMessage, gemini: '⏳', deepseek: '⏳' }]);

      const geminiReq = axios.post('http://localhost:8002/chat', { message: userMessage });
      const deepseekReq = axios.post('http://localhost:8001/chat', { message: userMessage });

      geminiReq.then(res => {
        setMessages(prev => {
          const updated = [...prev];
          updated[messageIndex].gemini = res.data.response;
          return updated;
        });
      }).catch(() => {
        setMessages(prev => {
          const updated = [...prev];
          updated[messageIndex].gemini = 'Gemini error';
          return updated;
        });
      });

      deepseekReq.then(res => {
        setMessages(prev => {
          const updated = [...prev];
          updated[messageIndex].deepseek = res.data.response;
          return updated;
        });
      }).catch(() => {
        setMessages(prev => {
          const updated = [...prev];
          updated[messageIndex].deepseek = 'DeepSeek error';
          return updated;
        });
      });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setPendingFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewURL(reader.result);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('audio/')) {
      setPreviewURL(URL.createObjectURL(file));
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

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedBlob(audioBlob);

        const formData = new FormData();
        formData.append('file', audioBlob, 'mic.webm');

        try {
          const response = await axios.post("http://localhost:8002/speech2text", formData);
          const transcription = response.data.transcription;
          if (transcription) {
            setInput(transcription);
          } else {
            alert("⚠️ Could not transcribe audio. Please try again clearly.");
          }
        } catch (err) {
          alert("Speech-to-text failed. Please try again.");
        }
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
      <div style={{ flex: 1, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div><strong>You:</strong> {msg.user}</div>
            <div><strong>Gemini:</strong> {msg.gemini}</div>
            <div><strong>DeepSeek:</strong> {msg.deepseek}</div>
            <hr />
          </div>
        ))}
      </div>

      {pendingFile && (
        <div style={{ paddingBottom: '10px' }}>
          {pendingFile.type.startsWith('image/') && previewURL && (
            <img src={previewURL} alt="preview" style={{ maxWidth: '200px', marginTop: '5px' }} />
          )}
          {pendingFile.type.startsWith('audio/') && previewURL && (
            <audio controls src={previewURL} style={{ marginTop: '5px' }} />
          )}
        </div>
      )}

      <input id="hidden-file-input" type="file" accept="image/*,audio/*" style={{ display: 'none' }} onChange={handleFileUpload} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px' }}>
        <button onClick={triggerFileInput} title="Upload file" style={{ padding: '10px', fontSize: '20px', cursor: 'pointer' }}>➕</button>

        <button
          onClick={handleRecord}
          title={recording ? "Stop recording" : "Start recording"}
          style={{
            width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #ccc',
            backgroundColor: recording ? '#f8d7da' : '#fff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '18px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}>
          🎤
        </button>

        <input
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
          placeholder="Type a message or use the mic..."
        />

        <button
          onClick={handleSend}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
