import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../redux/store";
import { loginUser } from "../redux/slices/authSlice";

export const checkAuthStatus = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      // Attempt to login with the stored token
      const result = await store.dispatch(loginUser({ token })).unwrap();
      console.log("Auth check result:", result);
      return result.user != null;
    }
  } catch (error) {
    console.error("Error checking authentication status:", error);
  }
  return false;
};
