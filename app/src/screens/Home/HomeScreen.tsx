import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ImageSourcePropType, ScrollView, Image, FlatList, TextInput, Modal } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
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
  avatar?: string; 
  role?: 'buyer' | 'vendor';
};

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const [errVisible, setErrVisible] = useState(false);
  const [tab, setTab] = useState<'home'|'dashboard'|'feed'|'chats'|'profile'>('home');
  const [activeFilter, setActiveFilter] = useState('All');
  const [chatFilter, setChatFilter] = useState<'All' | 'Unread' | 'Paid' | 'Delivered' | 'Enroute'>('All');
  const [chatSearch, setChatSearch] = useState('');
  const [dashMenuOpen, setDashMenuOpen] = useState(false);
  const [showInvoices, setShowInvoices] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [showKYC, setShowKYC] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<{ id: string; total: number; status: string } | null>(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [productMenu, setProductMenu] = useState<{ id: string|null; x: number; y: number; visible: boolean }>({ id: null, x: 0, y: 0, visible: false });
  const productRefs = React.useRef<Record<string, View | null>>({});
  // Full-screen viewer state
  const [viewer, setViewer] = useState<{ visible: boolean; images: string[]; index: number }>({ visible: false, images: [], index: 0 });

  const navItems = useMemo(() => ([
    { key: 'home', label: 'Home', icon: require('../../../assets/icons/home.png') as ImageSourcePropType },
    { key: 'dashboard', label: 'Dashboard', icon: require('../../../assets/icons/dashboard.png') as ImageSourcePropType },
    { key: 'feed', label: 'Feed', icon: require('../../../assets/icons/feed.png') as ImageSourcePropType },
    { key: 'chats', label: 'Chats', icon: require('../../../assets/icons/chats.png') as ImageSourcePropType },
    { key: 'profile', label: 'Profile', icon: require('../../../assets/icons/profile.png') as ImageSourcePropType },
  ]), []);

  const filters = ['All', 'Electronics', 'Fashion', 'Properties', 'Furniture', 'Books', 'Sports', 'Jewelry'];

  const products: Product[] = [
    { id: '1', name: 'iPhone 12 Pro', price: 999, oldPrice: 1299, image: '📱', badge: 'Sale', rating: 4.5, views: 1450, likes: 210 } as any,
    { id: '2', name: 'MacBook Pro M2', price: 1999, image: '💻', rating: 4.8, views: 820, likes: 130 } as any,
    { id: '3', name: 'Wireless Earbuds', price: 199, oldPrice: 299, image: '🎧', badge: 'Hot', rating: 4.3, views: 560, likes: 88 } as any,
    { id: '4', name: 'Smart Watch', price: 299, image: '⌚', rating: 4.6, views: 390, likes: 65 } as any,
  ];

  const outlet = {
    name: 'TechHub Electronics',
    logoEmoji: '🏪',
    coverEmoji: '🖼️',
    brandFace: '🧑🏽‍💼',
    followers: 1200,
    following: 23,
    likes: 987,
  };

  const chats: Chat[] = [
    { id: 'c1', name: 'TechHub Electronics', lastMessage: 'Your order is on the way 🚚', time: '09:12', status: 'Enroute', unread: true, avatar: '📦', role: 'vendor' },
    { id: 'c2', name: 'Style & Co.', lastMessage: 'Payment received. Thanks! 🧾', time: 'Yesterday', status: 'Paid', unread: false, avatar: '👜' },
    { id: 'c3', name: 'BookWorld Store', lastMessage: 'Package delivered. Enjoy reading! 📚', time: 'Mon', status: 'Delivered', unread: false, avatar: '📚' },
    { id: 'c4', name: 'FurnishIt', lastMessage: 'We have a discount on sofas.', time: 'Sun', unread: true, avatar: '🛋️' },
    { id: 'c5', name: 'Gadget Arena', lastMessage: 'Can we confirm your address?', time: 'Sat', unread: false, avatar: '🔌' },
  ];

  const filteredChats = useMemo(() => {
    const term = chatSearch.trim().toLowerCase();
    return chats.filter((c) => {
      if (chatFilter === 'Unread' && !c.unread) return false;
      if (chatFilter === 'Paid' && c.status !== 'Paid') return false;
      if (chatFilter === 'Delivered' && c.status !== 'Delivered') return false;
      if (chatFilter === 'Enroute' && c.status !== 'Enroute') return false;
      if (term) {
        const hay = `${c.name} ${c.lastMessage}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [chats, chatFilter, chatSearch]);

  // Respond to navigation param to switch tabs when navigated from other screens
  React.useEffect(() => {
    const rtab = (route?.params as any)?.tab as 'home'|'dashboard'|'feed'|'chats'|'profile' | undefined;
    if (rtab && rtab !== tab) {
      setTab(rtab);
    }
  }, [route?.params?.tab]);

  const renderChat = (item: Chat) => (
    <Pressable
      key={item.id}
      style={[styles.chatItem, item.unread && styles.chatItemUnread]}
      onPress={() => navigation.navigate('ChatDetail', { chatId: item.id, name: item.name, role: item.role ?? 'buyer' })}
    >
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

  const renderProduct = (item: Product) => {
    if (tab === 'dashboard') {
      return (
        <View style={styles.productCard}>
          <View style={styles.productImage}>
            <Text style={styles.emoji}>{item.image}</Text>
            {/* Hide sale badges on Dashboard */}
            {item.badge && tab !== 'dashboard' && (
              <View style={styles.badge}><Text style={styles.badgeText}>{item.badge}</Text></View>
            )}
            <Pressable
              ref={(r) => { productRefs.current[item.id] = r as any; }}
              style={styles.dotBtn}
              onPress={() => {
                const ref = productRefs.current[item.id];
                if (!ref) return;
                (ref as any).measureInWindow((x: number, y: number, w: number, h: number) => {
                  setProductMenu({ id: item.id, x: x + w - 160, y: y + 8, visible: true });
                });
              }}
            >
              <Text style={{ fontSize: 16, color: '#6B7280' }}>⋮</Text>
            </Pressable>
          </View>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>NGN {item.price}</Text>
            {item.oldPrice && <Text style={styles.oldPrice}>NGN {item.oldPrice}</Text>}
          </View>
          {item.rating && <Text style={styles.rating}>★ {item.rating}</Text>}
          {/* Metrics row */}
          <View style={styles.metricsRow}>
            <Text style={styles.metric}>👁️ { (item as any).views ?? 0 }</Text>
            <Text style={styles.metric}>❤️ { (item as any).likes ?? 0 }</Text>
          </View>
        </View>
      );
    }
    // Home and other tabs: tap opens Product Detail
    return (
      <Pressable style={styles.productCard} onPress={() => navigation.navigate('ProductDetail', { productId: item.id, productName: item.name })}>
        <View style={styles.productImage}>
          <Text style={styles.emoji}>{item.image}</Text>
          {item.badge && (
            <View style={styles.badge}><Text style={styles.badgeText}>{item.badge}</Text></View>
          )}
        </View>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>NGN {item.price}</Text>
          {item.oldPrice && <Text style={styles.oldPrice}>NGN {item.oldPrice}</Text>}
        </View>
        {item.rating && <Text style={styles.rating}>★ {item.rating}</Text>}
      </Pressable>
    );
  };

  // Feed sample data
  type Post = {
    id: string;
    outlet: string;
    avatar?: string;
    time: string;
    text: string;
    images: string[];
    comments: { id: string; user: string; avatar?: string; text: string; time: string }[];
  };

  const posts: Post[] = [
    {
      id: 'p1', outlet: 'TechHub Electronics', avatar: '🏪', time: '2h',
      text: 'Fresh stock just arrived! iPhone 12 Pro and accessories. Limited quantities, grab yours now 🚀',
      images: [
        'https://picsum.photos/id/1011/800/800',
        'https://picsum.photos/id/1015/800/800',
        'https://picsum.photos/id/1023/800/800',
        'https://picsum.photos/id/1035/800/800',
        'https://picsum.photos/id/1043/800/800',
      ],
      comments: [
        { id: 'c1', user: 'Ada', avatar: '🧠', text: 'Do you have blue color?', time: '1h' },
        { id: 'c2', user: 'Marcus', avatar: '🧑', text: 'Price please?', time: '45m' },
      ],
    },
    {
      id: 'p2', outlet: 'Gadget Arena', avatar: '🔌', time: '5h',
      text: 'Weekend deals on earbuds and smartwatches. Swipe through the gallery 💥',
      images: [
        'https://picsum.photos/id/1050/800/800',
        'https://picsum.photos/id/1057/800/800',
        'https://picsum.photos/id/1060/800/800',
      ],
      comments: [
        { id: 'c1', user: 'Lisa', avatar: '💃', text: 'Battery life?', time: '2h' },
      ],
    },
  ];

  const [openComments, setOpenComments] = useState<{ postId: string | null; composer: string }>({ postId: null, composer: '' });

  const openViewer = (images: string[], index: number = 0) => {
    setViewer({ visible: true, images, index });
  };

  const goPrev = () => setViewer((v) => ({ ...v, index: Math.max(0, v.index - 1) }));
  const goNext = () => setViewer((v) => ({ ...v, index: Math.min(v.images.length - 1, v.index + 1) }));

  const renderImageGrid = (imgs: string[]) => {
    if (imgs.length <= 1) {
      return (
        <View style={styles.feedOneWrap}>
          <Pressable onPress={() => openViewer(imgs, 0)}>
            <Image source={{ uri: imgs[0] }} style={styles.feedOne} />
          </Pressable>
        </View>
      );
    }
    const toShow = imgs.slice(0, 4);
    return (
      <View style={styles.feedGrid}>
        {toShow.map((u, idx) => (
          <Pressable key={u + idx} style={styles.feedTile} onPress={() => openViewer(imgs, idx)}>
            <Image source={{ uri: u }} style={styles.feedTileImg} />
            {idx === 3 && imgs.length > 4 ? (
              <View style={styles.seeMoreOverlay}>
                <Text style={styles.seeMoreText}>+{imgs.length - 3}\nSee more</Text>
              </View>
            ) : null}
          </Pressable>
        ))}
      </View>
    );
  };

  const renderPost = (p: Post) => (
    <View key={p.id} style={styles.postCard}>
      {/* Header */}
      <View style={styles.postHeader}>
        <View style={styles.postAvatar}><Text style={{ fontSize: 16 }}>{p.avatar || '🏪'}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.postOutlet}>{p.outlet}</Text>
          <Text style={styles.postTime}>{p.time}</Text>
        </View>
        <Text style={{ color: colors.muted, fontSize: 18 }}>⋮</Text>
      </View>

      {/* Text */}
      <Text style={styles.postText}>{p.text}</Text>

      {/* Images */}
      {renderImageGrid(p.images)}

      {/* Actions */}
      <View style={styles.postActions}>
        <Pressable style={[styles.postBtn, { backgroundColor: colors.accent }]} onPress={() => setErrVisible(true)}>
          <Text style={styles.postBtnText}>Buy</Text>
        </Pressable>
        <Pressable style={[styles.postBtn, { backgroundColor: '#F0F0F0' }]} onPress={() => setErrVisible(true)}>
          <Text style={[styles.postBtnText, { color: colors.text }]}>Add to Cart</Text>
        </Pressable>
        <Pressable style={[styles.postBtn, { backgroundColor: '#E5F0FF' }]} onPress={() => setOpenComments({ postId: p.id, composer: '' })}>
          <Text style={[styles.postBtnText, { color: '#2563EB' }]}>Comment</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        {tab === 'dashboard' ? (
          <>
            <Text style={[styles.userName, { flex: 1 }]}>Dashboard</Text>
            <Pressable style={styles.notificationIcon} onPress={() => setDashMenuOpen((s) => !s)}>
              <Text style={{ fontSize: 20, color: colors.text }}>⋮</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View>
              <Text style={styles.greeting}>Good morning</Text>
              <Text style={styles.userName}>Jimmy Samson</Text>
            </View>
            <Pressable style={styles.notificationIcon}>
              <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIconImg} resizeMode="contain" />
            </Pressable>
          </>
        )}
      </View>

      {tab === 'chats' ? (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderChat(item)}
          contentContainerStyle={styles.chatListContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={(
            <View style={styles.chatHeader}>
              {/* Chats Search */}
              <View style={styles.chatSearchBar}>
                <Image source={require('../../../assets/icons/search.png')} style={styles.chatSearchIconImg} resizeMode="contain" />
                <TextInput
                  style={styles.chatSearchInput}
                  placeholder="Search chats..."
                  placeholderTextColor={colors.muted}
                  value={chatSearch}
                  onChangeText={setChatSearch}
                  returnKeyType="search"
                />
              </View>

              {/* Chats Filters */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chatFilterRow}
              >
                {(['All','Unread','Paid','Delivered','Enroute'] as const).map((f) => (
                  <Pressable key={f} style={[styles.chatFilterChip, chatFilter === f && styles.chatFilterChipActive]} onPress={() => setChatFilter(f)}>
                    <Text style={[styles.chatFilterText, chatFilter === f && styles.chatFilterTextActive]}>{f}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        />
      ) : tab === 'feed' ? (
        <FlatList
          data={posts}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => renderPost(item)}
          contentContainerStyle={styles.feedList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={(
            <View style={styles.storiesWrap}>
              <FlatList
                data={[
                  { id: 's1', name: 'TechHub', logo: '🏪' },
                  { id: 's2', name: 'Gadget', logo: '🔌' },
                  { id: 's3', name: 'Style & Co.', logo: '👜' },
                  { id: 's4', name: 'BookWorld', logo: '📚' },
                  { id: 's5', name: 'FurnishIt', logo: '🛋️' },
                  { id: 's6', name: 'FreshMart', logo: '🛒' },
                  { id: 's7', name: 'SneakPeak', logo: '👟' },
                  { id: 's8', name: 'ZenWear', logo: '🧘' },
                ]}
                keyExtractor={(s) => s.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.storiesList}
                renderItem={({ item }) => (
                  <View style={styles.storyItem}>
                    <View style={styles.storyCircle}>
                      <Text style={styles.storyLogo}>{item.logo}</Text>
                    </View>
                    <Text style={styles.storyName} numberOfLines={1}>{item.name}</Text>
                  </View>
                )}
              />
            </View>
          )}
        />
      ) : tab === 'profile' ? (
        <ScrollView contentContainerStyle={styles.profileContent} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profHeader}>
            <View style={styles.profAvatar}><Text style={{ fontSize: 28 }}>👤</Text></View>
            <Text style={styles.profName}>Jimmy Samson</Text>
            <Text style={styles.profHandle}>@jimmy</Text>
          </View>

          {/* Profile Menu */}
          <View style={{ paddingHorizontal: 16 }}>
            {[
              { key: 'FollowingList', label: 'Following' },
              { key: 'Cart', label: 'Cart' },
              { key: 'InvoicesList', label: 'Invoices' },
              { key: 'LikedProducts', label: 'Liked Products' },
              { key: 'Settings', label: 'Settings' },
            ].map((it) => (
              <Pressable key={it.key} style={styles.profRow} onPress={() => navigation.navigate(it.key as any)}>
                <Text style={styles.profRowText}>{it.label}</Text>
                <Text style={{ color: colors.muted }}>›</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
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

      <BottomNav
        items={navItems}
        activeKey={tab}
        onChange={(k) => {
          if (k === 'dashboard') {
            // Route to the single source-of-truth Vendor Dashboard screen
            navigation.navigate('VendorDashboard');
            return;
          }
          setTab(k as any);
        }}
      />
      <ErrorPopup visible={errVisible} onDismiss={() => setErrVisible(false)} message="Something went wrong" />

      {/* Dashboard top-right menu */}
      {dashMenuOpen && tab === 'dashboard' ? (
        <Pressable style={styles.menuOverlay} onPress={() => setDashMenuOpen(false)}>
          <View style={styles.topMenu}>
            <Pressable style={styles.menuItem} onPress={() => { setDashMenuOpen(false); setShowInvoices(true); }}>
              <Text style={styles.menuText}>Invoices</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => { setDashMenuOpen(false); setShowTheme(true); }}>
              <Text style={styles.menuText}>Color Theme</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => { setDashMenuOpen(false); setShowKYC(true); }}>
              <Text style={styles.menuText}>KYC</Text>
            </Pressable>
          </View>
        </Pressable>
      ) : null}

      {/* Invoices Modal (restyled like reviews modal) */}
      <Modal
        visible={showInvoices}
        animationType="slide"
        transparent
        onRequestClose={() => setShowInvoices(false)}
      >
        <SafeAreaView style={styles.invModalSafe}>
          <View style={styles.invModalHeader}>
            <Pressable onPress={() => setShowInvoices(false)}>
              <Text style={styles.invModalCloseBtn}>✕</Text>
            </Pressable>
            <Text style={styles.invModalTitle}>Invoices</Text>
            <View style={{ width: 30 }} />
          </View>
          <FlatList
            data={[
              { id: 'INV-101', total: 1019, status: 'Paid (Escrowed)', createdBy: 'outlet' },
              { id: 'INV-102', total: 550, status: 'Unpaid', createdBy: 'outlet' },
              { id: 'INV-103', total: 2599, status: 'Paid (Escrowed)', createdBy: 'buyer' },
            ].filter((i) => i.createdBy === 'outlet')}
            keyExtractor={(it) => it.id}
            renderItem={({ item }) => (
              <Pressable style={styles.invItem} onPress={() => setSelectedInvoice({ id: item.id, total: item.total, status: item.status })}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.invId}>{item.id}</Text>
                  <Text style={styles.invSub}>Total: NGN {item.total}</Text>
                </View>
                <View style={[styles.invStatusBadge, item.status.includes('Paid') ? styles.invStatusPaid : styles.invStatusUnpaid]}>
                  <Text style={styles.invStatusText}>{item.status}</Text>
                </View>
              </Pressable>
            )}
            contentContainerStyle={styles.invList}
          />
        </SafeAreaView>
      </Modal>

      {/* Invoice Details Modal */}
      <Modal
        visible={!!selectedInvoice}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedInvoice(null)}
      >
        <SafeAreaView style={styles.invModalSafe}>
          <View style={styles.invModalHeader}>
            <Pressable onPress={() => setSelectedInvoice(null)}>
              <Text style={styles.invModalCloseBtn}>✕</Text>
            </Pressable>
            <Text style={styles.invModalTitle}>Invoice Details</Text>
            <View style={{ width: 30 }} />
          </View>
          {selectedInvoice ? (
            <View style={{ padding: 16 }}>
              <View style={styles.invDetailCard}>
                <View style={styles.invDetailRow}><Text style={styles.invDetailLabel}>Invoice ID</Text><Text style={styles.invDetailValue}>{selectedInvoice.id}</Text></View>
                <View style={styles.invDetailRow}><Text style={styles.invDetailLabel}>Total</Text><Text style={styles.invDetailValue}>NGN {selectedInvoice.total}</Text></View>
                <View style={styles.invDetailRow}><Text style={styles.invDetailLabel}>Status</Text><Text style={[styles.invDetailValue, { color: selectedInvoice.status.includes('Paid') ? '#3B82F6' : '#EF4444' }]}>{selectedInvoice.status}</Text></View>
              </View>
            </View>
          ) : null}
        </SafeAreaView>
      </Modal>

      {/* Followers Modal */}
      <Modal
        visible={showFollowers}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFollowers(false)}
      >
        <SafeAreaView style={styles.invModalSafe}>
          <View style={styles.invModalHeader}>
            <Pressable onPress={() => setShowFollowers(false)}>
              <Text style={styles.invModalCloseBtn}>✕</Text>
            </Pressable>
            <Text style={styles.invModalTitle}>Followers</Text>
            <View style={{ width: 30 }} />
          </View>
          <FlatList
            data={[
              { id: 'u1', name: 'Ada Lovelace', avatar: '🧠' },
              { id: 'u2', name: 'Elon M.', avatar: '🚀' },
              { id: 'u3', name: 'Grace Hopper', avatar: '💻' },
              { id: 'u4', name: 'Tony Stark', avatar: '🛠️' },
            ]}
            keyExtractor={(u) => u.id}
            renderItem={({ item }) => (
              <View style={styles.userRow}>
                <View style={styles.userAvatar}><Text style={{ fontSize: 18 }}>{item.avatar}</Text></View>
                <Text style={styles.fUserName}>{item.name}</Text>
              </View>
            )}
            contentContainerStyle={styles.invList}
          />
        </SafeAreaView>
      </Modal>

      {/* Following Modal */}
      <Modal
        visible={showFollowing}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFollowing(false)}
      >
        <SafeAreaView style={styles.invModalSafe}>
          <View style={styles.invModalHeader}>
            <Pressable onPress={() => setShowFollowing(false)}>
              <Text style={styles.invModalCloseBtn}>✕</Text>
            </Pressable>
            <Text style={styles.invModalTitle}>Following</Text>
            <View style={{ width: 30 }} />
          </View>
          <FlatList
            data={[
              { id: 'v1', name: 'Style & Co.', avatar: '👜' },
              { id: 'v2', name: 'BookWorld Store', avatar: '📚' },
              { id: 'v3', name: 'FurnishIt', avatar: '🛋️' },
            ]}
            keyExtractor={(u) => u.id}
            renderItem={({ item }) => (
              <View style={styles.userRow}>
                <View style={styles.userAvatar}><Text style={{ fontSize: 18 }}>{item.avatar}</Text></View>
                <Text style={styles.fUserName}>{item.name}</Text>
              </View>
            )}
            contentContainerStyle={styles.invList}
          />
        </SafeAreaView>
      </Modal>

      {/* Color Theme Modal (non-functional) */}
      {showTheme ? (
        <Pressable style={styles.modalOverlay} onPress={() => setShowTheme(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Color Theme</Text>
            <Text style={{ color: colors.muted, marginBottom: 12 }}>(Coming soon)</Text>
            <View style={styles.colorGrid}>
              {['#F43F5E','#F59E0B','#10B981','#3B82F6','#8B5CF6','#111827'].map((c) => (
                <View key={c} style={[styles.colorSwatch, { backgroundColor: c }]} />
              ))}
            </View>
          </View>
        </Pressable>
      ) : null}

      {/* KYC Modal */}
      {showKYC ? (
        <Pressable style={styles.modalOverlay} onPress={() => setShowKYC(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>KYC</Text>
            <Text style={{ color: colors.muted }}>Verify your identity to unlock higher limits.</Text>
            <View style={{ height: 12 }} />
            <Pressable style={styles.kycBtn} onPress={() => setShowKYC(false)}>
              <Text style={styles.kycBtnText}>Start KYC</Text>
            </Pressable>
          </View>
        </Pressable>
      ) : null}

      {/* Product item menu */}
      {productMenu.visible ? (
        <Pressable style={styles.menuOverlay} onPress={() => setProductMenu({ id: null, x: 0, y: 0, visible: false })}>
          <View style={[styles.contextMenu, { top: productMenu.y, left: productMenu.x }]}>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                const id = productMenu.id;
                setProductMenu({ id: null, x: 0, y: 0, visible: false });
                if (!id) return;
                const p = products.find((it) => it.id === id);
                navigation.navigate('EditProduct', {
                  productId: id,
                  name: p?.name,
                  price: p?.price,
                  description: 'Great condition, includes warranty.',
                  images: [],
                });
              }}
            >
              <Text style={styles.menuText}>Edit</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => setProductMenu({ id: null, x: 0, y: 0, visible: false })}><Text style={styles.menuText}>Hide</Text></Pressable>
            <Pressable style={styles.menuItem} onPress={() => setProductMenu({ id: null, x: 0, y: 0, visible: false })}><Text style={[styles.menuText, { color: '#EF4444' }]}>Delete</Text></Pressable>
          </View>
        </Pressable>
      ) : null}

      {/* Floating Create Product button (sticky, higher) */}
      {tab === 'dashboard' ? (
        <Pressable style={styles.fab} onPress={() => navigation.navigate('CreateProduct')}>
          <Text style={styles.fabPlus}>＋</Text>
        </Pressable>
      ) : null}

      {/* Comments Modal - IG-like */}
      <Modal
        visible={!!openComments.postId}
        animationType="slide"
        transparent
        onRequestClose={() => setOpenComments({ postId: null, composer: '' })}
      >
        <SafeAreaView style={styles.invModalSafe}>
          <View style={styles.invModalHeader}>
            <Pressable onPress={() => setOpenComments({ postId: null, composer: '' })}>
              <Text style={styles.invModalCloseBtn}>✕</Text>
            </Pressable>
            <Text style={styles.invModalTitle}>Comments</Text>
            <View style={{ width: 30 }} />
          </View>
          <FlatList
            data={posts.find((p) => p.id === openComments.postId)?.comments ?? []}
            keyExtractor={(c) => c.id}
            renderItem={({ item }) => (
              <View style={styles.commentRow}>
                <View style={styles.commentAvatar}><Text style={{ fontSize: 16 }}>{item.avatar || '👤'}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.commentUser}>{item.user} · <Text style={styles.commentTime}>{item.time}</Text></Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              </View>
            )}
            contentContainerStyle={styles.invList}
          />
          <View style={styles.commentComposer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor={colors.muted}
              value={openComments.composer}
              onChangeText={(t) => setOpenComments((s) => ({ ...s, composer: t }))}
            />
            <Pressable
              style={[styles.sendCommentBtn, { opacity: openComments.composer.trim() ? 1 : 0.5 }]}
              disabled={!openComments.composer.trim()}
              onPress={() => {
                const pid = openComments.postId; if (!pid) return;
                const txt = openComments.composer.trim(); if (!txt) return;
                const idx = posts.findIndex((p) => p.id === pid);
                if (idx >= 0) {
                  // Since posts is const, just close and reset. In real app, update store.
                  setOpenComments({ postId: pid, composer: '' });
                }
              }}
            >
              <Text style={styles.sendCommentText}>Send</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Full-screen image viewer with pinch-to-zoom and swipe */}
      <ImageViewing
        images={viewer.images.map((u) => ({ uri: u }))}
        imageIndex={viewer.index}
        visible={viewer.visible}
        onRequestClose={() => setViewer((v) => ({ ...v, visible: false }))}
        onImageIndexChange={(i) => setViewer((v) => ({ ...v, index: i ?? 0 }))}
        HeaderComponent={({ imageIndex }) => (
          <View style={styles.viewerHeader}>
            <Pressable onPress={() => setViewer((v) => ({ ...v, visible: false }))}>
              <Text style={styles.viewerClose}>✕</Text>
            </Pressable>
            <Text style={styles.viewerTitle}>{(imageIndex ?? 0) + 1} / {viewer.images.length}</Text>
            <View style={{ width: 30 }} />
          </View>
        )}
      />
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
  dashboardGridContent: { paddingHorizontal: 16 },

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
  dotBtn: { position: 'absolute', top: 6, right: 6, padding: 6 },
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
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  metric: { fontSize: 11, color: colors.muted, fontWeight: '600' },

  // Chats
  chatListContent: { paddingHorizontal: 16, paddingBottom: 100, paddingTop: 8, gap: 8 },
  chatHeader: { gap: 10, marginBottom: 8 },
  chatSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  chatSearchIconImg: { width: 18, height: 18, tintColor: colors.muted },
  chatSearchInput: { flex: 1, fontSize: 14, color: colors.text },
  chatFilterRow: { flexDirection: 'row', gap: 8, paddingRight: 8 },
  chatFilterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F0F0' },
  chatFilterChipActive: { backgroundColor: colors.accent },
  chatFilterText: { fontSize: 12, fontWeight: '600', color: colors.muted },
  chatFilterTextActive: { color: 'white' },
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

  // Dashboard
  dashboardContent: { paddingBottom: 120 },
  coverWrap: { position: 'relative', marginBottom: 48 },
  coverPhoto: { height: 120, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  coverEmoji: { fontSize: 40 },
  logoWrap: { position: 'absolute', bottom: -28, left: 16, width: 96, height: 64 },
  logoCircle: { position: 'absolute', bottom: 0, left: 0, width: 64, height: 64, borderRadius: 32, backgroundColor: 'white', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  logoEmoji: { fontSize: 28 },
  brandFace: { position: 'absolute', bottom: -2, left: 48, width: 32, height: 32, borderRadius: 16, backgroundColor: 'white', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  brandFaceEmoji: { fontSize: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 16, marginTop: 12, marginBottom: 8 },
  statBox: { alignItems: 'center' },
  statNum: { fontSize: 16, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 11, color: colors.muted },

  fab: { position: 'absolute', right: 16, bottom: 120, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6 },
  fabPlus: { color: 'white', fontSize: 28, lineHeight: 28, marginTop: -2 },

  // Menus and Modals
  menuOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  topMenu: { position: 'absolute', top: 52, right: 12, width: 180, backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, elevation: 6 },
  contextMenu: { position: 'absolute', width: 160, backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, elevation: 6 },
  menuItem: { paddingVertical: 10, paddingHorizontal: 12 },
  menuText: { fontSize: 13, fontWeight: '600', color: colors.text },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 420, backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  modalTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 8 },
  invoiceRowItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  colorSwatch: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  kycBtn: { marginTop: 8, backgroundColor: colors.accent, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  kycBtnText: { color: 'white', fontWeight: '700' },
  // Feed
  feedList: { padding: 16, paddingBottom: 120, gap: 12 },
  postCard: { backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#EFEFEF', padding: 12, marginBottom: 12 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  postAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  postOutlet: { fontSize: 13, fontWeight: '700', color: colors.text },
  postTime: { fontSize: 11, color: colors.muted },
  postText: { fontSize: 13, color: colors.text, marginBottom: 8 },
  feedOneWrap: { width: '100%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: '#EFEFEF' },
  feedOne: { width: '100%', height: '100%' },
  feedGrid: { flexDirection: 'row', flexWrap: 'wrap', borderRadius: 12, overflow: 'hidden', backgroundColor: '#EFEFEF' },
  feedTile: { width: '50%', aspectRatio: 1, padding: 1 },
  feedTileImg: { width: '100%', height: '100%' },
  seeMoreOverlay: { position: 'absolute', inset: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  seeMoreText: { color: 'white', fontWeight: '800', textAlign: 'center', lineHeight: 18 },
  postActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  postBtn: { flex: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  postBtnText: { color: 'white', fontWeight: '700' },

  // Comments modal
  commentRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  commentAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  commentUser: { fontSize: 12, fontWeight: '700', color: colors.text },
  commentTime: { fontSize: 11, color: colors.muted, fontWeight: '400' },
  commentText: { fontSize: 12, color: colors.text },
  commentComposer: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: colors.background },
  commentInput: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: colors.text },
  sendCommentBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.accent },
  sendCommentText: { color: 'white', fontWeight: '700' },

  // Stories
  storiesWrap: { marginBottom: 12 },
  storiesList: { paddingHorizontal: 4, paddingBottom: 8 },
  storyItem: { width: 68, alignItems: 'center', marginRight: 10 },
  storyCircle: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: '#F59E0B', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' },
  storyLogo: { fontSize: 24 },
  storyName: { fontSize: 11, color: colors.text, marginTop: 6 },

  // Invoices modal (reviews-style)
  invModalSafe: { flex: 1, backgroundColor: colors.background },
  invModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  invModalCloseBtn: { fontSize: 24, fontWeight: '700', color: colors.text },
  invModalTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  invList: { padding: 16 },
  invItem: { backgroundColor: 'white', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#EFEFEF', marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  invId: { fontSize: 13, fontWeight: '800', color: colors.text },
  invSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  invStatusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  invStatusPaid: { backgroundColor: '#3B82F6' },
  invStatusUnpaid: { backgroundColor: '#F87171' },
  invStatusText: { fontSize: 10, color: 'white', fontWeight: '700' },

  // Invoice details
  invDetailCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#EFEFEF' },
  invDetailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  invDetailLabel: { fontSize: 12, color: colors.muted },
  invDetailValue: { fontSize: 13, color: colors.text, fontWeight: '700' },

  // User list (followers/following)
  userRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#EFEFEF', marginBottom: 12 },
  userAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  fUserName: { fontSize: 13, color: colors.text, fontWeight: '700' },

  // Viewer
  viewerSafe: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' },
  viewerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  viewerClose: { fontSize: 24, color: 'white', fontWeight: '800' },
  viewerTitle: { fontSize: 14, color: 'white', fontWeight: '700' },
  viewerBody: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  viewerImage: { width: '100%', height: '100%' },
  viewerZoneLeft: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '35%' },
  viewerZoneRight: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '35%' },
  viewerDots: { position: 'absolute', bottom: 24, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  viewerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' },
  viewerDotActive: { backgroundColor: 'white' },

  // Profile
  profileContent: { paddingBottom: 120, paddingTop: 12 },
  profHeader: { alignItems: 'center', marginBottom: 16 },
  profAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  profName: { marginTop: 10, fontSize: 16, color: colors.text, fontWeight: '800' },
  profHandle: { fontSize: 12, color: colors.muted, marginTop: 2 },
  profRow: { backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#EFEFEF', padding: 14, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profRowText: { fontSize: 13, color: colors.text, fontWeight: '700' },
});
