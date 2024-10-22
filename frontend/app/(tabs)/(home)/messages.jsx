import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  Platform,
  Animated,
  PanResponder,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getRooms } from "../../../redux/thunks/roomsThunks";
import ProtectedRoute from "../../../components/common/ProtectedRoute";
import { useRouter } from "expo-router";
import Modal from "../../../components/Modal";

// Dummy data for stories and conversations
const stories = [
  { id: "1", name: "John", image: "https://via.placeholder.com/50" },
  { id: "2", name: "Sarah", image: "https://via.placeholder.com/50" },
  { id: "3", name: "Mike", image: "https://via.placeholder.com/50" },
  { id: "4", name: "Emma", image: "https://via.placeholder.com/50" },
  { id: "5", name: "David", image: "https://via.placeholder.com/50" },
];

const StoryItem = ({ story }) => (
  <TouchableOpacity style={styles.storyItem}>
    <Image source={{ uri: story.image }} style={styles.storyImage} />
    <Text style={styles.storyName}>{story.name}</Text>
  </TouchableOpacity>
);

const ConversationItem = ({ conversation, onDelete, onPress }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [isDeleting, setIsDeleting] = useState(false);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dx) > 5,
    onPanResponderMove: Animated.event([null, { dx: pan.x }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -80) {
        setIsDeleting(true);
        Animated.timing(pan, {
          toValue: { x: -80, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start();
      } else {
        setIsDeleting(false);
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const handleDelete = () => {
    Animated.timing(pan, {
      toValue: { x: -1000, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => onDelete(conversation.id));
  };

  const backgroundColor = isDeleting ? "#F1F6FA" : "white";

  return (
    <Animated.View
      style={[
        styles.conversationItem,
        {
          transform: [{ translateX: pan.x }],
          backgroundColor,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={styles.conversationContent}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: "https://via.placeholder.com/50" }}
          style={styles.conversationImage}
        />
        <View style={styles.conversationDetails}>
          <Text style={styles.conversationName}>{conversation.name}</Text>
          <Text style={styles.conversationLastMessage}>
            {conversation.lastMessage}
          </Text>
        </View>
        <Text style={styles.conversationTime}>{conversation.time}</Text>
      </TouchableOpacity>
      {isDeleting && (
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor }]}
          onPress={handleDelete}
        >
          <View style={styles.deleteIconContainer}>
            <AntDesign name="delete" size={20} color="white" />
          </View>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const ios = Platform.OS === "ios";

export default function Messages() {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const { rooms, loading, error } = useSelector((state) => state.rooms);
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    dispatch(getRooms());
  }, [dispatch]);

  const conversationList = rooms.map((room) => ({
    id: room.id,
    name: room.name, // Adjust according to your room object structure
    lastMessage: room.lastMessage,
    time: room.lastMessageTime,
  }));

  const handleDelete = (id) => {
    setConversationList(conversationList.filter((conv) => conv.id !== id));
  };

  const handleConversationPress = (conversation) => {
    router.push({
      pathname: "(tabs)/(home)/room/[id]",
      params: { id: conversation.id, name: conversation.name },
    });
  };

  return (
    <ProtectedRoute>
      <SafeAreaView style={styles.safeArea}>
        {/* <View style={[styles.mainView, { paddingTop: ios ? top : top + 5 }]}> */}
        <StatusBar style="light" />
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.searchButton}>
              <Ionicons name="search-outline" size={35} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Home</Text>
            <Pressable onPress={() => setVisible(true)}>
              <Feather name="edit" size={24} color="green" />
            </Pressable>
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
              renderItem={({ item }) => (
                <ConversationItem
                  conversation={item}
                  onDelete={handleDelete}
                  onPress={() => handleConversationPress(item)}
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.conversationsContent}
            />
          </View>
        </View>
        <Modal visible={visible} setVisible={setVisible} />
      </SafeAreaView>
      {/* </View> */}
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
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  storiesContainer: {
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  storyItem: {
    alignItems: "center",
    marginRight: 15,
    width: 65,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  storyName: {
    fontSize: 12,
    textAlign: "center",
    color: "white",
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
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  conversationContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    flex: 1,
  },
  deleteButton: {
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    position: "absolute",
    right: -80,
    top: 0,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  conversationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  conversationDetails: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  conversationLastMessage: {
    fontSize: 14,
    color: "#666",
  },
  conversationTime: {
    fontSize: 12,
    color: "#999",
  },
  deleteIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#EA3736",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
});
