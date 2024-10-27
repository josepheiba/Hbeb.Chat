import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Global from "../utils/globals";

const socket = io(Global.API_URL, {
  autoConnect: false,
  auth: async (cb) => {
    const token = await AsyncStorage.getItem("authToken");
    cb({ token });
  },
});

export default socket;
