import Global from "../utils/globals";

export const fetchUserApi = async (token, userId, frienId = null) => {
  try {
    const response = await fetch(`${Global.API_URL}/user/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        user_id: userId,
        frienId: frienId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetch user request:", error);
    throw error;
  }
};
