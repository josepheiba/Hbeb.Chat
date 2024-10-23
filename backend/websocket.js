const jwt = require("jsonwebtoken");
const Message = require("./models/message");
const Room = require("./models/room");
const mongoose = require("mongoose");

function setupWebSocket(io) {
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
    socket.on("join_room", async (room_id) => {
      try {
        const room = await Room.findOne({
          _id: room_id,
          users: socket.decoded.id,
        });
        if (room) {
          socket.join(room_id);
          console.log(`User ${socket.decoded.id} joined room ${room_id}`);
        } else {
          socket.emit("error", "Not allowed to join this room");
          console.log(
            `User ${socket.decoded.id} is not allowed to join room ${room_id}`,
          );
        }
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", "Failed to join room");
      }
    });

    // Handle incoming messages
    socket.on("message", async ({ room_id, content }) => {
      if (!socket.rooms.has(room_id)) {
        socket.emit("error", "Not allowed to send messages to this room");
        return;
      }
      const message = new Message({
        content,
        sender: socket.decoded.id,
        room: room_id,
        readBy: [socket.decoded.id],
      });
      await message.save();

      // Update room's lastActivity
      await Room.findByIdAndUpdate(room_id, { lastActivity: new Date() });

      console.log(`Received in room ${room_id}: ${content}`);
      io.to(room_id).emit("message", {
        _id: message._id,
        user_id: socket.decoded.id,
        content: content,
        timestamp: message.timestamp,
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

module.exports = setupWebSocket;
