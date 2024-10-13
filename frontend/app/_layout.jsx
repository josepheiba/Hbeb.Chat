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
  const [isLoading, setIsLoading] = useState(true);
  const loading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        await dispatch(checkAuthStatus()).unwrap();
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    console.log("rendering...");
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/(tabs)/messages");
      } else {
        router.replace("/");
      }
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <CustomSplashScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          animation: "fade",
        }}
      />
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
