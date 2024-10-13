import AsyncStorage from "@react-native-async-storage/async-storage";

// Replace this URL with your actual API endpoint
const API_URL = "http://127.0.0.1:3000";

export const loginApi = async ({ email, password, token, user_id }) => {
  try {
    let url = `${API_URL}/auth/signin`;
    let body = {};

    if (token && user_id) {
      console.log("Verifying token with the backend...");
      url = `${API_URL}/auth/token`;
      body = { token, user_id };
    } else {
      body = { email, password };
    }

    console.log(`Attempting to connect to ${url}`);
    console.log("Request body:", JSON.stringify(body));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("Response status:", response.status);

    // Always parse the response, regardless of status
    const responseText = await response.text();
    console.log("Raw response body:", responseText);

    let responseBody;
    try {
      responseBody = JSON.parse(responseText);
      console.log("Parsed response body:", responseBody);
    } catch (e) {
      console.log("Failed to parse response as JSON");
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
      console.log("Error message:", errorMessage);
      throw new Error(errorMessage);
    }

    console.log("Login successful, received data:", responseBody);

    // Store the token
    if (responseBody && responseBody.token) {
      await AsyncStorage.setItem("authToken", responseBody.token);
    }

    // Store the user_id if it exists in the response
    // if (responseBody && responseBody.user_id) {
    //   await AsyncStorage.setItem("user_id", responseBody.user_id.toString());
    // } else {
    //   console.warn("user_id not found in the response");
    // }

    return responseBody;
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
