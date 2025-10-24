import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';

export default function FollowingListScreen() {
  const navigation = useNavigation();
  const data = [
    { id: 'v1', name: 'Style & Co.', avatar: '👜' },
    { id: 'v2', name: 'BookWorld Store', avatar: '📚' },
    { id: 'v3', name: 'FurnishIt', avatar: '🛋️' },
    { id: 'v4', name: 'Gadget Arena', avatar: '🔌' },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></Pressable>
        <Text style={styles.title}>Following</Text>
        <View style={{ width: 32 }} />
      </View>
      <FlatList
        data={data}
        keyExtractor={(u) => u.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.avatar}><Text style={{ fontSize: 18 }}>{item.avatar}</Text></View>
            <Text style={styles.name}>{item.name}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  back: { fontSize: 28, color: colors.text, fontWeight: '700' },
  title: { fontSize: 16, color: colors.text, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#EFEFEF', marginBottom: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  name: { fontSize: 13, color: colors.text, fontWeight: '700' },
});
