export const fetchUserApi = async (token, userId) => {
  try {
    const response = await fetch("http://localhost:3000/user/fetch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        user_id: userId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetch user request:", error);
    throw error;
  }
};
