import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import roomsReducer from "./slices/roomsSlice";
// Import other reducers

const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    // Add other reducers here
  },
});

export default store;
