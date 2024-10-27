import Global from "../utils/globals";

const API_URL = Global.API_URL;

export const createRoomApi = async (token, userId, users, inputValue) => {
  try {
    const response = await fetch(`${API_URL}/room/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        user_id: userId,
        users: users,
        name: inputValue,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create room");
    }
    return data;
  } catch (error) {
    throw error;
  }
};
