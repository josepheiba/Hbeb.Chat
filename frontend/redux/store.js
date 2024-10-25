import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import roomsReducer from "./slices/roomsSlice";
import userReducer from "./slices/userSlice";
// Import other reducers

const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    user: userReducer,
    // Add other reducers here
  },
});

export default store;
