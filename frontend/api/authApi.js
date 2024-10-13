import AsyncStorage from "@react-native-async-storage/async-storage";

// Replace this URL with your actual API endpoint
const API_URL = "http://192.168.1.204:3000";

export const loginApi = async ({ email, password, token }) => {
  try {
    let url = `${API_URL}/auth/signin`;
    let body = {};

    if (token) {
      console.log("Verifying token with the backend...");
      url = `${API_URL}/auth/verify-token`;
      body = { token };
    } else {
      body = { email, password };
    }

    console.log(`Attempting to connect to ${url}`);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      console.log("Response not okay:", response);
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    console.log("Login successful, received data:", data);

    // Store the token
    await AsyncStorage.setItem("authToken", data.token);

    return data;
  } catch (error) {
    console.log("Error in loginApi:");
    console.error(error);
    throw error;
  }
};

export const registerApi = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data = await response.json();

    // Store the token if it's returned upon registration
    if (data.token) {
      await AsyncStorage.setItem("authToken", data.token);
    }

    return data;
  } catch (error) {
    console.log("error at registerUser authapi.js");
    console.error("Registration error:", error);
    throw error;
  }
};
