import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { sendFriendRequestApi } from "../api/fiendRequestApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CustomButton from "./common/CustomButton";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Modal = ({ visible, setVisible }) => {
  const [mode, setMode] = useState("group"); // "group" or "friend"
  const [inputValue, setInputValue] = useState("");
  const [animation] = useState(new Animated.Value(SCREEN_HEIGHT));

  useEffect(() => {
    if (visible) {
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const closeModal = () => {
    setVisible(false);
    setMode("group");
    setInputValue("");
  };

  const handleAction = async () => {
    if (mode === "group") {
      console.log("Create group:", inputValue);
      // Implement group creation logic here
    } else {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const userId = await AsyncStorage.getItem("user_id");

        const response = await sendFriendRequestApi(token, userId, inputValue);
        if (response && response._id) {
          Alert.alert("Success", "Friend request sent successfully!");
        } else {
          Alert.alert(
            "Error",
            response.message || "Failed to send friend request.",
          );
        }
      } catch (error) {
        console.error("Error sending friend request:", error);
        Alert.alert(
          "Error",
          "An error occurred while sending the friend request.",
        );
      }
    }
    closeModal();
  };

  const toggleMode = () => {
    setMode(mode === "group" ? "friend" : "group");
    setInputValue("");
  };

  if (!visible) return null;

  return (
    <TouchableWithoutFeedback onPress={closeModal}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ translateY: animation }] },
            ]}
          >
            <View style={styles.handle} />
            <Text style={styles.modalSubheading}>
              {mode === "group" ? "Create Group" : "Add Friend"}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder={
                mode === "group" ? "Group name" : "Friend's username"
              }
              onChangeText={(value) => setInputValue(value)}
              value={inputValue}
            />

            <View style={styles.buttonContainer}>
              <CustomButton
                title={mode === "group" ? "CREATE" : "ADD"}
                onPress={handleAction}
                text={mode === "group" ? "Create Group" : "Add Friend"}
              />
            </View>

            <TouchableWithoutFeedback onPress={toggleMode}>
              <Text style={styles.toggleText}>
                {mode === "group"
                  ? "Add a friend instead"
                  : "Create a group instead"}
              </Text>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#00000030",
    borderRadius: 3,
    marginBottom: 10,
  },
  modalSubheading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 15,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 15,
  },
  toggleText: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});

export default Modal;
