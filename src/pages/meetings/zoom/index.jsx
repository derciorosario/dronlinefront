import { useState, useEffect } from 'react';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const [ws, setWs] = useState(null);
  let mediaRecorder = null;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Explicitly set WebM with Opus codec
      const mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        throw new Error('audio/webm;codecs=opus not supported in this browser');
      }
      mediaRecorder = new MediaRecorder(stream, { mimeType });

      const socket = new WebSocket('ws://localhost:8080');
      socket.onopen = () => {
        console.log('WebSocket connected');
        setError('');
      };
      socket.onmessage = (event) => {
        if (event.data.startsWith('Error')) {
          setError(event.data);
        } else {
          setTranscription((prev) => prev + ' ' + event.data);
          setError('');
        }
      };
      socket.onclose = () => {
        console.log('WebSocket closed');
        setError('WebSocket connection closed');
      };
      socket.onerror = () => {
        setError('WebSocket error occurred');
      };
      setWs(socket);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
          console.log(`Sending audio chunk, size: ${event.data.size} bytes`);
          socket.send(event.data);
        }
      };
      mediaRecorder.start(1000); // Send chunks every 1 second
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone or setting up recorder:', err);
      setError(`Failed to start recording: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    if (ws) {
      ws.close();
    }
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      if (ws) ws.close();
      if (mediaRecorder) {
        mediaRecorder.stream?.getTracks().forEach(track => track.stop());
      }
    };
  }, [ws]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Real-Time Transcription</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={startRecording}
            disabled={isRecording}
            className={`px-4 py-2 rounded ${
              isRecording ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            Start Recording
          </button>
          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className={`px-4 py-2 rounded ${
              !isRecording ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
            } text-white`}
          >
            Stop Recording
          </button>
        </div>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="border p-4 rounded h-64 overflow-y-auto">
          <p className="text-gray-800">{transcription || 'Transcription will appear here...'}</p>
        </div>
      </div>
    </div>
  );
}

export default App;