import AsyncStorage from "@react-native-async-storage/async-storage";

export const deleteRoom = async (id) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const userId = await AsyncStorage.getItem("user_id");

    const response = await fetch("http://192.168.1.42:3000/room/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        user_id: userId,
        room_id: id,
      }),
    });
    const confirmationMessage = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete room");
    }
    return confirmationMessage;
  } catch (error) {
    throw error;
  }
};
