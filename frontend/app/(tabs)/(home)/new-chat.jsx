import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../../../components/common/CustomButton";
import { sendFriendRequestApi } from "../../../api/friendRequestApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FriendSelectionScreen from "../../../components/FriendSelectionScreen";
import { useDispatch } from "react-redux";
import { createRoomApi } from "../../../api/createRoom";
import { getRooms } from "../../../redux/thunks/roomsThunks";

export default function NewChatScreen() {
  const [mode, setMode] = useState("group");
  const [inputValue, setInputValue] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showFriendSelection, setShowFriendSelection] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleBack = () => {
    router.back();
  };

  const handleAction = async () => {
    if (mode === "group") {
      if (inputValue.trim() === "") {
        Alert.alert("Error", "Please enter a group name");
        return;
      }
      try {
        const token = await AsyncStorage.getItem("authToken");
        const userId = await AsyncStorage.getItem("user_id");

        // Include the current user in the room
        const allUsers = [userId, ...selectedFriends];

        const response = await createRoomApi(
          token,
          userId,
          allUsers,
          inputValue,
        );

        if (response && response.room_id) {
          dispatch(getRooms());
          Alert.alert("Success", "Group created successfully!");
          // Optionally navigate to the new group chat
          // router.push(`/room/${response.room_id}`);
        } else {
          Alert.alert("Error", "Failed to create group.");
        }
      } catch (error) {
        console.error("Error creating group:", error);
        Alert.alert("Error", "An error occurred while creating the group.");
      }
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
    handleBack();
  };

  const toggleMode = () => {
    setMode(mode === "group" ? "friend" : "group");
    setInputValue("");
  };

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends((prevSelected) =>
      prevSelected.includes(friendId)
        ? prevSelected.filter((id) => id !== friendId)
        : [...prevSelected, friendId],
    );
  };

  if (showFriendSelection) {
    return (
      <FriendSelectionScreen
        selectedFriends={selectedFriends}
        onSelect={toggleFriendSelection}
        onClose={() => setShowFriendSelection(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {mode === "group" ? "Create Group" : "Add Friend"}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContentContainer}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={Keyboard.dismiss}
            style={styles.content}
          >
            <TextInput
              style={styles.input}
              placeholder={
                mode === "group" ? "Group name" : "Friend's username"
              }
              onChangeText={setInputValue}
              value={inputValue}
              returnKeyType="done"
              autoCapitalize="none"
            />

            {mode === "group" && (
              <>
                <View style={styles.inviteSectionContainer}>
                  <Text style={styles.inviteText}>Invite Members</Text>
                  <View style={styles.inviteSection}>
                    <TouchableOpacity
                      onPress={() => setShowFriendSelection(true)}
                      style={styles.addFriendCircle}
                    >
                      <Ionicons name="add" size={24} color="#CFD3D2" />
                    </TouchableOpacity>
                  </View>
                </View>
                {selectedFriends.length > 0 && (
                  <View style={styles.selectedCount}>
                    <Text style={styles.selectedCountText}>
                      {selectedFriends.length} friends selected
                    </Text>
                  </View>
                )}
              </>
            )}
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {mode === "group"
                ? "Add a friend instead"
                : "Create a group instead"}
            </Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <CustomButton
              title={mode === "group" ? "CREATE" : "ADD"}
              onPress={handleAction}
              text={mode === "group" ? "Create Group" : "Add Friend"}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 25 : 0, // Add padding for Android status bar
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    zIndex: 1,
  },
  backButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
  placeholder: {
    width: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inviteSectionContainer: {
    marginVertical: 16,
  },
  inviteText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  inviteSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  addFriendCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#CFD3D2",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectedCount: {
    marginTop: 8,
  },
  selectedCountText: {
    color: "#666",
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  toggleButton: {
    paddingVertical: 8,
  },
  toggleText: {
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 8,
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
  },
});
