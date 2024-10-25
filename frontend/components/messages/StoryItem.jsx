import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";

const StoryItem = ({ story }) => (
  <TouchableOpacity style={styles.storyItem}>
    <Image source={{ uri: story.image }} style={styles.storyImage} />
    <Text style={styles.storyName}>{story.name}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  storyItem: {
    alignItems: "center",
    marginRight: 15,
    width: 65,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  storyName: {
    fontSize: 12,
    textAlign: "center",
    color: "white",
  },
});

export default StoryItem;
