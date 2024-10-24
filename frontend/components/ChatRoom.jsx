import React, { useState, useEffect, useRef } from "react";
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

const ChatRoom = ({ roomId, roomName }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const user = useSelector((state) => state.auth.user);
  const flatListRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    socket.emit("join room", roomId);
    socket.emit("get recent messages", roomId);

    socket.on("recent messages", (recentMessages) => {
      setMessages(recentMessages);
    });

    socket.on("new message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      socket.off("new message");
      socket.off("error");
      socket.emit("leave room", roomId);
    };
  }, [roomId]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const messageData = {
        id: new Date().getTime().toString(),
        roomId,
        userId: user.id,
        username: user.username,
        text: inputMessage,
        timestamp: new Date().toISOString(),
      };
      socket.emit("send message", messageData);
      setInputMessage("");
      setMessages((prevMessages) => [...prevMessages, messageData]);
    }
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.userId === user.id;
    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        {!isOwnMessage && <Text style={styles.username}>{item.username}</Text>}
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

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
        keyboardVerticalOffset={100}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          onContentSizeChange={() =>
            flatListRef.current.scrollToEnd({ animated: true })
          }
          contentContainerStyle={styles.messageList}
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
