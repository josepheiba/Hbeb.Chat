// expo-route/app/_layout.jsx
import React from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../redux/store";
import AuthChecker from "../components/AuthChecker";

export default function AppLayout() {
  return (
    <Provider store={store}>
      <AuthChecker />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </Provider>
  );
}
