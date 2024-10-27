import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginApi, registerApi } from "../../api/authApi"; // Assuming you have an API file
import socket from "../../utils/socket";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const user_id = await AsyncStorage.getItem("user_id");
      console.log("Token and user_id", token, user_id);
      if (token && user_id) {
        // Validate the token with your backend
        const response = await loginApi({ token, user_id });
        return response;
      }
      return null;
    } catch (error) {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user_id");
      return rejectWithValue(error.message || "Authentication failed");
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Disconnect socket before removing credentials
      if (socket.connected) {
        socket.disconnect();
        console.log("Socket disconnected during logout");
      }

      // Remove stored credentials
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user_id");
      console.log("Credentials removed");

      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      return rejectWithValue("Failed to logout");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerApi(userData);
      return response.data;
    } catch (error) {
      console.log("error at registerUser thunk");
      return rejectWithValue(error.response.data);
    }
  },
);
