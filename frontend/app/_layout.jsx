// expo-route/app/_layout.jsx
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../redux/store";
import AuthChecker from "../components/AuthChecker";
import socket from "../utils/socket";

export default function AppLayout() {
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

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
