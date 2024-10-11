import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomButton = ({
  onPress,
  text,
  backgroundColor = "#24786D",
  marginTop = 20,
  disabled = false,
  ...otherProps
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? "#A9A9A9" : backgroundColor, marginTop },
        otherProps.style,
      ]}
      onPress={onPress}
      disabled={disabled}
      {...otherProps}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomButton;
