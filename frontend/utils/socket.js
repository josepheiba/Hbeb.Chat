import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const socket = io("http://localhost:3000", {
  autoConnect: false,
  auth: async (cb) => {
    const token = await AsyncStorage.getItem("authToken");
    cb({ token });
  },
});

// Add event listeners for connection status
socket.on("connect", () => {
  console.log("Socket connected successfully");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

export default socket;
