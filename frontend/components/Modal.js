import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Modal = ({ visible, setVisible }) => {
  const [groupName, setGroupName] = useState("");
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

  const closeModal = () => setVisible(false);

  const handleCreateRoom = () => {
    console.log({ groupName });
    closeModal();
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
            <Text style={styles.modalSubheading}>Enter your Group name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Group name"
              onChangeText={(value) => setGroupName(value)}
            />

            <View style={styles.modalButtonContainer}>
              <Pressable style={styles.modalButton} onPress={handleCreateRoom}>
                <Text style={styles.modalText}>CREATE</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#E14D2A" }]}
                onPress={closeModal}
              >
                <Text style={styles.modalText}>CANCEL</Text>
              </Pressable>
            </View>
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
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    width: "48%",
    height: 45,
    backgroundColor: "green",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  modalText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Modal;
