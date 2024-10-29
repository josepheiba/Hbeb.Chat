import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { Ionicons, Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRooms } from "../../../redux/thunks/roomsThunks";
import { fetchUserData } from "../../../redux/thunks/userThunks";
import ProtectedRoute from "../../../components/common/ProtectedRoute";
import ConversationItem from "../../../components/messages/ConversationItem";
import StoryItem from "../../../components/messages/StoryItem";
import { deleteRoom } from "../../../api/deleteRoom";

// Dummy data for stories and conversations
const stories = [
  { id: "1", name: "John", image: "https://via.placeholder.com/50" },
  { id: "2", name: "Sarah", image: "https://via.placeholder.com/50" },
  { id: "3", name: "Mike", image: "https://via.placeholder.com/50" },
  { id: "4", name: "Emma", image: "https://via.placeholder.com/50" },
  { id: "5", name: "David", image: "https://via.placeholder.com/50" },
];

import socket from "../../../utils/socket";

const ios = Platform.OS === "ios";

export default function Messages() {
  const dispatch = useDispatch();
  const { rooms, loading, error } = useSelector((state) => state.rooms);
  const { userData } = useSelector((state) => state.user);
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch the logged-in user's ID from AsyncStorage
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("user_id");
      setUserId(id);
    };

    fetchUserId();

    // Connect to socket when component mounts
    socket.connect();
    console.log("Socket connected");

    // Get rooms after socket connection
    dispatch(getRooms());

    // Cleanup: disconnect socket when component unmounts
    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const conversationList = rooms.map((room) => ({
    id: room._id,
    name: room.name,
    users: room.users,
    lastMessage: room.lastMessage || "",
    time: room.lastMessage?.timestamp || "",
  }));

  const handleDelete = async (id) => {
    try {
      await deleteRoom(id);
      // After successful deletion, refresh the rooms list
      dispatch(getRooms());
    } catch (error) {
      Alert.alert("Error", "Failed to delete conversation. Please try again.");
      console.error("Error deleting room:", error);
    }
  };

  const handleConversationPress = (conversation) => {
    router.push({
      pathname: "/room/[id]",
      params: {
        id: conversation.id,
        name: conversation.name,
        users: conversation.users,
      },
    });
  };

  return (
    <ProtectedRoute>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.searchButton}>
              <Ionicons name="search-outline" size={35} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Home</Text>
            <View style={styles.headerRightButtons}>
              <Pressable
                style={styles.headerButton}
                onPress={() => router.push("/notification")}
              >
                <AntDesign name="bells" size={24} color="white" />
              </Pressable>
              <Pressable
                style={styles.headerButton}
                onPress={() => router.push("/new-chat")}
              >
                <Feather name="edit" size={24} color="green" />
              </Pressable>
            </View>
          </View>

          <View style={styles.storiesSection}>
            <FlatList
              horizontal
              data={stories}
              renderItem={({ item }) => <StoryItem story={item} />}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storiesContainer}
            />
          </View>

          <View style={styles.conversationsWrapper}>
            <View style={styles.conversationsHeader} />
            <FlatList
              data={conversationList.slice().reverse()}
              renderItem={({ item }) => {
                const otherUserId = item.users?.find((id) => id !== userId);
                const profilePictureUrl = otherUserId
                  ? `https://api.dicebear.com/7.x/avataaars/png?seed=${otherUserId}`
                  : "https://via.placeholder.com/50";

                return (
                  <ConversationItem
                    conversation={item}
                    onDelete={handleDelete}
                    onPress={() => handleConversationPress(item)}
                    profilePicture={profilePictureUrl}
                  />
                );
              }}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000E08",
  },
  container: {
    flex: 1,
    paddingTop: ios ? 0 : 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  searchButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "regular",
    color: "white",
  },
  headerRightButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  headerButton: {
    padding: 5,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  storiesContainer: {
    paddingHorizontal: 15,
    paddingVertical: 30,
  },

  conversationsWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  conversationsHeader: {
    padding: 8,
    borderColor: "#e0e0e0",
    borderBottomWidth: 4,
    width: 35,
    alignSelf: "center",
    marginBottom: 20,
  },
});
