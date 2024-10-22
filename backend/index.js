const express = require("express");
const connect = require("./db");
const http = require("http");
const { Server } = require("socket.io");
const setupWebSocket = require("./websocket");
const morgan = require("morgan");

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connect();

// Setup WebSocket with admin UI
const io = new Server(server);

// Setup WebSocket
setupWebSocket(io);

// Add morgan middleware for logging HTTP requests
app.use(morgan("dev")); // Add this line

// Parse JSON
app.use(express.json());

// Routes
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const roomRouter = require("./routes/room");

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/room", roomRouter);

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
