
import { useEffect, useState } from "react";
import { socket } from "./socket";

function Chat({ username, messages, addMessage }) {
  const [message, setMessage] = useState("");
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      addMessage({ ...data, self: false });
    });

    return () => socket.off("receive_message");
  }, []);

  // ✅ SEND TEXT MESSAGE
  const sendMessage = () => {
    if (!message.trim()) return;

    const data = {
      user: username,
      type: "text",
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", data);
    addMessage({ ...data, self: true });
    setMessage("");
  };

  // ✅ START RECORDING
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const audioChunks = [];

    recorder.ondataavailable = (e) => audioChunks.push(e.data);

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      sendVoice(audioBlob);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  // ✅ STOP RECORDING
  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  // ✅ SEND VOICE MESSAGE
  const sendVoice = (audioBlob) => {
    const reader = new FileReader();

    reader.readAsArrayBuffer(audioBlob);
    reader.onloadend = () => {
      const data = {
        user: username,
        type: "audio",
        audio: reader.result,
      };

      socket.emit("send_message", data);
      addMessage({ ...data, self: true });
    };
  };

  return (
    <>
      <h2 className="chat-title">React Chat</h2>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.self ? "self" : ""}`}>
            <strong>{msg.user}</strong>

            {msg.type === "text" && <p>{msg.text}</p>}

            {msg.type === "audio" && (
              <audio
                controls
                src={URL.createObjectURL(
                  new Blob([msg.audio], { type: "audio/webm" })
                )}
              />
            )}
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>

      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop 🎙️" : "Record 🎙️"}
      </button>
    </>
  );
}

export default Chat;

