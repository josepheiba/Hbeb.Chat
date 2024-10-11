import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const LabeledInput = ({ label, error, ...inputProps }) => (
  <View style={styles.container}>
    <View style={styles.labelContainer}>
      <Text
        style={[styles.label, error && styles.labelError]}
        nativeID={`${inputProps.nativeID}Label`}
      >
        {label}
      </Text>
    </View>
    <TextInput
      style={[
        styles.input,
        error ? { borderColor: "red" } : { borderColor: "#ccc" },
      ]}
      accessibilityLabelledBy={`${inputProps.nativeID}Label`}
      {...inputProps}
    />
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
  input: {
    borderWidth: 0,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
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
