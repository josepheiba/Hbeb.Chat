import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ChatRoom from "../../../../components/ChatRoom";
import { fetchUserData } from "../../../../redux/thunks/userThunks";
import { useDispatch, useSelector } from "react-redux";

export default function Room() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { id, name } = useLocalSearchParams();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  console.log(userData);
  return (
    <View style={styles.container}>
      <ChatRoom
        roomId={id}
        roomName={name}
        profilePicture={userData.profilePicture}
        friendUsername={userData.username}
        friendEmail={userData.email}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
