import React from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ChatRoom from "../../../../components/ChatRoom";

export default function Room() {
  const { id, name } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ChatRoom roomId={id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
