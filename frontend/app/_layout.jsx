import { Slot } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "../redux/store";
import { checkAuthStatus } from "../redux/thunks/authThunks";
import {
  selectIsAuthenticated,
  selectAuthLoading,
} from "../redux/selectors/authSelectors";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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
        router.replace("/");
      } else {
        console.log("User is not authenticated, navigating to home");
        router.replace("/(auth)/login");
      }
    }
  }, [loading, isAuthenticated, router, isTokenChecked]);

  if (!isTokenChecked || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Slot />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
