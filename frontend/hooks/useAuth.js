import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    async function loadToken() {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        try {
          await dispatch(loginUser({ token })).unwrap();
        } catch (e) {
          console.error("Error authenticating with token:", e);
          await AsyncStorage.removeItem("authToken");
        }
      }
      setIsLoading(false);
    }
    loadToken();
  }, [dispatch]);

  return { isLoading, isAuthenticated };
}
