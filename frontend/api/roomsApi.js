import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.204:3000";

export const getRoomsApi = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const user_id = await AsyncStorage.getItem("user_id");

    const body = { token, user_id };

    console.log("Fetching messages from the server...");

    const response = await fetch(`${API_URL}/rooms`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log("Raw response:", responseText);

    let responseBody;
    try {
      responseBody = JSON.parse(responseText);
      console.log("Parsed response body:", responseBody);
    } catch (e) {
      console.log("Failed to parse response as JSON:", e);
      throw new Error("Invalid JSON response from server");
    }

    if (!response.ok) {
      console.log("API error:", responseBody);
      throw new Error(errorMessage);
    }

    return responseBody;
  } catch (e) {
    console.error("API error:", e);
    throw e;
  }
};
