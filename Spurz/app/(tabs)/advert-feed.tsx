import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';

export default function AdvertFeedScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Advert Feed</ThemedText>
      <ThemedText>Posts from followed outlets</ThemedText>
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
