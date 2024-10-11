import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../redux/slices/authSlice";
import LabeledInput from "../../components/common/LabledInput";
import CustomButton from "../../components/common/CustomButton";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Clear error when component mounts
    dispatch(clearError());

    // Clear error when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = () => {
    console.log("Sending login cridentials to the server...");
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((result) => {
        console.log("Login successful");
        // Navigate or perform other actions here
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  const isFormValid = email && password;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Log in to Chatapp</Text>
            <Text style={styles.description}>
              Welcome back! Sign in using your social account or email to
              continue us
            </Text>
            <LabeledInput
              label="Your Email"
              nativeID="emailInput"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <LabeledInput
              label="Password"
              secureTextEntry={!showPassword}
              nativeID="passwordInput"
              value={password}
              onChangeText={setPassword}
              rightIcon={
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              }
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
          <View style={styles.bottomContainer}>
            <CustomButton
              onPress={handleLogin}
              text={loading ? "Logging in..." : "Log In"}
              disabled={loading || !isFormValid}
            />
            <TouchableOpacity
              style={styles.RecoverAccountLink}
              onPress={() => router.push("/recover-account")}
            >
              <Text style={styles.recoverAccountText}>Forgot Passowrd?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 5,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 10,
  },
  title: {
    marginTop: 120,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    color: "#797C7B",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 60,
    marginLeft: 40,
    marginRight: 40,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  bottomContainer: {
    marginBottom: 40,
    paddingHorizontal: 40,
  },
  // loginButton: {
  //   backgroundColor: "#24786D",
  //   height: 50,
  //   borderRadius: 16,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginTop: 20,
  // },
  // loginButtonText: {
  //   color: "#FFFFFF",
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
  RecoverAccountLink: {
    marginTop: 20,
    alignItems: "center",
  },
  recoverAccountText: {
    fontSize: 14,
    color: "#24786D",
  },
});
