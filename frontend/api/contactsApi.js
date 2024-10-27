import AsyncStorage from "@react-native-async-storage/async-storage";
import Global from "../utils/globals";

const API_URL = Global.API_URL;

export const fetchContactsApi = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const user_id = await AsyncStorage.getItem("user_id");

    const body = { token, user_id };

    const response = await fetch(`${API_URL}/user/fetch_contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log("contacts" + responseText);
    let responseBody;
    try {
      responseBody = JSON.parse(responseText);
    } catch (e) {
      throw new Error("Invalid JSON response from server");
    }

    if (!response.ok) {
      throw new Error(responseBody.error || "Failed to fetch contacts");
    }

    return responseBody;
  } catch (error) {
    throw error;
  }
};

export const fetchFriendDetailsApi = async (friendId) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const user_id = await AsyncStorage.getItem("user_id");

    const body = { token, user_id: user_id, user: friendId };

    const response = await fetch(`${API_URL}/user/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    let responseBody;
    try {
      responseBody = JSON.parse(responseText);
    } catch (e) {
      throw new Error("Invalid JSON response from server");
    }

    if (!response.ok) {
      throw new Error(responseBody.error || "Failed to feetch friend details");
    }

    return responseBody;
  } catch (error) {
    throw error;
  }
};
