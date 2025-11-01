import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ErrorPopupProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
}

export default function ErrorPopup({ visible, message, onDismiss }: ErrorPopupProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View style={styles.iconContainer}>
            <Feather name="alert-circle" size={32} color="#EF4444" />
          </View>
          
          <Text style={styles.title}>Error</Text>
          <Text style={styles.message}>{message}</Text>
          
          <Pressable style={styles.button} onPress={onDismiss}>
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    minWidth: 280,
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
});