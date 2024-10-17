// expo-route/components/AuthChecker.jsx
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "../redux/thunks/authThunks";
import SplashScreen from "./SplashScreen";
import { selectIsAuthenticated } from "../redux/selectors/authSelectors";

const AuthChecker = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const checkAuth = async () => {
      const resultAction = await dispatch(checkAuthStatus());
      setLoading(false);
      if (checkAuthStatus.fulfilled.match(resultAction)) {
        if (resultAction.payload) {
          console.log("User authenticated");
          router.replace("/(tabs)/(home)/messages"); // Redirect to home if authenticated
        } else {
          console.log("User not authenticated");
          router.replace("/(auth)/welcome"); // Redirect to welcome if not authenticated
        }
      } else {
        console.log("Authentication check failed");
        router.replace("/(auth)/welcome"); // Redirect to welcome if authentication check fails
      }
    };

    checkAuth();
  }, [dispatch, router]);

  return null; // This component doesn't render anything
};

export default AuthChecker;
