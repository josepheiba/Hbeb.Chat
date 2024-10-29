import AsyncStorage from "@react-native-async-storage/async-storage";
import Global from "../utils/globals";

// Replace this URL with your actual API endpoint
const API_URL = Global.API_URL;

export const loginApi = async ({ email, password, token, user_id }) => {
  try {
    let url = `${API_URL}/auth/signin`;
    let body = {};
    let isEmailPasswordLogin = false;

    if (token && user_id) {
      // console.log("Verifying token with the backend...");
      url = `${API_URL}/auth/token`;
      body = { token, user_id };
    } else {
      body = { email, password };
      isEmailPasswordLogin = true;
    }

    // console.log(`Attempting to connect to ${url}`);
    // console.log("Request body:", JSON.stringify(body));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // console.log("Login successful, received data:", responseBody);

    // console.log("Response status:", response.status);

    // Read the response as text first
    const responseText = await response.text();
    // console.log("Raw response:", responseText);

    let responseBody;
    try {
      responseBody = JSON.parse(responseText);
      // console.log("Parsed response body:", responseBody);
    } catch (e) {
      // console.log("Failed to parse response as JSON:", e);
      throw new Error("Invalid JSON response from server");
    }

    if (!response.ok) {
      let errorMessage;
      if (responseBody && typeof responseBody === "object") {
        if (responseBody.error) {
          errorMessage = responseBody.error;
        } else if (responseBody.message) {
          errorMessage = responseBody.message;
        } else {
          // If there are field-specific errors
          const errors = [];
          if (responseBody.email) errors.push(`Email: ${responseBody.email}`);
          if (responseBody.password)
            errors.push(`Password: ${responseBody.password}`);
          errorMessage =
            errors.length > 0 ? errors.join(", ") : "Unknown error";
        }
      } else {
        errorMessage = responseText || `HTTP error! status: ${response.status}`;
      }
      // console.log("Error message:", errorMessage);
      throw new Error(errorMessage);
    }

    if (isEmailPasswordLogin) {
      if (responseBody && responseBody.token) {
        // console.log("Storing the token..." + responseBody.token);
        await AsyncStorage.setItem("authToken", responseBody.token);
      }

      if (responseBody && responseBody.user_id) {
        // console.log("Storing the user_id..." + responseBody.user_id);
        await AsyncStorage.setItem("user_id", responseBody.user_id.toString());
      }
      if (responseBody && responseBody.profilePicture) {
        // console.log("Storing the profilePicture..." + responseBody.profilePicture);
        await AsyncStorage.setItem(
          "user_profilePicture",
          responseBody.profilePicture,
        );
      }
      if (responseBody && responseBody.email) {
        // console.log("Storing the email..." + responseBody.email);
        await AsyncStorage.setItem("user_email", responseBody.email);
      }
      if (responseBody && responseBody.name) {
        // console.log("Storing the name..." + responseBody.name);
        await AsyncStorage.setItem("user_name", responseBody.name);
      }
    }

    return responseBody;
  } catch (error) {
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
    if (data.token && data.user_id) {
      // console.log("Storing the token..." + data.token);
      await AsyncStorage.setItem("authToken", data.token);
      await AsyncStorage.setItem("user_id", data.user_id);
    }

    return data;
  } catch (error) {
    // console.log("error at registerUser authapi.js");
    // console.error("Registration error:", error);
    throw error;
  }
};
