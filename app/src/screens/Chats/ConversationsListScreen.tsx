import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { colors } from '../../theme/colors';
import { apiGet } from '../../services/api';
import { userSession } from '../../services/userSession';
import { getSupabase } from '../../services/realtime';

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
  status?: 'unpaid' | 'paid' | 'enroute' | 'delivered' | null;
  lastMessage?: { id: string; body: string; senderId: string; senderRole: 'buyer' | 'vendor' | 'bot'; createdAt: string } | null;
};

export default function ConversationsListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [rows, setRows] = useState<ConversationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const userIdRef = useRef<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const me = await userSession.getCurrentUser();
      if (!me) {
        navigation.navigate('Login');
        return;
      }
      userIdRef.current = me.id;
      const resp = await apiGet(`/chats/list?userId=${encodeURIComponent(me.id)}&limit=50`);
      if (resp.ok && resp.data) {
        const convs = (resp.data as any).conversations as ConversationRow[];
        setRows(convs || []);
      }
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  useEffect(() => { load(); }, [load]);

  // Realtime updates: bump previews on new messages and update order
  useEffect(() => {
    const sb = getSupabase();
    const uid = userIdRef.current;
    if (!sb) return;
    const channel = sb.channel('conversations-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload: any) => {
        const m = payload?.new; if (!m) return;
        setRows((prev) => {
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

  const onRefresh = async () => {
    setRefreshing(true);
    try { await load(); } finally { setRefreshing(false); }
  };

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

  const renderItem = ({ item }: { item: ConversationRow }) => {
    const subtitle = item.productName || item.outletName || '';
    const meId = userIdRef.current;
    const meRole: 'buyer' | 'vendor' = meId && item.vendorId === meId ? 'vendor' : 'buyer';
    const preview = item.lastMessage ? `${item.lastMessage.senderRole === meRole ? 'You: ' : ''}${item.lastMessage.body || ''}` : '';
    const statusLabel = (s?: string | null) => {
      if (!s) return null;
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
    return (
      <Pressable
        onPress={async () => {
          const me = await userSession.getCurrentUser();
          if (!me) return;
          const role: 'buyer' | 'vendor' = item.vendorId === me.id ? 'vendor' : 'buyer';
          navigation.navigate('ChatDetail', {
            chatId: item.id,
            name: item.otherPartyName || 'Chat',
            role,
            productName: item.productName || undefined,
            productId: item.productId,
          });
        }}
        style={styles.row}
      >
        <View style={styles.avatar}><Text style={styles.avatarText}>💬</Text></View>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{item.otherPartyName}</Text>
            <Text style={styles.when}>{formatWhen(item.lastMessageAt)}</Text>
          </View>
          {/* Status badge */}
          {item.status ? (
            <View style={styles.statusRow}>
              <View style={[styles.statusBadge, statusStyle(item.status)]}>
                <Text style={styles.statusText}>{statusLabel(item.status)}</Text>
              </View>
            </View>
          ) : null}
          {!!subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
          {!!preview && <Text style={styles.preview} numberOfLines={1}>{preview}</Text>}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Text style={{ fontSize: 18, color: colors.text }}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Conversations</Text>
        <View style={{ width: 40 }} />
      </View>
      <FlatList
        data={rows}
        keyExtractor={(r) => r.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!loading ? (
          <View style={styles.empty}> 
            <Text style={styles.emptyTitle}>No chats yet</Text>
            <Text style={styles.emptySub}>Start by visiting a product and tapping Buy to message the vendor.</Text>
          </View>
        ) : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 15, fontWeight: '700', color: colors.text },
  list: { padding: 16, paddingBottom: 80, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#EFEFEF', marginBottom: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 22 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 14, fontWeight: '700', color: colors.text, flex: 1, marginRight: 8 },
  when: { fontSize: 11, color: colors.muted },
  subtitle: { fontSize: 12, color: colors.muted },
  preview: { fontSize: 12, color: colors.text, marginTop: 2 },
  statusRow: { marginBottom: 4 },
  statusBadge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { fontSize: 10, fontWeight: '700', color: 'white' },
  statusUnpaid: { backgroundColor: '#EF4444' },
  statusPaid: { backgroundColor: '#3B82F6' },
  statusEnroute: { backgroundColor: '#F59E0B' },
  statusDelivered: { backgroundColor: '#10B981' },
  empty: { padding: 24, alignItems: 'center' },
  emptyTitle: { fontSize: 14, fontWeight: '800', color: colors.text, marginBottom: 6 },
  emptySub: { fontSize: 12, color: colors.muted, textAlign: 'center' },
});
