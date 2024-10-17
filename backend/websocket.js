const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");

function setupWebSocket(server) {
  const io = socketIo(server);

  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      jwt.verify(
        socket.handshake.auth.token,
        "temporary_secret_key",
        (err, decoded) => {
          if (err) return next(new Error("Authentication error"));
          socket.decoded = decoded;
          next();
        },
      );
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Authenticated user connected: ${socket.decoded.id}`);

    // Handle incoming messages
    socket.on("message", (data) => {
      console.log(`Received: ${data}`);
      socket.emit("message", `You sent: ${data}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
}

module.exports = setupWebSocket;
