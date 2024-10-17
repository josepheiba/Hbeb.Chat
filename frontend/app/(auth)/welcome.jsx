import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const App = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#1a1a1a", "#25163d", "#1a1a1a"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.background}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Connect{"\n"}
          friends{"\n"}
          easily &{"\n"}
          quickly
        </Text>
        <Text style={styles.text2}>
          Our chat app is the best way to connect with friends and family.
        </Text>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("(auth)/signup")}
        >
          <Text style={styles.buttonText}>Sign up with email</Text>
        </TouchableOpacity>
        <Text style={styles.text3}>
          Already have an account?{" "}
          <Text style={styles.loginText} onPress={() => router.push("/login")}>
            Log in
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  textContainer: {
    flex: 1,
    marginLeft: width * 0.05,
    marginTop: height * 0.1,
  },
  text: {
    fontSize: width * 0.15,
    fontWeight: "regular",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  text2: {
    fontSize: width * 0.045,
    color: "#5e6376",
    marginTop: height * 0.03,
    marginRight: width * 0.1,
  },
  bottomContainer: {
    paddingHorizontal: width * 0.1,
    paddingBottom: height * 0.05,
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  buttonText: {
    color: "#000E08",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
  text3: {
    color: "#B9C1BE",
    textAlign: "center",
    fontSize: width * 0.035,
  },
  loginText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default App;
