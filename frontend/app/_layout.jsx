import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "../redux/store";
import { loginUser, checkAuthStatus } from "../redux/thunks/authThunks";
import {
  selectIsAuthenticated,
  selectAuthLoading,
} from "../redux/selectors/authSelectors";
import CustomSplashScreen from "../components/CustomSplashScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

function RootLayoutNav() {
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const loading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        await dispatch(checkAuthStatus()).unwrap();
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsTokenChecked(true);
      }
    };

    checkToken();
  }, [dispatch]);

  useEffect(() => {
    if (isTokenChecked && !loading) {
      if (isAuthenticated) {
        console.log("User is authenticated, navigating to messages");
        router.replace("/(tabs)/messages");
      } else {
        console.log("User is not authenticated, navigating to home");
      }
    }
  }, [loading, isAuthenticated, router, isTokenChecked]);

  if (!isTokenChecked || loading) {
    return <CustomSplashScreen />;

    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <>
        <Stack.Screen
          name="(auth)"
          options={{
            animation: "slide_from_bottom",
            presentation: "modal",
            gestureDirection: "vertical",
            gestureEnabled: true,
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            animation: "fade_from_bottom",
          }}
        />
      </>
      <>
        {!isAuthenticated && (
          <Stack.Screen
            name="index"
            options={{
              animation: "fade",
            }}
          />
        )}
      </>
    </Stack>
  );
}

export default function Layout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
