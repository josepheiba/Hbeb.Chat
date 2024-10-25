import React, { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

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

const styles = StyleSheet.create({
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
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    position: "absolute",
    right: -80,
    top: 0,
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

export default ConversationItem;
