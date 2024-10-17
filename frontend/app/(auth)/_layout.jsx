import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="welcome"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
