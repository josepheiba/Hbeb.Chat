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
import { registerUser } from "../../redux/slices/authSlice";
import LabeledInput from "../../components/common/LabledInput";
import CustomButton from "../../components/common/CustomButton";

export default function Signup() {
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    validateInput();
  }, [data]);

  useEffect(() => {
    // resetAuthState
  }, []); // Added empty dependency array

  const validateForm = () => {
    let isValid = true;
    let newErrors = { name: "", email: "", password: "", confirmPassword: "" };

    if (data.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
      isValid = false;
    }

    if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateInput = () => {
    const allFieldsFilled =
      data.name.trim() !== "" &&
      data.email.trim() !== "" &&
      data.password !== "" &&
      data.confirmPassword !== "";

    setIsValid(allFieldsFilled);
  };

  const handleRegister = () => {
    if (validateForm()) {
      dispatch(registerUser(data))
        .unwrap()
        .then(() => {
          console.log("Signup successful");
          router.replace("/(tabs)/messages");
        })
        .catch((error) => {
          console.error("Signup failed:", error);
        });
    }
  };

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
            <Text style={styles.title}>Sign up with Email</Text>
            <Text style={styles.description}>
              Get chatting with friends and family today by signing up for our
              chat app!
            </Text>
            <LabeledInput
              label="Your name"
              nativeID="nameInput"
              onChangeText={(text) => {
                setData({ ...data, name: text });
                validateInput();
              }}
              error={errors.name}
            />
            <LabeledInput
              label="Your email"
              nativeID="emailInput"
              onChangeText={(text) => {
                setData({ ...data, email: text });
                validateInput();
              }}
              error={errors.email}
            />
            <LabeledInput
              label="Password"
              secureTextEntry={true}
              nativeID="passwordInput"
              onChangeText={(text) => {
                setData({ ...data, password: text });
                validateInput();
              }}
              error={errors.password}
            />
            <LabeledInput
              label="Confirm Password"
              secureTextEntry={true}
              nativeID="confirmPasswordInput"
              onChangeText={(text) => {
                setData({ ...data, confirmPassword: text });
                validateInput();
              }}
              error={errors.confirmPassword}
            />
          </View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <CustomButton
            onPress={handleRegister}
            text={loading ? "Creating account..." : "Create an account"}
            disabled={loading || !isValid}
          />
        </View>
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
  container: {
    flex: 1,
    padding: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
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
  bottomContainer: {
    marginBottom: 40,
    paddingHorizontal: 40,
  },
  createButton: {
    backgroundColor: "#24786D",
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
