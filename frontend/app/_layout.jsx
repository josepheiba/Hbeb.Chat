import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import CustomSplashScreen from "../components/CustomSplashScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    async function prepare() {
      try {
        await checkLoginStatus();
      } catch (e) {
        console.warn("Error during app preparation:", e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      setIsAuthenticated(authToken !== null);
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
      const inAuthGroup = segments[0] === "(auth)";
      const inTabsGroup = segments[0] === "(tabs)";

      if (isAuthenticated && !inTabsGroup) {
        router.replace("/(tabs)/messages");
      } else if (!isAuthenticated && !inAuthGroup) {
        router.replace("/");
      }
    }
  }, [appIsReady, isAuthenticated, segments]);

  if (!appIsReady) {
    return <CustomSplashScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="(tabs)" options={{ href: "/" }} />
      ) : (
        <>
          <Stack.Screen name="index" options={{ href: "/" }} />
          <Stack.Screen name="(auth)" />
        </>
      )}
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
