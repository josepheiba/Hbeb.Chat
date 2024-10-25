import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserApi } from "../../api/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchUserData = createAsyncThunk(
  "user/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("user_id");

      if (!token || !userId) {
        throw new Error("No authentication credentials");
      }

      const response = await fetchUserApi(token, userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
