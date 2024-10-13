const express = require("express");
const createError = require("http-errors");
// const morgan = require("morgan");
const connect = require("./db");
// const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Connect to MongoDB
connect();

// Morgan error logging
// app.use(morgan("dev"));
// Parse JSON
app.use(express.json());
// Cooki parser
// app.use(cookieParser());

// Routes
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const roomRouter = require("./routes/room");

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/room", roomRouter);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", (msg) => {
    console.log("Message: " + msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use(async (req, res, next) => {
  next(createError.NotFound);
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
