export const createRoomApi = async (token, userId, users, inputValue) => {
  try {
    const response = await fetch("http://192.168.1.42:3000/room/create", {
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
