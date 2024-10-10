import React from "react";
import { View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function CustomSplashScreen() {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#c51e6a", "#FF8C00", "#FFD700"]}
        start={[0, 0]}
        end={[1, 1]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      ></LinearGradient>
    </View>
  );
}
