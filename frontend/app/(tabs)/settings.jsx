import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const ios = Platform.OS === "ios";

const SettingItem = ({ icon, title, onPress, showBorder = true }) => (
  <TouchableOpacity
    style={[styles.settingItem, showBorder && styles.settingItemBorder]}
    onPress={onPress}
  >
    <View style={styles.settingItemLeft}>
      {icon}
      <Text style={styles.settingItemText}>{title}</Text>
    </View>
    <MaterialIcons name="chevron-right" size={24} color="#666" />
  </TouchableOpacity>
);

export default function Settings() {
  const dispatch = useDispatch();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          try {
            await dispatch(logout()).unwrap();
            router.replace("(auth)/welcome"); // Navigate to the login or home screen after logout
          } catch (error) {
            console.error("Error during logout:", error);
          }
        },
      },
    ]);
  };

  const handleNavigation = (route) => {
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={[styles.container, { paddingTop: ios ? 0 : insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.placeholderButton} />
        </View>

        <ScrollView style={styles.settingsContainer}>
          <View style={styles.profileSection}>
            <View style={styles.profileImage}>
              <Feather name="user" size={40} color="#666" />
            </View>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@example.com</Text>
          </View>

          <View style={styles.settingsGroup}>
            <SettingItem
              icon={<Feather name="user" size={24} color="#666" />}
              title="Account"
              onPress={() => handleNavigation("/account")}
            />
            <SettingItem
              icon={<Feather name="bell" size={24} color="#666" />}
              title="Notifications"
              onPress={() => handleNavigation("/notifications")}
            />
            <SettingItem
              icon={<Feather name="help-circle" size={24} color="#666" />}
              title="Help"
              onPress={() => handleNavigation("/help")}
            />
            <SettingItem
              icon={<Feather name="users" size={24} color="#666" />}
              title="Invite a Friend"
              onPress={() => handleNavigation("/invite")}
            />
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={24} color="#FF3B30" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
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
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    padding: 8,
  },
  placeholderButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  settingsContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
  },
  settingsGroup: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingItemText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#000",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
    marginLeft: 8,
  },
});
