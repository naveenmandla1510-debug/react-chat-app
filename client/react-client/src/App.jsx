import { useState } from "react";
import Join from "./Join";
import Chat from "./Chat";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);

  const joinChat = () => {
    if (username.trim()) {
      setJoined(true);
    }
  };

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div className="chat-container">
      {!joined ? (
        <Join
          username={username}
          setUsername={setUsername}
          joinChat={joinChat}
        />
      ) : (
        <Chat
          username={username}
          messages={messages}
          addMessage={addMessage}
        />
      )}
    </div>
  );
}

export default App;