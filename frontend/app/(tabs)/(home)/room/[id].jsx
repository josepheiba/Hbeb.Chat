import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import ChatRoom from "../../../../components/ChatRoom";
import { fetchUserData } from "../../../../redux/thunks/userThunks";
import { useDispatch, useSelector } from "react-redux";

export default function Room() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { id, name, users } = useLocalSearchParams();
  const [localUserData, setLocalUserData] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const loggedUserId = await AsyncStorage.getItem("user_id");
        if (loggedUserId) {
          console.log("Logged User ID:", loggedUserId);
          console.log("All Users:", users);

          // Filter out the logged-in user from the users list
          const otherUsers = users
            .split(",")
            .filter((userId) => userId !== loggedUserId);
          console.log("Other Users:", otherUsers);

          if (otherUsers.length > 0) {
            // Fetch user data for the first user that is not the logged-in user
            dispatch(fetchUserData(otherUsers[0]));
          }
        }
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    fetchUserId();
  }, [dispatch, users]);

  useEffect(() => {
    if (userData) {
      setLocalUserData(userData);
    }
  }, [userData]);

  console.log(localUserData);
  return (
    <View style={styles.container}>
      <ChatRoom
        roomId={id}
        roomName={name}
        profilePicture={localUserData?.profilePicture}
        friendUsername={localUserData?.username}
        friendEmail={localUserData?.email}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
