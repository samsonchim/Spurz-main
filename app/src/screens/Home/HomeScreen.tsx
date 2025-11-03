import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ImageSourcePropType, ScrollView, Image, FlatList, TextInput, Modal, RefreshControl } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { colors } from '../../theme/colors';
import { apiGet, API_BASE } from '../../services/api';
import { PROMO_IMAGE_URL, PROMO_FALLBACK_URL } from '../../config/marketing';
import ErrorPopup from '../../components/ErrorPopup';
import BottomNav from '../../components/BottomNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userSession } from '../../services/userSession';

type Product = {
  id: string;
  name: string;
  price: number;
  old_price?: number | null;
  images?: string[] | null;
  category?: string | null;
  rating?: number;
};

  type ConversationRow = {
    id: string;
    buyerId: string;
    vendorId: string;
    outletId: string;
    productId: string;
    lastMessageAt: string | null;
    productName: string | null;
    outletName: string | null;
    otherPartyId: string;
    otherPartyName: string;
    otherPartyAvatar?: string | null;
    status?: 'unpaid' | 'paid' | 'enroute' | 'delivered' | null;
    lastMessage?: { id: string; body: string; senderId: string; senderRole: 'buyer' | 'vendor' | 'bot'; createdAt: string } | null;
  };

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const [errVisible, setErrVisible] = useState(false);
  const [tab, setTab] = useState<'home'|'dashboard'|'feed'|'chats'|'profile'>('home');
  const [activeFilter, setActiveFilter] = useState('All');
  const [chatFilter, setChatFilter] = useState<'All' | 'Unread' | 'Paid' | 'Delivered' | 'Enroute'>('All');
  const [chatSearch, setChatSearch] = useState('');
  const [homeSearch, setHomeSearch] = useState('');
  const [dashMenuOpen, setDashMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string>('');
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

  const [products, setProducts] = useState<Product[]>([]);
  const [homeLoading, setHomeLoading] = useState<boolean>(false);
  const [homeRefreshing, setHomeRefreshing] = useState<boolean>(false);
  const [imageVersion, setImageVersion] = useState<number>(Date.now());

  useEffect(() => {
    // Redirect to Login if no session, then fetch newest products for Home
    (async () => {
      try {
        const user = await userSession.getCurrentUser();
        if (!user) {
          navigation.navigate('Login');
          return;
        }
        setDisplayName(user?.name || user?.email || 'User');
        setHomeLoading(true);
        // Cache-first load for 'All' category
        await loadProductsCached('All');
        // Prime chats list when landing
        meRef.current = { id: user.id };
        await loadConversations();
      } finally {
        setHomeLoading(false);
      }
    })();
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const sanitizeTerm = (s?: string) => (s || '').trim().toLowerCase();
  const HOME_CACHE_KEY = (cat: string, term?: string) => {
    const keyTerm = sanitizeTerm(term);
    return `home_products_cache_v1_${cat || 'All'}_${encodeURIComponent(keyTerm)}`;
  };

  const fetchProducts = async (category?: string, term?: string) => {
    const params: string[] = ['limit=20'];
    if (category && category !== 'All') params.push(`category=${encodeURIComponent(category)}`);
    const t = sanitizeTerm(term);
    if (t) params.push(`search=${encodeURIComponent(t)}`);
    const q = `/products/list?${params.join('&')}`;
    const res = await apiGet(q);
    if (res.ok) {
      const list = (res.data as any)?.products ?? [];
      setProducts(list);
      await AsyncStorage.setItem(HOME_CACHE_KEY(category || 'All', term), JSON.stringify(list));
      setImageVersion(Date.now());
    }
  };

  const loadProductsCached = async (category?: string, term?: string) => {
    const key = HOME_CACHE_KEY(category || 'All', term);
    const raw = await AsyncStorage.getItem(key);
    const cache = raw ? (JSON.parse(raw) as Product[]) : null;
    if (cache) setProducts(cache);
    if (!cache) await fetchProducts(category, term);
  };

  const onRefreshHome = async () => {
    try {
      setHomeRefreshing(true);
      await fetchProducts(activeFilter, homeSearch);
    } finally {
      setHomeRefreshing(false);
    }
  };

  const outlet = {
    name: 'TechHub Electronics',
    logoEmoji: '🏪',
    coverEmoji: '🖼️',
    brandFace: '🧑🏽‍💼',
    followers: 1200,
    following: 23,
    likes: 987,
  };

  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [readSet, setReadSet] = useState<Set<string>>(new Set());
  const meRef = React.useRef<{ id: string } | null>(null);

  const filteredChats = useMemo(() => {
    const term = chatSearch.trim().toLowerCase();
    const list = conversations.filter((c) => {
      if (term) {
        const preview = c.lastMessage?.body || '';
        const hay = `${c.otherPartyName} ${preview} ${c.productName || ''} ${c.outletName || ''}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
    return list;
  }, [conversations, chatSearch]);

  // Respond to navigation param to switch tabs when navigated from other screens
  React.useEffect(() => {
    const rtab = (route?.params as any)?.tab as 'home'|'dashboard'|'feed'|'chats'|'profile' | undefined;
    if (rtab && rtab !== tab) {
      setTab(rtab);
    }
  }, [route?.params?.tab]);

  // Load conversations when switching to chats tab
  useEffect(() => {
    (async () => {
      if (tab !== 'chats') return;
      const me = await userSession.getCurrentUser();
      if (!me) return;
      meRef.current = { id: me.id };
      await loadConversations();
    })();
  }, [tab]);

  const loadConversations = async () => {
    try {
      const me = await userSession.getCurrentUser();
      if (!me) return;
      const resp = await apiGet(`/chats/list?userId=${encodeURIComponent(me.id)}&limit=50`);
      if (resp.ok && resp.data) {
        const convs = ((resp.data as any).conversations as ConversationRow[]) || [];
        convs.sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime());
        setConversations(convs);
      }
    } catch {}
  };

  // Realtime updates for chats tab
  useEffect(() => {
    const { getSupabase } = require('../../services/realtime');
    const sb = getSupabase();
    if (!sb) return;
    const channel = sb.channel('home-conversations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload: any) => {
        const m = payload?.new; if (!m) return;
        setConversations((prev: ConversationRow[]) => {
          const idx = prev.findIndex((r) => r.id === m.conversation_id);
          if (idx === -1) return prev;
          const copy = [...prev];
          const row: ConversationRow = { ...copy[idx] } as ConversationRow;
          row.lastMessageAt = m.created_at;
          row.lastMessage = { id: m.id, body: m.body || '', senderId: m.sender_id, senderRole: m.sender_role, createdAt: m.created_at } as any;
          copy.splice(idx, 1);
          return [row, ...copy];
        });
      })
      .subscribe();
    return () => { try { sb.removeChannel(channel); } catch {} };
  }, []);

  const renderChat = (item: ConversationRow) => (
    <Pressable
      key={item.id}
      style={[styles.chatItem, (() => {
        const me = meRef.current; if (!me) return null;
        const meRole: 'buyer' | 'vendor' = item.vendorId === me.id ? 'vendor' : 'buyer';
        const unread = !!item.lastMessage && item.lastMessage.senderRole !== meRole && !readSet.has(item.id);
        return unread ? styles.chatItemUnread : null;
      })()]}
      onPress={async () => {
        const me = meRef.current; if (!me) return;
        const role: 'buyer' | 'vendor' = item.vendorId === me.id ? 'vendor' : 'buyer';
        setReadSet((prev) => new Set([...Array.from(prev), item.id]));
        navigation.navigate('ChatDetail', { chatId: item.id, name: item.otherPartyName, role, productName: item.productName || undefined, productId: item.productId });
      }}
    >
      <View style={styles.chatLeft}>
        <View style={styles.chatAvatar}>
          {(() => {
            const p = item.otherPartyAvatar || '';
            if (p) {
              const uri = p.startsWith('http') || p.startsWith('data:') || p.startsWith('file:') ? p : `${API_BASE}${p.startsWith('/') ? p : `/${p}`}`;
              return <Image source={{ uri }} style={{ width: 44, height: 44 }} />
            }
            return <Text style={styles.chatAvatarText}>{(item.otherPartyName || 'U').charAt(0).toUpperCase()}</Text>
          })()}
        </View>
        <View style={styles.chatBody}>
          <View style={styles.chatTitleRow}>
            <Text style={styles.chatTitle} numberOfLines={1}>{item.otherPartyName}</Text>
            <Text style={styles.chatTime}>{formatWhen(item.lastMessageAt)}</Text>
          </View>
          <View style={styles.chatMetaRow}>
            {item.status ? (
              <View style={[styles.chatStatusBadge, statusStyle(item.status)]}>
                <Text style={styles.chatStatusText}>{statusLabel(item.status)}</Text>
              </View>
            ) : null}
            <Text style={[styles.chatSnippet]} numberOfLines={1}>{renderPreview(item)}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  const formatWhen = (iso?: string | null) => {
    if (!iso) return '';
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'now';
    if (diffMin < 60) return `${diffMin}m`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD}d`;
    try {
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return d.toDateString();
    }
  };

  const renderPreview = (c: ConversationRow) => {
    const me = meRef.current; if (!me) return c.lastMessage?.body || '';
    const meRole: 'buyer' | 'vendor' = c.vendorId === me.id ? 'vendor' : 'buyer';
    if (!c.lastMessage) return '';
    const prefix = c.lastMessage.senderRole === meRole ? 'You: ' : '';
    return `${prefix}${c.lastMessage.body || ''}`;
  };

  const statusLabel = (s?: string | null) => {
    if (!s) return '';
    const map: any = { unpaid: 'Not paid', paid: 'Paid', enroute: 'Enroute', delivered: 'Delivered' };
    return map[s] || s;
  };

  const statusStyle = (s?: string | null) => {
    switch (s) {
      case 'paid': return styles.statusPaid;
      case 'enroute': return styles.statusEnroute;
      case 'delivered': return styles.statusDelivered;
      default: return styles.statusUnpaid;
    }
  };

  const renderProduct = (item: Product) => {
    // Home and other tabs: tap opens Product Detail
    return (
      <Pressable style={styles.productCard} onPress={() => navigation.navigate('ProductDetail', { productId: item.id, productName: item.name })}>
        <View style={styles.productImageBox}>
          <Image
            source={{
              uri: (() => {
                const first = item.images?.[0];
                if (!first) return 'https://via.placeholder.com/300';
                // Do NOT append cache-busting to data: or file: URIs
                if (first.startsWith('data:') || first.startsWith('file:')) return first;
                if (first.startsWith('http')) return `${first}?v=${imageVersion}`;
                return `${API_BASE}${first.startsWith('/') ? first : `/${first}`}?v=${imageVersion}`;
              })(),
            }}
            style={styles.productImagePhoto}
            resizeMode="cover"
            onError={() => {
              // Fallback if URI is invalid
              try {
                // @ts-ignore
                (global as any).requestAnimationFrame?.(() => {});
              } catch {}
            }}
          />
        </View>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>NGN {item.price}</Text>
          {item.old_price ? <Text style={styles.oldPrice}>NGN {item.old_price}</Text> : null}
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
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{displayName}</Text>
            </View>
            <Pressable style={styles.notificationIcon}>
              <FontAwesome5 name="bell" size={20} color="#FFA500" />
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
            <Text style={styles.profName}>{displayName || 'User'}</Text>
            <Text style={styles.profHandle}>
              @{(String(displayName || 'user').split(/[\s@]/)[0] || '').toLowerCase()}
            </Text>
          </View>

          {/* Profile Menu */}
          <View style={{ paddingHorizontal: 16 }}>
            {[
              { key: 'Conversations', label: 'Conversations' },
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

            {/* Logout Button */}
            <Pressable
              style={[styles.profRow, { borderColor: '#FFE4E6', backgroundColor: '#FFF1F2' }]}
              onPress={async () => {
                try { await userSession.clearAll(); } catch {}
                // Navigate to Login; global guard will keep unauthenticated users on auth screens
                // @ts-ignore
                navigation.navigate('Login');
              }}
            >
              <Text style={[styles.profRowText, { color: '#B91C1C' }]}>Logout</Text>
              <Text style={{ color: '#B91C1C' }}>›</Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={homeRefreshing} onRefresh={onRefreshHome} />}
        >
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Image source={require('../../../assets/icons/search.png')} style={styles.searchIconImg} resizeMode="contain" />
              <TextInput
                style={[styles.searchPlaceholder, { fontFamily: 'Poppins_400Regular' }]}
                placeholder="Search products..."
                placeholderTextColor={colors.muted}
                value={homeSearch}
                onChangeText={setHomeSearch}
                returnKeyType="search"
                onSubmitEditing={async () => {
                  setHomeLoading(true);
                  try {
                    await loadProductsCached(activeFilter, homeSearch);
                  } finally {
                    setHomeLoading(false);
                  }
                }}
              />
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
                onPress={async () => {
                  setActiveFilter(filter);
                  await loadProductsCached(filter, homeSearch);
                }}
              >
                <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                  {filter}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Promotional Banner - replaced with image */}
          <View style={styles.promoBannerImgWrap}>
            <Image
              source={{ uri: PROMO_IMAGE_URL }}
              style={styles.promoBannerImg}
              resizeMode="cover"
              onError={(e) => {
                // Fallback to a reliable remote image if local asset fails (e.g., dev server not serving public correctly)
                try {
                  // @ts-ignore - change the source to the fallback URI on error
                  e?.currentTarget?.setNativeProps?.({ src: [{ uri: PROMO_FALLBACK_URL }] });
                } catch {}
              }}
            />
          </View>

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
  userName: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 2, fontFamily: 'Poppins_700Bold' },
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
  filterText: { fontSize: 12, color: colors.muted, fontFamily: 'Poppins_600SemiBold' },
  filterTextActive: { color: 'white', fontFamily: 'Poppins_600SemiBold' },

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
  promoBannerImgWrap: {
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  promoBannerImg: { width: '100%', height: '100%' },

  // Section Title
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12, fontFamily: 'Poppins_900Black' },

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
  productImageBox: {
    width: '100%',
    height: 120,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  productImagePhoto: { width: '100%', height: '100%' },
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
  productName: { fontSize: 12, color: colors.text, marginBottom: 4, fontFamily: 'Poppins_600SemiBold' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  price: { fontSize: 13, color: colors.accent, fontFamily: 'Poppins_700Bold' },
  oldPrice: { fontSize: 11, color: colors.muted, textDecorationLine: 'line-through', fontFamily: 'Poppins_400Regular' },
  rating: { fontSize: 11, color: '#FFA500', fontFamily: 'Poppins_400Regular' },
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
  // unread state highlighted with orange border
  chatLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chatAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  chatAvatarText: { fontSize: 22 },
  chatBody: { flex: 1 },
  chatTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chatTitle: { fontSize: 14, fontWeight: '600', color: colors.text, flex: 1, marginRight: 8 },
  chatTitleUnread: { fontWeight: '800' },
  chatTime: { fontSize: 11, color: colors.muted },
  chatMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chatSnippet: { fontSize: 12, color: colors.muted, flex: 1 },
  chatSnippetUnread: { color: colors.text, fontWeight: '600' },
  chatItemUnread: { borderColor: '#F59E0B' },
  chatStatusBadge: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  chatStatusText: { fontSize: 10, fontWeight: '700', color: 'white' },
  statusUnpaid: { backgroundColor: '#EF4444' },
  statusPaid: { backgroundColor: '#3B82F6' },
  statusEnroute: { backgroundColor: '#F59E0B' },
  statusDelivered: { backgroundColor: '#10B981' },
  
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
  profName: { marginTop: 10, fontSize: 16, color: colors.text, fontFamily: 'Poppins_700Bold' },
  profHandle: { fontSize: 12, color: colors.muted, marginTop: 2, fontFamily: 'Poppins_700Bold' },
  profRow: { backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#EFEFEF', padding: 14, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profRowText: { fontSize: 13, color: colors.text, fontFamily: 'Poppins_700Bold' },
});
