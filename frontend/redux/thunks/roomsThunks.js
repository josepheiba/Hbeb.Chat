import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRoomsApi, createRoomApi } from "../../api/roomsApi";

export const getRooms = createAsyncThunk(
  "rooms/getRooms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRoomsApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  },
);

export const createRoom = createAsyncThunk(
  "rooms/roomsThunks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await createRoomApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  },
);
