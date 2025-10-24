import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';

export default function InvoicesListScreen() {
  const navigation = useNavigation();
  const invoices = [
    { id: 'INV-201', total: 1019, status: 'Paid (Escrowed)' },
    { id: 'INV-202', total: 550, status: 'Unpaid' },
    { id: 'INV-203', total: 2599, status: 'Paid (Escrowed)' },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></Pressable>
        <Text style={styles.title}>My Invoices</Text>
        <View style={{ width: 32 }} />
      </View>
      <FlatList
        data={invoices}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.invItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.invId}>{item.id}</Text>
              <Text style={styles.invSub}>Total: NGN {item.total}</Text>
            </View>
            <View style={[styles.invStatusBadge, item.status.includes('Paid') ? styles.invStatusPaid : styles.invStatusUnpaid]}>
              <Text style={styles.invStatusText}>{item.status}</Text>
            </View>
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
  invItem: { backgroundColor: 'white', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#EFEFEF', marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  invId: { fontSize: 13, fontWeight: '800', color: colors.text },
  invSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  invStatusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  invStatusPaid: { backgroundColor: '#3B82F6' },
  invStatusUnpaid: { backgroundColor: '#F87171' },
  invStatusText: { fontSize: 10, color: 'white', fontWeight: '700' },
});
