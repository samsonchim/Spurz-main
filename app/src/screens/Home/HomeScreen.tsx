import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ImageSourcePropType, ScrollView, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { colors } from '../../theme/colors';
import ErrorPopup from '../../components/ErrorPopup';
import BottomNav from '../../components/BottomNav';

type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  rating?: number;
};

type Chat = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  status?: 'Delivered' | 'Enroute' | 'Paid';
  unread?: boolean;
  avatar?: string; // emoji or letter
};

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [errVisible, setErrVisible] = useState(false);
  const [tab, setTab] = useState<'home'|'dashboard'|'feed'|'chats'|'profile'>('home');
  const [activeFilter, setActiveFilter] = useState('All');

  const navItems = useMemo(() => ([
    { key: 'home', label: 'Home', icon: require('../../../assets/icons/home.png') as ImageSourcePropType },
    { key: 'dashboard', label: 'Dashboard', icon: require('../../../assets/icons/dashboard.png') as ImageSourcePropType },
    { key: 'feed', label: 'Feed', icon: require('../../../assets/icons/feed.png') as ImageSourcePropType },
    { key: 'chats', label: 'Chats', icon: require('../../../assets/icons/chats.png') as ImageSourcePropType },
    { key: 'profile', label: 'Profile', icon: require('../../../assets/icons/profile.png') as ImageSourcePropType },
  ]), []);

  const filters = ['All', 'Electronics', 'Fashion', 'Properties', 'Furniture', 'Books', 'Sports', 'Jewelry'];

  const products: Product[] = [
    { id: '1', name: 'iPhone 12 Pro', price: 999, oldPrice: 1299, image: '📱', badge: 'Sale', rating: 4.5 },
    { id: '2', name: 'MacBook Pro M2', price: 1999, image: '💻', rating: 4.8 },
    { id: '3', name: 'Wireless Earbuds', price: 199, oldPrice: 299, image: '🎧', badge: 'Hot', rating: 4.3 },
    { id: '4', name: 'Smart Watch', price: 299, image: '⌚', rating: 4.6 },
  ];

  const chats: Chat[] = [
    { id: 'c1', name: 'TechHub Electronics', lastMessage: 'Your order is on the way 🚚', time: '09:12', status: 'Enroute', unread: true, avatar: '📦' },
    { id: 'c2', name: 'Style & Co.', lastMessage: 'Payment received. Thanks! 🧾', time: 'Yesterday', status: 'Paid', unread: false, avatar: '👜' },
    { id: 'c3', name: 'BookWorld Store', lastMessage: 'Package delivered. Enjoy reading! 📚', time: 'Mon', status: 'Delivered', unread: false, avatar: '📚' },
    { id: 'c4', name: 'FurnishIt', lastMessage: 'We have a discount on sofas.', time: 'Sun', unread: true, avatar: '🛋️' },
    { id: 'c5', name: 'Gadget Arena', lastMessage: 'Can we confirm your address?', time: 'Sat', unread: false, avatar: '🔌' },
  ];

  const renderChat = (item: Chat) => (
    <Pressable key={item.id} style={[styles.chatItem, item.unread && styles.chatItemUnread]}>
      <View style={styles.chatLeft}>
        <View style={styles.chatAvatar}><Text style={styles.chatAvatarText}>{item.avatar || item.name.charAt(0)}</Text></View>
        <View style={styles.chatBody}>
          <View style={styles.chatTitleRow}>
            <Text style={[styles.chatTitle, item.unread && styles.chatTitleUnread]} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.chatTime}>{item.time}</Text>
          </View>
          <View style={styles.chatMetaRow}>
            <Text style={[styles.chatSnippet, item.unread && styles.chatSnippetUnread]} numberOfLines={1}>{item.lastMessage}</Text>
            {item.status && (
              <View style={[styles.statusBadge,
                item.status === 'Delivered' ? styles.statusDelivered : item.status === 'Enroute' ? styles.statusEnroute : styles.statusPaid,
              ]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            )}
            {item.unread && <View style={styles.unreadDot} />}
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderProduct = (item: Product) => (
    <Pressable style={styles.productCard} onPress={() => navigation.navigate('ProductDetail', { productId: item.id, productName: item.name })}>
      <View style={styles.productImage}>
        <Text style={styles.emoji}>{item.image}</Text>
        {item.badge && <View style={styles.badge}><Text style={styles.badgeText}>{item.badge}</Text></View>}
      </View>
      <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>NGN {item.price}</Text>
        {item.oldPrice && <Text style={styles.oldPrice}>NGN {item.oldPrice}</Text>}
      </View>
      {item.rating && <Text style={styles.rating}>★ {item.rating}</Text>}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.userName}>Jimmy Samson</Text>
        </View>
        <Pressable style={styles.notificationIcon}>
          <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIconImg} resizeMode="contain" />
        </Pressable>
      </View>

      {tab === 'chats' ? (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderChat(item)}
          contentContainerStyle={styles.chatListContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Image source={require('../../../assets/icons/search.png')} style={styles.searchIconImg} resizeMode="contain" />
              <Text style={styles.searchPlaceholder}>Search products...</Text>
            </View>
          </View>

          {/* Filter Tabs - Horizontally Scrollable */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
            scrollEventThrottle={16}
          >
            {filters.map((filter) => (
              <Pressable
                key={filter}
                style={[styles.filterTab, activeFilter === filter && styles.filterTabActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                  {filter}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Promotional Banner */}
          <Pressable style={styles.promoBanner}>
            <View style={styles.promoContent}>
              <Text style={styles.promoDiscount}>UPTO 50%</Text>
              <Text style={styles.promoText}>Mega Sale</Text>
            </View>
            <Text style={styles.promoEmoji}>👨‍💼</Text>
          </Pressable>

          {/* Products Grid */}
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <FlatList
            data={products}
            renderItem={({ item }) => renderProduct(item)}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.gridWrapper}
            contentContainerStyle={styles.gridContent}
          />
        </ScrollView>
      )}

      <BottomNav items={navItems} activeKey={tab} onChange={(k) => setTab(k as any)} />
      <ErrorPopup visible={errVisible} onDismiss={() => setErrVisible(false)} message="Something went wrong" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 100, paddingHorizontal: 16 },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  greeting: { fontSize: 12, color: colors.muted, fontFamily: 'Poppins_400Regular' },
  userName: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 2 },
  notificationIcon: { padding: 8 },
  headerIconImg: { width: 24, height: 24, tintColor: colors.text },
  iconText: { fontSize: 20 },

  // Search
  searchContainer: { marginTop: 16, marginBottom: 12 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchIconImg: { width: 18, height: 18, tintColor: colors.muted },
  searchIcon: { fontSize: 16 },
  searchPlaceholder: { fontSize: 14, color: colors.muted, flex: 1 },

  // Filters
  filterContainer: { flexDirection: 'row', gap: 8, marginBottom: 16, paddingRight: 16 },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  filterTabActive: { backgroundColor: colors.accent },
  filterText: { fontSize: 12, fontWeight: '600', color: colors.muted },
  filterTextActive: { color: 'white' },

  // Promo Banner
  promoBanner: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  promoContent: { flex: 1 },
  promoDiscount: { fontSize: 24, fontWeight: '800', color: 'white' },
  promoText: { fontSize: 14, color: 'white', opacity: 0.9, marginTop: 4 },
  promoEmoji: { fontSize: 48 },

  // Section Title
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },

  // Grid
  gridWrapper: { gap: 12 },
  gridContent: { gap: 12 },

  // Product Card
  productCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  emoji: { fontSize: 48 },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: 'white' },
  productName: { fontSize: 12, fontWeight: '600', color: colors.text, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  price: { fontSize: 13, fontWeight: '700', color: colors.accent },
  oldPrice: { fontSize: 11, color: colors.muted, textDecorationLine: 'line-through' },
  rating: { fontSize: 11, color: '#FFA500' },

  // Chats
  chatListContent: { paddingHorizontal: 16, paddingBottom: 100, paddingTop: 8, gap: 8 },
  chatItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  chatItemUnread: { borderColor: colors.accent, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  chatLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chatAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  chatAvatarText: { fontSize: 22 },
  chatBody: { flex: 1 },
  chatTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chatTitle: { fontSize: 14, fontWeight: '600', color: colors.text, flex: 1, marginRight: 8 },
  chatTitleUnread: { fontWeight: '800' },
  chatTime: { fontSize: 11, color: colors.muted },
  chatMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chatSnippet: { fontSize: 12, color: colors.muted, flex: 1 },
  chatSnippetUnread: { color: colors.text, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusDelivered: { backgroundColor: '#51CF66' },
  statusEnroute: { backgroundColor: '#F89B1C' },
  statusPaid: { backgroundColor: '#3B82F6' },
  statusText: { fontSize: 10, color: 'white', fontWeight: '700' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
});
