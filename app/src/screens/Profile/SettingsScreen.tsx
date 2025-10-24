import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const opts = [
    { key: 'profile', label: 'Edit Profile' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'privacy', label: 'Privacy' },
    { key: 'help', label: 'Help & Support' },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 32 }} />
      </View>
      <FlatList
        data={opts}
        keyExtractor={(o) => o.key}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => Alert.alert(item.label, 'Coming soon') }>
            <Text style={styles.rowText}>{item.label}</Text>
            <Text style={{ color: colors.muted }}>›</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  back: { fontSize: 28, color: colors.text, fontWeight: '700' },
  title: { fontSize: 16, color: colors.text, fontWeight: '700' },
  row: { backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#EFEFEF', padding: 14, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowText: { fontSize: 13, color: colors.text, fontWeight: '700' },
});
