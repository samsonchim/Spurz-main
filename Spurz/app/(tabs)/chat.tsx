import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';

export default function ChatScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Chat</ThemedText>
      <ThemedText>Buyer-Vendor Messaging</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80, // Adjusted for minimalist tab bar
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
