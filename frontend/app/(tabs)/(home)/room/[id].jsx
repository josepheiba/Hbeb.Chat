import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Room() {
  const { id, name } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat with {name}</Text>
      <Text>Conversation ID: {id}</Text>
      {/* Add your chat UI components here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
