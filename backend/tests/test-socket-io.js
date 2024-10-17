const io = require("socket.io-client");

// The JWT token provided
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MGIyYmQ2NzA2NWU3MWIzODA1MWU3ZSIsImlhdCI6MTcyOTE5ODcyMCwiZXhwIjoxNzI5NDU3OTIwfQ.2GYnfb2Ps8HlWF1YWNNlL7RIJuwlBEydSDTMWFDg3Xg";

// Connect to the server using the token in the `auth` option
const socket = io("http://localhost:3000", {
  auth: {
    token: token, // Ensure the token is passed in the auth object
  },
});

// Listen for connection success
socket.on("connect", () => {
  console.log("Successfully connected to the WebSocket server!");

  // Send a message to the server
  socket.emit("message", "Hello from client!");

  // Listen for server's response
  socket.on("message", (data) => {
    console.log(`Server responded: ${data}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Disconnected from the server.");
  });

  // Keep sending messages
  sendPeriodicMessages();
});

// Handle connection errors
socket.on("connect_error", (err) => {
  console.error(`Connection error: ${err.message}`);
});

function sendPeriodicMessages() {
  let messageCount = 1;
  setInterval(() => {
    const message = `Periodic message ${messageCount}`;
    console.log(`Sending: ${message}`);
    socket.emit("message", message);
    messageCount++;
  }, 5000); // Send a message every 5 seconds
}
