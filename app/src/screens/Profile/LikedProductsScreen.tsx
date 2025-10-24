import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';

type Product = { id: string; name: string; price: number; image: string };

export default function LikedProductsScreen() {
  const navigation = useNavigation<any>();
  const products: Product[] = [
    { id: '1', name: 'MacBook Pro M2', price: 1999, image: '💻' },
    { id: '2', name: 'Smart Watch', price: 299, image: '⌚' },
    { id: '3', name: 'Wireless Earbuds', price: 199, image: '🎧' },
    { id: '4', name: 'iPhone 12 Pro', price: 999, image: '📱' },
  ];
  const renderItem = (item: Product) => (
    <Pressable style={styles.card} onPress={() => navigation.navigate('ProductDetail', { productId: item.id, productName: item.name })}>
      <View style={styles.image}><Text style={{ fontSize: 32 }}>{item.image}</Text></View>
      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.price}>NGN {item.price}</Text>
    </Pressable>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></Pressable>
        <Text style={styles.title}>Liked Products</Text>
        <View style={{ width: 32 }} />
      </View>
      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => renderItem(item)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  back: { fontSize: 28, color: colors.text, fontWeight: '700' },
  title: { fontSize: 16, color: colors.text, fontWeight: '700' },
  card: { flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 8, borderWidth: 1, borderColor: '#EFEFEF' },
  image: { width: '100%', height: 120, backgroundColor: '#F8F8F8', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  name: { fontSize: 12, color: colors.text, fontWeight: '700', marginBottom: 4 },
  price: { fontSize: 13, color: colors.accent, fontWeight: '700' },
});
