import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Camera } from "expo-camera";

const CameraViewComponent = ({
  facing = Camera.Constants.Type.back,
  onToggleFacing,
  onCapture,
  onClose,
}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      onCapture(photo);
    }
  };

  if (hasPermission === null) {
    return <View />; // Render nothing while checking permission
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>; // Display message if no permission
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onToggleFacing}>
            <Text style={styles.text}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCapture}>
            <Text style={styles.text}>Capture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.text}>Close</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});

export default CameraViewComponent;
