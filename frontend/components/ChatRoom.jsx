import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import socket from "../utils/socket";

const ChatRoom = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const user = useSelector((state) => state.user);
  const flatListRef = useRef(null);

  useEffect(() => {
    // join the room
    socket.emit("join room", roomId);

    // listen for incoming messages
    socket.on("new message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    // cleanup on component unmount
    return () => {
      socket.off("new message");
      socket.off("error");
      socket.emit("leave room", roomId);
    };
  }, [roomId]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const messageData = {
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

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <View>
        <TouchableOpacity onPress={() => console.log("Back")}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Profile")}>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.avatarImage}
          />
          <Text>Username</Text>
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <Text>{item.username}</Text>
              <Text>{item.text}</Text>
            </View>
          )}
          onContentSizeChange={() =>
            flatListRef.current.scrollToEnd({ animated: true })
          }
        />
      </View>
      <View>
        <TextInput
          placeholder="Type your message here..."
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000E08",
  },
});

export default ChatRoom;
