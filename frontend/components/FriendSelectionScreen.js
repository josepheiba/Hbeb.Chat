import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FriendSelectionScreen = ({
  friends,
  selectedFriends,
  onSelect,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFriends, setFilteredFriends] = useState(friends);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter((friend) =>
        friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredFriends(filtered);
    }
  }, [searchQuery, friends]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Friends</Text>
        <Text style={styles.selectedCount}>
          {selectedFriends.length} selected
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            autoCapitalize="none"
          />
        </View>
      </View>

      <FlatList
        style={styles.list}
        data={filteredFriends}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.friendItem}
            onPress={() => onSelect(item._id)}
            activeOpacity={0.7}
          >
            <View style={styles.friendInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.username.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.friendName}>{item.username}</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <View
                style={[
                  styles.checkbox,
                  selectedFriends.includes(item._id) && styles.checkboxSelected,
                ]}
              >
                {selectedFriends.includes(item._id) && (
                  <Ionicons name="checkmark" size={18} color="#FFF" />
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 25 : 0, // Add padding for Android status bar
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
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
  selectedCount: {
    fontSize: 15,
    color: "#007AFF",
    minWidth: 32, // To match the placeholder width from the previous screen
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#000",
  },
  list: {
    flex: 1,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  checkboxContainer: {
    marginLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#007AFF",
  },
  friendName: {
    fontSize: 16,
    fontWeight: "400",
  },
});

export default FriendSelectionScreen;
