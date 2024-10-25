const io = require("socket.io-client");
const readline = require("readline");

// The JWT token provided
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTEyOTcxYjY1NzViYWVhY2JiZGY2NyIsImlhdCI6MTcyOTYzNDA4NywiZXhwIjoxNzI5ODkzMjg3fQ.ZXXDQ_1Ab6UlNiNGIHr9EtYH_iD_LJkACVJ5egayEDo";
// Room ID variable
const roomId = "670c24a15da3df5f5ad3ce42";

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

// Update the previous_messages handler
socket.on("previous_messages", (data) => {
  console.log("\nPrevious messages:");
  data.messages.forEach((message) => {
    const identifier = message.sender.username || message.sender.email;
    console.log(`[${message.sender._id}] ${identifier}: ${message.content}`);
  });
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

    const message = {
      room_id: roomId,
      content: input,
    };
    console.log(`Sending: ${JSON.stringify(message)}`);
    socket.emit("message", message);

    getUserInput(); // Continue listening for input
  });
}
