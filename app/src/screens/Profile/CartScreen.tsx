import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';

type CartItem = { id: string; name: string; price: number; emoji: string };

export default function CartScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState<CartItem[]>([
    { id: '1', name: 'iPhone 12 Pro', price: 999, emoji: '📱' },
    { id: '2', name: 'Wireless Earbuds', price: 199, emoji: '🎧' },
  ]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></Pressable>
        <Text style={styles.title}>Cart</Text>
        <View style={{ width: 32 }} />
      </View>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.left}>
              <View style={styles.thumb}><Text style={{ fontSize: 20 }}>{item.emoji}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.sub}>NGN {item.price}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <Pressable style={[styles.btn, { backgroundColor: '#FEE2E2' }]} onPress={() => setItems((s) => s.filter((x) => x.id !== item.id))}>
                <Text style={[styles.btnText, { color: '#EF4444' }]}>Remove</Text>
              </Pressable>
              <Pressable style={[styles.btn, { backgroundColor: colors.accent }]} onPress={() => Alert.alert('Buy', 'Proceeding to checkout...') }>
                <Text style={styles.btnText}>Buy</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: colors.muted, textAlign: 'center', marginTop: 40 }}>Cart is empty</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  back: { fontSize: 28, color: colors.text, fontWeight: '700' },
  title: { fontSize: 16, color: colors.text, fontWeight: '700' },
  row: { backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#EFEFEF', padding: 12, marginBottom: 12 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 13, color: colors.text, fontWeight: '700' },
  sub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  btnText: { color: 'white', fontWeight: '700' },
});
