import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Dummy data for stories and conversations
const stories = [
  { id: "1", name: "John", image: "https://via.placeholder.com/50" },
  { id: "2", name: "Sarah", image: "https://via.placeholder.com/50" },
  { id: "3", name: "Mike", image: "https://via.placeholder.com/50" },
  { id: "4", name: "Emma", image: "https://via.placeholder.com/50" },
  { id: "5", name: "David", image: "https://via.placeholder.com/50" },
];

const conversations = [
  {
    id: "1",
    name: "Alice",
    lastMessage: "Hey, how are you?",
    time: "10:30 AM",
  },
  {
    id: "2",
    name: "Bob",
    lastMessage: "Can we meet tomorrow?",
    time: "Yesterday",
  },
  {
    id: "3",
    name: "Charlie",
    lastMessage: "Thanks for the help!",
    time: "2 days ago",
  },
];

const StoryItem = ({ story }) => (
  <TouchableOpacity style={styles.storyItem}>
    <Image source={{ uri: story.image }} style={styles.storyImage} />
    <Text style={styles.storyName}>{story.name}</Text>
  </TouchableOpacity>
);

const ConversationItem = ({ conversation }) => (
  <TouchableOpacity style={styles.conversationItem}>
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
);

export default function Messages() {
  const statusBarStyle =
    Platform.OS === "ios" ? "dark-content" : "light-content";
  const statusBarColor = Platform.OS === "ios" ? "transparent" : "#24786D";

  // Reverse the conversations array
  const reversedConversations = [...conversations].reverse();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarColor}
        translucent={Platform.OS === "android"}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Home</Text>
          <TouchableOpacity style={styles.profileAvatar}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={stories}
          renderItem={({ item }) => <StoryItem story={item} />}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContainer}
        />

        <FlatList
          inverted
          data={reversedConversations}
          renderItem={({ item }) => <ConversationItem conversation={item} />}
          keyExtractor={(item) => item.id}
          style={styles.conversationsWrapper}
          contentContainerStyle={styles.conversationsContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: "#e0e0e0",
  },
  searchButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  storyItem: {
    alignItems: "center",
    marginRight: 15,
    width: 65,
    backgroundColor: "#fff",
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
  },
  conversationsWrapper: {
    flex: 0,
  },
  conversationsContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  conversationItem: {
    flexDirection: "row",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
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
});
