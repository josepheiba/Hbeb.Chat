import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "../redux/store";
import { checkAuthStatus } from "../redux/slices/authSlice";
import CustomSplashScreen from "../components/CustomSplashScreen";

function RootLayoutNav() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace("/(tabs)/messages");
      } else {
        router.replace("/");
      }
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
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
