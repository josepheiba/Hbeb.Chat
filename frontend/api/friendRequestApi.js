import Global from "../utils/globals";

export const sendFriendRequestApi = async (token, userId, friendEmail) => {
  try {
    const response = await fetch(`${Global.API_URL}/user/friend_request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        user_id: userId,
        email: friendEmail,
      }),
    });

    console.log(userId);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
};

export const acceptFriendRequestApi = async (token, userId, friendId) => {
  try {
    const response = await fetch(
      "http://192.168.1.42:3000/user/friend_accept",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          user_id: userId,
          friend_id: friendId,
        }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
};

export const rejectFriendRequestApi = async (token, userId, friendId) => {
  try {
    const response = await fetch("http://localhost:3000/user/friend_reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        user_id: userId,
        friend_id: friendId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    throw error;
  }
};

export const rejectFriendRequestApi = async (token, userId, friendId) => {
  try {
    const response = await fetch("http://localhost:3000/user/friend_reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        user_id: userId,
        friend_id: friendId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    throw error;
  }
};
