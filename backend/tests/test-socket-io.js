const io = require("socket.io-client");
const readline = require("readline");

// The JWT token provided
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MGIyODFmOGIzYzBjMjViNjFmYjkzYSIsImlhdCI6MTcyOTk3NjkyMCwiZXhwIjoxNzMwMjM2MTIwfQ.5oS2fX_zpnGEpZUcmBeKf0JWGV7iPPbZMMnNMzsxGE4";
// Room ID variable
const roomId = "671d59a4139d42a3cc79bf02";

// Connect to the server using the token in the `auth` option
const socket = io("http://localhost:3000", {
  auth: {
    token: token,
  },
});

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Listen for connection success
socket.on("connect", () => {
  console.log("Successfully connected to the WebSocket server!");

  // Join the room
  socket.emit("join_room", roomId);

  console.log(
    "Type your message and press Enter to send. Type 'exit' to quit.",
  );

  // Start listening for user input
  getUserInput();
});

// Handle disconnection
socket.on("disconnect", () => {
  console.log("Disconnected from the server.");
  rl.close();
});

// Handle connection errors
socket.on("connect_error", (err) => {
  console.error(`Connection error: ${err.message}`);
  rl.close();
});

socket.on("message", (data) => {
  const identifier = data.sender.username || data.sender.email;
  console.log(`[${data.sender._id}] ${identifier}: ${data.content}`);
});

let oldestMessageId = null;

socket.on("previous_messages", (data) => {
  console.log("\nPrevious messages:");
  if (data.messages.length > 0) {
    data.messages.forEach((message) => {
      const identifier = message.sender.username || message.sender.email;
      console.log(`[${message.sender._id}] ${identifier}: ${message.content}`);
    });
    oldestMessageId = data.messages[0]._id; // Get first message ID (oldest)
  }
  console.log(
    data.hasMore
      ? "\nType 'load' to load more messages."
      : "\nNo more messages to load.",
  );
  console.log("\n");
});

socket.on("more_messages", (data) => {
  if (data.messages.length === 0) {
    console.log("\nNo more messages to load.");
    oldestMessageId = null;
    return;
  }

  console.log("\nOlder messages:");
  data.messages.forEach((message) => {
    const identifier = message.sender.username || message.sender.email;
    console.log(`[${message.sender._id}] ${identifier}: ${message.content}`);
  });

  if (data.messages.length > 0) {
    oldestMessageId = data.messages[0]._id; // Get first message ID (oldest)
  }

  console.log(
    data.hasMore
      ? "\nType 'load' to load more messages."
      : "\nNo more messages to load.",
  );
  console.log("\n");
});

function getUserInput() {
  rl.question("", (input) => {
    if (input.toLowerCase() === "exit") {
      console.log("Exiting...");
      socket.disconnect();
      rl.close();
      return;
    }

    if (input.toLowerCase() === "load") {
      if (oldestMessageId) {
        console.log("Loading older messages...");
        socket.emit("load_more_messages", {
          room_id: roomId,
          lastMessageId: oldestMessageId,
        });
      } else {
        console.log("No more messages to load.");
      }
      getUserInput();
      return;
    }

    // Add this back for sending messages
    const message = {
      room_id: roomId,
      content: input,
    };
    console.log(`Sending: ${JSON.stringify(message)}`);
    socket.emit("message", message);

    getUserInput(); // Continue listening for input
  });
}
