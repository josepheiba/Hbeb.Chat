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
import { useRouter } from "expo-router";

const ios = Platform.OS === "ios";

export default function Contacts() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const handleAddContact = () => {
    router.push("/new-chat");
  };

  const handleSearch = () => {
    // Implement search functionality
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={[styles.container, { paddingTop: ios ? 0 : insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search-outline" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Calls</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.contactsContainer}>
          {/* You can add your contacts list here */}
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No calls yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap + to add new contacts
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000E08",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 35,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  searchButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  addButton: {
    padding: 8,
  },
  contactsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  emptyState: {
    alignItems: "center",
  },
  emptyStateText: {
    color: "black",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
  // Styles for when you add the contacts list
  contactsList: {
    flex: 1,
    width: "100%",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  contactStatus: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
});
