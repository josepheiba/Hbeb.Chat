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
      // console.log("Token and user_id", token, user_id);
      if (token && user_id) {
        const response = await loginApi({ token, user_id });
        return response;
      }
      return null;
    } catch (error) {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user_id");
      await AsyncStorage.removeItem("user_email");
      await AsyncStorage.removeItem("user_name");
      await AsyncStorage.removeItem("user_profilePicture");
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
      await AsyncStorage.removeItem("user_email");
      await AsyncStorage.removeItem("user_name");
      await AsyncStorage.removeItem("user_profilePicture");
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
      // Replace this with your actual API call
      const response = await registerApi(userData);

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
