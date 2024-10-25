import { View, Text, StyleSheet } from "react-native";

const Notification = () => {
  return (
    <View style={styles.container}>
      <Text>Notifications </Text>
    </View>
  );
};

styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Notification;
