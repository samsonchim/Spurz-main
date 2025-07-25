import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';

export default function DashboardScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Dashboard</ThemedText>
      <ThemedText>Vendor Tools</ThemedText>
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
