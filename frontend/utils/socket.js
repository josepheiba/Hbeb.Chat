import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const socket = io("http://192.168.1.42:3000", {
  autoConnect: false,
  auth: async (cb) => {
    const token = await AsyncStorage.getItem("authToken");
    cb({ token });
  },
});

export default socket;
