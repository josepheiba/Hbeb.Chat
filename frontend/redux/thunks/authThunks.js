import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginApi, registerApi } from "../../api/authApi"; // Assuming you have an API file

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  },
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        // Validate the token with your backend
        const response = await loginApi({ token });
        return response;
      }
      return null;
    } catch (error) {
      await AsyncStorage.removeItem("authToken");
      return rejectWithValue(error.message || "Authentication failed");
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem("authToken");
      console.log("Token removed");
      return true; // Indicate successful logout
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
