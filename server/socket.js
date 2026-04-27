const { Server } = require("socket.io");

const PORT = 3001;

const io = new Server(PORT, {
  cors: {
    origin: "*",
  },
});

console.log(`Socket.IO server started on port ${PORT}`);

io.on("connection", (socket) => {
  console.log(" User connected:", socket.id);

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id);
  });
});