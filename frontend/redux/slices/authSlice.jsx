import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const storeAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem("authToken", token);
  } catch (e) {
    console.error("Failed to save auth token");
  }
};

async function validateTokenAndGetUser(token) {
  // This should call your backend to validate the token
  // and return the user information
  // For now, let's just return a mock user
  return { id: 1, name: "Auto Logged In User" };
}

/**
 * Redux Toolkit async thunk for user login.
 * This thunk can handle both token-based and email/password-based authentication.
 *
 * @function loginUser
 * @async
 * @param {Object} credentials - The login credentials.
 * @param {string} [credentials.email] - The user's email (required for email/password login).
 * @param {string} [credentials.password] - The user's password (required for email/password login).
 * @param {string} [credentials.token] - An existing authentication token (for token-based login).
 * @param {Object} thunkAPI - The Redux Toolkit thunk API object.
 * @param {Function} thunkAPI.rejectWithValue - A function to return a rejected action with a custom payload.
 * @returns {Promise<Object>} A promise that resolves to an object containing user data and token.
 * @throws Will throw an error if login fails.
 */
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password, token }, { rejectWithValue }) => {
    console.log("recieved email and password:", email, password);
    try {
      console.log("Trying to login...");
      let user;
      let newToken;
      let response = null;

      if (token) {
        // Logic to validate token and get user info
        console.log("Using saved token:", token);
        user = await validateTokenAndGetUser(token);
        newToken = token;
      } else {
        console.log("No token found, trying email/password login...");
        response = await fetch("http://192.168.1.42:3000/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        console.log("response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Login failed");
        }

        const data = await response.json(); // Assuming the API returns a JSON object with a user and token
        console.log("Login response data:", data);
        user = data.user_id;
        newToken = data.token;

        await storeAuthToken(newToken);
      }

      return { user, token: newToken };
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(error.message);
    }
  },
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, { dispatch }) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      try {
        return await dispatch(loginUser({ token })).unwrap();
      } catch (error) {
        console.error("Error checking auth status:", error);
        await AsyncStorage.removeItem("authToken");
      }
    }
    return null;
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
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
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
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
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

export const { setAuthenticated, logout, clearError } = authSlice.actions;

export default authSlice.reducer;
