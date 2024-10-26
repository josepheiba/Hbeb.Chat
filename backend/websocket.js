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

          const messages = await Message.find({ room: room_id })
            .sort({ timestamp: -1 })
            .limit(20)
            .populate("sender", "username email")
            .lean();

          console.log(`Found ${messages.length} messages for room ${room_id}`);
          console.log("Emitting previous_messages event");

          const formattedMessages = messages.map((msg) => ({
            _id: msg._id,
            sender: msg.sender,
            content: msg.content,
            timestamp: msg.timestamp,
          }));

          socket.emit("previous_messages", {
            messages: formattedMessages.reverse(),
            hasMore: messages.length === 20,
          });
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
      await message.populate("sender", "username email");

      // Update room's lastActivity
      await Room.findByIdAndUpdate(room_id, { lastActivity: new Date() });

      console.log(
        `Received in room ${room_id}:`,
        `\n  Content: ${content}`,
        `\n  Sender ID: ${message.sender._id}`,
        `\n  Sender Email: ${message.sender.email}`,
      );
      io.to(room_id).emit("message", {
        _id: message._id,
        sender: message.sender,
        content: message.content,
        timestamp: message.timestamp,
      });
    });

    socket.on("load_more_messages", async ({ room_id, lastMessageId }) => {
      try {
        const room = await Room.findOne({
          _id: room_id,
          users: socket.decoded.id,
        });

        if (!room) {
          socket.emit("error", "Not allowed to access this room");
          return;
        }

        // Get messages older than the last message
        const messages = await Message.find({
          room: room_id,
          _id: { $lt: new mongoose.Types.ObjectId(lastMessageId) },
        })
          .sort({ _id: -1 })
          .limit(20)
          .populate("sender", "username email")
          .lean();

        console.log(
          `Found ${messages.length} more messages for room ${room_id}`,
        );

        if (messages.length === 0) {
          socket.emit("more_messages", {
            messages: [],
            hasMore: false,
          });
          return;
        }

        const formattedMessages = messages.map((msg) => ({
          _id: msg._id,
          sender: msg.sender,
          content: msg.content,
          timestamp: msg.timestamp,
        }));

        socket.emit("more_messages", {
          messages: formattedMessages.reverse(),
          hasMore: messages.length === 20,
        });
      } catch (error) {
        console.error("Error loading more messages:", error);
        socket.emit("error", "Failed to load more messages");
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

module.exports = setupWebSocket;
