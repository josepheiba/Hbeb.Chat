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
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { fetchContacts } from "../redux/thunks/contactsThunks";

const FriendSelectionScreen = ({ selectedFriends, onSelect, onClose }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { contacts, loading, error } = useSelector((state) => state.contacts);
  const [filteredContacts, setFilteredContacts] = useState([]);

  // Fetch contacts when component mounts
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  // Filter contacts based on search query
  useEffect(() => {
    if (contacts) {
      if (searchQuery.trim() === "") {
        setFilteredContacts(contacts);
      } else {
        const filtered = contacts.filter((contact) =>
          contact.email.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setFilteredContacts(filtered);
      }
    }
  }, [searchQuery, contacts]);

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => onSelect(item._id)}
      activeOpacity={0.7}
    >
      <View style={styles.friendInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.email.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.friendName}>{item.email}</Text>
          {item.phone && <Text style={styles.phoneNumber}>{item.phone}</Text>}
        </View>
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
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading contacts: {error}</Text>
      </View>
    );
  }

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
        data={filteredContacts}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item._id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No contacts found</Text>
        }
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    padding: 20,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    color: "#666",
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
  phoneNumber: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
