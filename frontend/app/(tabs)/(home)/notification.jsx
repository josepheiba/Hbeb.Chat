import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { fetchUserData } from "../../../redux/thunks/userThunks";
import { Ionicons } from "@expo/vector-icons";
import {
  acceptFriendRequestApi,
  rejectFriendRequestApi,
} from "../../../api/friendRequestApi";
import { fetchFriendDetailsApi } from "../../../api/contactsApi";

const Notification = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userData, loading, error } = useSelector((state) => state.user);
  const [requestDetails, setRequestDetails] = useState({});

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (userData?.friendRequests?.length > 0) {
        const details = {};
        for (const requestId of userData.friendRequests) {
          try {
            const userDetails = await fetchFriendDetailsApi(requestId);
            details[requestId] = userDetails;
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        }
        setRequestDetails(details);
      }
    };

    fetchRequestDetails();
  }, [userData?.friendRequests]);

  const handleBack = () => {
    router.back();
  };

  const handleAcceptRequest = async (friendId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("user_id");
      await acceptFriendRequestApi(token, userId, friendId);
      dispatch(fetchUserData());
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDeclineRequest = async (friendId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("user_id");
      await rejectFriendRequestApi(token, userId, friendId);
      dispatch(fetchUserData());
    } catch (error) {
      console.error("Error declining friend request:", error);
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

  const renderFriendRequest = ({ item }) => {
    const userDetails = requestDetails[item] || {};
    const defaultImage =
      "https://api.dicebear.com/7.x/avataaars/png?seed=" + item;
    console.log(defaultImage);

    return (
      <View style={styles.requestItem}>
        <View style={styles.requestInfo}>
          <Image
            source={{ uri: userDetails.profilePicture || defaultImage }}
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.emailText}>
              {userDetails.email || "Loading..."}
            </Text>
            {userDetails.phone && (
              <Text style={styles.phoneText}>{userDetails.phone}</Text>
            )}
          </View>
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
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
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
  placeholder: {
    width: 32,
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 14,
    color: "#666",
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
