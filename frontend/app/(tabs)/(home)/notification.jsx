import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../../redux/thunks/userThunks";
import { Ionicons } from "@expo/vector-icons";
import { acceptFriendRequestApi } from "../../../api/friendRequestApi";

const Notification = () => {
  const dispatch = useDispatch();
  const { userData, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const handleAcceptRequest = async (friendId) => {
    console.log("Accept friend request:", friendId);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("user_id");
      await acceptFriendRequestApi(token, userId, friendId);
      // Refresh user data after accepting request
      dispatch(fetchUserData());
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#24786D" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const renderFriendRequest = ({ item }) => (
    <View style={styles.requestItem}>
      <View style={styles.requestInfo}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={24} color="#666" />
        </View>
        <Text style={styles.requestText}>Friend request from user {item}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => handleAcceptRequest(item)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.declineButton]}
          onPress={() => handleDeclineRequest(item)}
        >
          <Text style={[styles.buttonText, styles.declineText]}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlatList
        data={userData?.friendRequests || []}
        renderItem={renderFriendRequest}
        keyExtractor={(item) => item}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  requestItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  requestInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  requestText: {
    flex: 1,
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  acceptButton: {
    backgroundColor: "#24786D",
  },
  declineButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff4444",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  declineText: {
    color: "#ff4444",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default Notification;
