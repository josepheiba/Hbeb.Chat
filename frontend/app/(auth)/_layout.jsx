import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "vertical",
        animation: "slide_from_bottom",
        presentation: "modal",
        animationDuration: 200,
      }}
    />
  );
}
