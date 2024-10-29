import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSegments } from "expo-router";

export default function TabLayout() {
  const segment = useSegments();
  const page = segment[segment.length - 1];
  const pagesToHideTabBar = ["new-chat", "[id]"];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#24786D",
        tabBarStyle: {
          // height: 70,
          // borderTopWidth: 0.1,
          borderTopColor: "#797C7B",
          backgroundColor: "#fff",
          display: pagesToHideTabBar.includes(page) ? "none" : "flex",
        },
        tabBarLabelStyle: {
          // fontSize: 14,
          // marginBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-outline"
              size={size - 1}
              color={color}
              style={{ marginTop: 12 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          title: "Calls",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="call-outline"
              size={size - 1}
              color={color}
              style={{ marginTop: 12 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: "Contacts",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="people-outline"
              size={size - 1}
              color={color}
              style={{ marginTop: 12 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="settings-outline"
              size={size - 1}
              color={color}
              style={{ marginTop: 12 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
