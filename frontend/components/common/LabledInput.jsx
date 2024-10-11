import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const LabeledInput = ({ label, error, rightIcon, ...inputProps }) => (
  <View style={styles.container}>
    <View style={styles.labelContainer}>
      <Text
        style={[styles.label, error && styles.labelError]}
        nativeID={`${inputProps.nativeID}Label`}
      >
        {label}
      </Text>
    </View>
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.input,
          error ? { borderColor: "red" } : { borderColor: "#ccc" },
        ]}
        accessibilityLabelledBy={`${inputProps.nativeID}Label`}
        autoCapitalize="none"
        cursorColor={"#24786D"}
        {...inputProps}
      />
      {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
    </View>

    <View style={styles.errorContainer}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    color: "#24786D",
    fontSize: 14,
    fontWeight: "500", // "medium" is not a valid value in React Native
  },
  labelError: {
    color: "red",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    paddingRight: 30,
  },
  rightIconContainer: {
    position: "absolute",
    right: 0,
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  errorContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});

export default LabeledInput;
