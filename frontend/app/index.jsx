import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const App = () => {
  const router = useRouter();

  useEffect(() => {
    console.log("Rendering index page...");
  }, []);

  return (
    // <SafeAreaView style={styles.container}>
    //   <StatusBar style="dark" />
    //   <View style={styles.main}>
    //     <Text style={styles.text}>Welcome!</Text>
    //     <Button
    //       title="Press me"
    //       onPress={() => router.push("create-account")}
    //     />
    //   </View>
    // </SafeAreaView>
    <View style={styles.container}>
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
    </View>
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
    marginLeft: 20,
    marginTop: 100,
  },
  text: {
    fontSize: 72,
    fontWeight: "regular",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  text2: {
    fontSize: 18,
    color: "#5e6376",
    marginTop: 30,
    marginRight: 50,
  },
  bottomContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#000E08",
    fontSize: 16,
    fontWeight: "600",
  },
  text3: {
    color: "#B9C1BE",
    textAlign: "center",
    fontSize: 14,
  },
  loginText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default App;
