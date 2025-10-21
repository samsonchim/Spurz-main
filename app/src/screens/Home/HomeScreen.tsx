import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.text}>Home</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 20 },
});
