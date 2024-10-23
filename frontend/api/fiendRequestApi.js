export const sendFriendRequestApi = async (token, userId, friendEmail) => {
  try {
    const response = await fetch(
      "http://192.168.1.42:3000/user/friend_request",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          token,
          user_id: userId,
          friendemail: friendEmail,
        }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
};
