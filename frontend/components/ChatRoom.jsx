import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import socket from "../utils/socket";

// Memoized Message Component
const MessageItem = memo(({ message, isOwnMessage, user }) => {
  return (
    <View
      style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      {!isOwnMessage && (
        <Text style={styles.username}>{message.sender.username}</Text>
      )}
      <Text style={styles.messageText}>{message.content}</Text>
      <Text style={styles.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );
});

const ChatRoom = ({ roomId, roomName }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const flatListRef = useRef(null);
  const shouldScrollToEnd = useRef(true);
  const router = useRouter();

  useEffect(() => {
    console.log("___________", user);
    console.log("Joining room:", roomId);
    socket.emit("join_room", roomId);

    const handlePreviousMessages = ({ messages, hasMore }) => {
      console.log("Received previous messages:", messages);
      const uniqueMessages = messages.reduce((acc, current) => {
        const x = acc.find((item) => item._id === current._id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      setMessages(uniqueMessages);
      setHasMoreMessages(hasMore);
      shouldScrollToEnd.current = true;
    };

    const handleNewMessage = (message) => {
      console.log("Received new message:", message);
      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg._id === message._id)) {
          return prevMessages;
        }
        shouldScrollToEnd.current = true;
        return [...prevMessages, message];
      });
    };

    socket.on("previous_messages", handlePreviousMessages);
    socket.on("message", handleNewMessage);
    socket.on("error", (error) => console.error("Socket error:", error));

    return () => {
      console.log("Leaving room:", roomId);
      socket.off("previous_messages", handlePreviousMessages);
      socket.off("message", handleNewMessage);
      socket.off("error");
      socket.emit("leave_room", roomId);
    };
  }, [roomId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages.length]);

  const sendMessage = useCallback(() => {
    if (inputMessage.trim()) {
      const messageData = {
        room_id: roomId,
        content: inputMessage,
      };
      console.log("Sending message:", messageData);
      socket.emit("message", messageData);
      setInputMessage("");
    }
  }, [inputMessage, roomId]);

  const loadMoreMessages = useCallback(() => {
    if (loadingMoreMessages || !hasMoreMessages) return;

    setLoadingMoreMessages(true);
    const lastMessageId = messages[0]?._id;

    console.log("Loading more messages before:", lastMessageId);
    socket.emit("load_more_messages", { room_id: roomId, lastMessageId });

    const handleMoreMessages = ({ messages: newMessages, hasMore }) => {
      console.log("Received more messages:", newMessages);
      setMessages((prevMessages) => {
        const combinedMessages = [...newMessages, ...prevMessages];
        const uniqueMessages = combinedMessages.reduce((acc, current) => {
          const x = acc.find((item) => item._id === current._id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        return uniqueMessages;
      });
      setHasMoreMessages(hasMore);
      setLoadingMoreMessages(false);
    };

    socket.once("more_messages", handleMoreMessages);
  }, [loadingMoreMessages, hasMoreMessages, messages, roomId]);

  const renderMessage = useCallback(
    ({ item }) => {
      // The issue is here. We need to compare with user_id from auth state
      const isOwnMessage = item.sender._id === user.user_id; // Change from user.id to user.user_id
      return (
        <MessageItem message={item} isOwnMessage={isOwnMessage} user={user} />
      );
    },
    [user],
  );

  const handleContentSizeChange = useCallback(() => {
    if (shouldScrollToEnd.current && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
      shouldScrollToEnd.current = false;
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.roomName}>{roomName}</Text>
        <TouchableOpacity onPress={() => console.log("Profile")}>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.avatarImage}
          />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderMessage}
          onEndReachedThreshold={0.1}
          onEndReached={loadMoreMessages}
          onContentSizeChange={handleContentSizeChange}
          contentContainerStyle={styles.messageList}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message here..."
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  roomName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chatContainer: {
    flex: 1,
  },
  messageList: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
  },
  ownMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0084FF",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#333",
  },
  username: {
    color: "#999",
    fontSize: 12,
    marginBottom: 2,
  },
  messageText: {
    color: "white",
    fontSize: 16,
  },
  timestamp: {
    color: "#CCC",
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#252525",
  },
  input: {
    flex: 1,
    backgroundColor: "#333",
    color: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#0084FF",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatRoom;
