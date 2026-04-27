
function Join({ username, setUsername, joinChat }) {
  return (
    <>
      <h2 className="chat-title">Join Chat</h2>

      <input
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button onClick={joinChat}>Join</button>
    </>
  );
}

export default Join;

