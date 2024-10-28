import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import Modal from "react-native-modal";

const ChangeProfileImageModal = ({ isVisible, onClose }) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Change Profile Image</Text>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Take a Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Choose from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={onClose}>
          <Text style={styles.optionText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  permissionContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    width: "100%",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
  },
  message: {
    marginBottom: 20,
    textAlign: "center",
  },
});

export default ChangeProfileImageModal;
