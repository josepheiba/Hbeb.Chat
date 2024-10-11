import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const mockUsers = [
  { id: 1, email: "user@example.com", name: "John Doe" },
  { id: 2, email: "admin@example.com", name: "Admin User" },
];

const storeAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem("authToken", token);
  } catch (e) {
    console.error("Failed to save auth token");
  }
};

// Mock login function
const mockLoginApi = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email);
      if (user && password === "password123") {
        resolve({ user, token: "mock-auth-token" });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 1000); // Simulate network delay
  });
};

// Mock signup function
const mockSignupApi = (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockUsers.some((u) => u.email === userData.email)) {
        reject(new Error("Email already in use"));
      } else {
        const newUser = { id: mockUsers.length + 1, ...userData };
        mockUsers.push(newUser);
        resolve({ user: newUser });
      }
    }, 1000); // Simulate network delay
  });
};

async function validateTokenAndGetUser(token) {
  // This should call your backend to validate the token
  // and return the user information
  // For now, let's just return a mock user
  return { id: 1, name: "Auto Logged In User" };
}

// Action creators are generated for each case reducer function
// Create an async thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password, token }, { rejectWithValue }) => {
    try {
      let user;
      let newToken;
      if (token) {
        // Logic to validate token and get user info
        // This might involve a call to your backend
        console.log("Using saved token:", token);
        user = await validateTokenAndGetUser(token);
        newToken = token;
      } else {
        const response = await mockLoginApi(email, password);
        user = response.user;
        newToken = response.token;
        await AsyncStorage.setItem("authToken", response.token);
      }
      return { user, token: newToken };

      // const response = await fetch("YOUR_API_ENDPOINT/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ email, password }),
      // });

      // if (!response.ok) {
      //   throw new Error("Login failed");
      // }

      // const data = await response.json();
      // return data.user; // Assuming the API returns a user object
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Add the register action
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      // For testing, use the mock signup function
      const { user } = await mockSignupApi(userData);
      return user;

      // Uncomment below for real API call
      // const response = await fetch("YOUR_API_ENDPOINT/register", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(userData),
      // });
      // if (!response.ok) {
      //   throw new Error("Registration failed");
      // }
      // const data = await response.json();
      // return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAuthState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        // You might want to store the token in the state as well
        state.token = action.payload.token;
      })
      // Add register reducers
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.Success = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
        state.user = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
