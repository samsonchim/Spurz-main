/// <reference path='../../types/global.d.ts' />
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, TextInput, KeyboardAvoidingView, Platform, Image, Share, Alert } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { apiGet, apiPost, API_BASE } from '../../services/api';
import { userSession } from '../../services/userSession';
import { getSupabase } from '../../services/realtime';

 type ChatDetailNav = NativeStackNavigationProp<RootStackParamList, 'ChatDetail'>;
 type ChatDetailRoute = RouteProp<RootStackParamList, 'ChatDetail'>;

 type Message = {
   id: string;
   sender: 'buyer' | 'vendor' | 'bot';
   text?: string;
   createdAt: number;
   invoice?: Invoice;
  deleted?: boolean;
 };

 type Invoice = {
   id: string;
   product: { name: string; price: number };
   deliveryFee: number;
   deliveryAddress: string;
   expectedDelivery?: string;
   total: number;
   paid: boolean;
   escrowed: boolean;
   confirmationCode?: string;
 };

 export default function ChatDetailScreen() {
   const navigation = useNavigation<ChatDetailNav>();
   const route = useRoute<ChatDetailRoute>();
  const role = route.params?.role || 'buyer'; // default buyer
  const listRef = useRef<FlatList>(null);
  const chatId = route.params?.chatId as string | undefined;
  const productId = route.params?.productId as string | undefined;

  // Seed with a product-intent preview only in explicit buyer Buy flow
  const shouldSeed = !!route.params?.initialSend && role === 'buyer';
  const initialIntent: Message | null = shouldSeed && route.params?.initialText
    ? { id: `m-intent-${Date.now()}`, sender: role, text: route.params.initialText, createdAt: Date.now() }
    : null;

  const [messages, setMessages] = useState<Message[]>(initialIntent ? [initialIntent] : []);
  const [loading, setLoading] = useState(false);
  const sentInitial = useRef<boolean>(false);

  // Load messages and optionally send initial intent
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!chatId) return;
      setLoading(true);
      try {
        // Persist initial intent exactly once, only for buyer Buy flow
        if (shouldSeed && initialIntent && !sentInitial.current) {
          try {
            const me = await userSession.getCurrentUser();
            if (me) {
              await apiPost('/chats/messages', {
                conversationId: chatId,
                senderId: me.id,
                senderRole: role,
                body: initialIntent.text,
              });
              sentInitial.current = true;
            }
          } catch {}
        }
        const resp = await apiGet(`/chats/messages?conversationId=${encodeURIComponent(chatId)}&limit=200`);
        if (mounted && resp.ok && resp.data) {
          const rows = (resp.data as any).messages as any[];
          const mapped: Message[] = (rows || []).map((r) => ({
            id: r.id,
            sender: (r.sender_role === 'buyer' || r.sender_role === 'vendor' || r.sender_role === 'bot') ? r.sender_role : 'buyer',
            text: r.body || '',
            createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
            deleted: !!r.deleted,
          }));
          setMessages(mapped);
          requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: false }));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [chatId]);

  // Load product summary if productId provided
  useEffect(() => {
    let active = true;
    (async () => {
      if (!productId) return;
      const res = await apiGet(`/products/detail?id=${encodeURIComponent(productId)}`);
      if (!active || !res.ok || !res.data) return;
      const p = (res.data as any)?.product;
      if (!p) return;
      const img: string | undefined = Array.isArray(p.images) && p.images[0]
        ? (p.images[0].startsWith('http') || p.images[0].startsWith('data:') || p.images[0].startsWith('file:')
            ? p.images[0]
            : `${API_BASE}${p.images[0].startsWith('/') ? p.images[0] : `/${p.images[0]}`}`)
        : undefined;
      setProdCard({ id: p.id, name: p.name, price: p.price, image: img });
    })();
    return () => { active = false; };
  }, [productId]);

  // Realtime: listen for new messages
  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !chatId) return;
    const channel = sb.channel(`conv-${chatId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${chatId}` }, (payload: any) => {
        const m = payload?.new;
        if (!m) return;
        setMessages((prev) => {
          if (prev.find((x) => x.id === m.id)) return prev;
          return [...prev, {
            id: m.id,
            sender: (m.sender_role === 'buyer' || m.sender_role === 'vendor' || m.sender_role === 'bot') ? m.sender_role : 'buyer',
            text: m.body || '',
            createdAt: m.created_at ? new Date(m.created_at).getTime() : Date.now(),
            deleted: !!m.deleted,
          }];
        });
        requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
      })
      .subscribe();
    return () => { try { sb.removeChannel(channel); } catch {} };
  }, [chatId]);

  const [composer, setComposer] = useState('');
  const [prodCard, setProdCard] = useState<{ id: string; name: string; price?: number; image?: string } | null>(null);
  const [invExpectedDate, setInvExpectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invProduct, setInvProduct] = useState('iPhone 12 Pro');
  const [invPrice, setInvPrice] = useState('999');
   const [invDeliveryFee, setInvDeliveryFee] = useState('20');
   const [invAddress, setInvAddress] = useState('');
  const [composerHeight, setComposerHeight] = useState(0);
  const invoiceRefs = useRef<Record<string, View | null>>({});
  const messageRefs = useRef<Record<string, View | null>>({});
  const [menu, setMenu] = useState<{ id: string | null; x: number; y: number; visible: boolean }>({ id: null, x: 0, y: 0, visible: false });

  const invTotal = useMemo(() => {
    const p = parseFloat(invPrice || '0');
    const d = parseFloat(invDeliveryFee || '0');
    return isNaN(p + d) ? 0 : p + d;
  }, [invPrice, invDeliveryFee]);

   const sendText = async () => {
     const trimmed = composer.trim();
     if (!trimmed || !chatId) return;
     setComposer('');
     try {
       const me = await userSession.getCurrentUser();
       if (!me) return;
       // Optimistic update
       const tempId = `m-${Date.now()}`;
       setMessages((prev) => [...prev, { id: tempId, sender: role, text: trimmed, createdAt: Date.now() }]);
       requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
       const resp = await apiPost('/chats/messages', {
         conversationId: chatId,
         senderId: me.id,
         senderRole: role,
         body: trimmed,
       });
       if (!resp.ok) {
         // Revert optimistic message on failure
         setMessages((prev) => prev.filter((m) => m.id !== tempId));
       }
     } catch {}
   };

   const sendInvoice = async () => {
    if (role !== 'vendor' || !chatId) return;
    const priceNum = parseFloat(invPrice || '0');
    const delivNum = parseFloat(invDeliveryFee || '0');
    const me = await userSession.getCurrentUser(); if (!me) return;
    // Persist invoice via API
    const resp = await apiPost('/chats/invoices', {
      conversationId: chatId,
      createdBy: me.id,
      productId: productId || null,
      amount: isNaN(priceNum) ? 0 : priceNum,
      deliveryFee: isNaN(delivNum) ? 0 : delivNum,
      deliveryAddress: invAddress.trim() || 'N/A',
      expectedDelivery: invExpectedDate ? invExpectedDate.toISOString() : null,
    });
    const newId = (resp.ok && (resp.data as any)?.invoiceId) ? (resp.data as any).invoiceId : `inv-${Date.now()}`;
    const invoice: Invoice = {
      id: newId,
      product: { name: invProduct.trim() || 'Product', price: isNaN(priceNum) ? 0 : priceNum },
      deliveryFee: isNaN(delivNum) ? 0 : delivNum,
      deliveryAddress: invAddress.trim() || 'N/A',
      expectedDelivery: invExpectedDate ? invExpectedDate.toISOString() : undefined,
      total: isNaN(priceNum + delivNum) ? 0 : priceNum + delivNum,
      paid: false,
      escrowed: false,
    };
    const newMsg: Message = { id: `m-${Date.now()}-inv`, sender: 'vendor', createdAt: Date.now(), invoice };
    setMessages((prev) => [...prev, newMsg]);
    setShowInvoiceForm(false);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

   const handlePayInvoice = async (invoiceId: string) => {
     // Persist paid status
     await fetch(`${API_BASE}/api/chats/invoices`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ invoiceId, status: 'paid' }) }).catch(() => {});
     setMessages((prev) => prev.map((m) => {
       if (m.invoice?.id === invoiceId && m.invoice) {
         const confirmationCode = `SPZ-${Math.floor(100000 + Math.random()*900000)}`;
         return {
           ...m,
           invoice: { ...m.invoice, paid: true, escrowed: true, confirmationCode },
         };
       }
       return m;
     }));

     // Add bot message acknowledging escrow & reminders
     setMessages((prev) => [
       ...prev,
       {
         id: `m-${Date.now()}-bot1`,
         sender: 'bot',
         createdAt: Date.now(),
         text: 'Payment received. Funds are now held in escrow. A confirmation link will be sent every 3 hours. Your confirmation code is displayed on the invoice.',
       }
     ]);
   };

   const handleConfirmDelivery = async (invoiceId: string) => {
     await fetch(`${API_BASE}/api/chats/invoices`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ invoiceId, status: 'delivered' }) }).catch(() => {});
     // Post bot message about releasing funds and review link
     setMessages((prev) => [
       ...prev,
       {
         id: `m-${Date.now()}-bot2`,
         sender: 'bot',
         createdAt: Date.now(),
         text: 'Delivery confirmed ✅ Funds released to the vendor. Please leave a review: https://spurz.example/review/123',
       }
     ]);
   };

   const handleNotReceived = (invoiceId: string) => {
     setMessages((prev) => [
       ...prev,
       {
         id: `m-${Date.now()}-bot3`,
         sender: 'bot',
         createdAt: Date.now(),
         text: 'Marked as not received. Our support team will reach out and the funds remain on hold in escrow.',
       }
     ]);
   };

   const handleDeleteInvoice = (invoiceId: string) => {
     if (role !== 'vendor') return;
     setMessages((prev) => prev.map((m) => {
       if (m.invoice?.id === invoiceId) {
         if (m.invoice.paid) {
           Alert.alert('Cannot delete', 'Paid invoices cannot be deleted.');
           return m;
         }
         return { ...m, invoice: undefined, text: undefined, deleted: true };
       }
       return m;
     }));
   };

   // Save-to-gallery removed per requirements (only Delete/Download needed)

   const handleDownloadInvoice = async (invoice: Invoice) => {
     try {
       const viewRef = invoiceRefs.current[invoice.id];
       if (viewRef) {
         const uri = await captureRef(viewRef, { format: 'png', quality: 1 });
         if (await Sharing.isAvailableAsync()) {
           await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: `Invoice ${invoice.id}` });
           return;
         }
         // Fallback to RN Share with file url
         await Share.share({ url: uri, title: `Invoice ${invoice.id}`, message: `Invoice ${invoice.id}` });
         return;
       }
       // Fallback to text if ref missing
       const lines = [
         `Invoice #${invoice.id}`,
         `Product: ${invoice.product.name}`,
         `Price: NGN ${invoice.product.price}`,
         `Delivery Fee: NGN ${invoice.deliveryFee}`,
         `Delivery Address: ${invoice.deliveryAddress}`,
         `Total: NGN ${invoice.total}`,
         `Status: ${invoice.paid ? 'Paid (Escrowed)' : 'Unpaid'}`,
         invoice.confirmationCode ? `Confirmation Code: ${invoice.confirmationCode}` : undefined,
       ].filter(Boolean).join('\n');
       await Share.share({ message: lines, title: `Invoice ${invoice.id}` });
     } catch (e) {
       Alert.alert('Unable to share invoice');
     }
   };

  const formatDate = (iso?: string) => {
    if (!iso) return 'N/A';
    const d = new Date(iso);
    try {
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return d.toDateString();
    }
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const chosen = new Date(date);
    chosen.setHours(0,0,0,0);
    return chosen.getTime() < today.getTime();
  };

  const renderInvoice = (invoice: Invoice) => (
     <View ref={(r) => { invoiceRefs.current[invoice.id] = r; }} style={styles.invoiceCard}>
       <View style={styles.invoiceHeader}>
         <Text style={styles.invoiceTitle}>Invoice</Text>
         <Text style={[styles.invoiceBadge, invoice.paid ? styles.badgePaid : styles.badgeUnpaid]}>
           {invoice.paid ? 'Paid (Escrowed)' : 'Unpaid'}
         </Text>
       </View>
       <View style={styles.invoiceRow}><Text style={styles.invoiceLabel}>Product</Text><Text style={styles.invoiceValue}>{invoice.product.name}</Text></View>
       <View style={styles.invoiceRow}><Text style={styles.invoiceLabel}>Price</Text><Text style={styles.invoiceValue}>NGN {invoice.product.price}</Text></View>
  <View style={styles.invoiceRow}><Text style={styles.invoiceLabel}>Delivery Fee</Text><Text style={styles.invoiceValue}>NGN {invoice.deliveryFee}</Text></View>
  <View style={styles.invoiceRow}><Text style={styles.invoiceLabel}>Delivery Address</Text><Text style={[styles.invoiceValue, { flexShrink: 1, textAlign: 'right' }]}>{invoice.deliveryAddress}</Text></View>
      <View style={styles.invoiceRow}><Text style={styles.invoiceLabel}>Expected Delivery</Text><Text style={styles.invoiceValue}>{formatDate(invoice.expectedDelivery)}</Text></View>
       <View style={styles.invoiceDivider} />
       <View style={styles.invoiceRow}><Text style={[styles.invoiceLabel, { fontWeight: '800' }]}>Total</Text><Text style={[styles.invoiceValue, { fontWeight: '800' }]}>NGN {invoice.total}</Text></View>
       {invoice.paid && invoice.confirmationCode && (
         <View style={[styles.invoiceRow, { marginTop: 6 }]}>
           <Text style={styles.invoiceLabel}>Confirmation Code</Text>
           <Text style={styles.invoiceCode}>{invoice.confirmationCode}</Text>
         </View>
       )}

      {/* Buyer actions */}
      {role === 'buyer' && !invoice.paid ? (
        <Pressable style={styles.payBtn} onPress={() => handlePayInvoice(invoice.id)}>
          <FontAwesome5 name="lock" size={12} color={'white'} />
          <Text style={styles.payBtnText}>Pay now (escrow)</Text>
        </Pressable>
      ) : null}
      {role === 'buyer' && invoice.paid ? (
        <View style={styles.postPayActions}>
          <Pressable style={[styles.confirmBtn, { backgroundColor: '#10B981' }]} onPress={() => handleConfirmDelivery(invoice.id)}>
            <FontAwesome5 name="check" size={12} color={'white'} />
            <Text style={styles.confirmBtnText}>Confirm delivered</Text>
          </Pressable>
          <Pressable style={[styles.confirmBtn, { backgroundColor: '#EF4444' }]} onPress={() => handleNotReceived(invoice.id)}>
            <FontAwesome5 name="times" size={12} color={'white'} />
            <Text style={styles.confirmBtnText}>Not received</Text>
          </Pressable>
        </View>
      ) : null}

      {/* Vendor actions */}
      {role === 'vendor' ? (
        <View style={styles.postPayActions}>
          <Pressable style={[styles.confirmBtn, { backgroundColor: '#EF4444' }]} onPress={() => handleDeleteInvoice(invoice.id)}>
            <FontAwesome5 name="trash" size={12} color={'white'} />
            <Text style={styles.confirmBtnText}>Delete</Text>
          </Pressable>
          <Pressable style={[styles.confirmBtn, { backgroundColor: '#6366F1' }]} onPress={() => handleDownloadInvoice(invoice)}>
            <FontAwesome5 name="download" size={12} color={'white'} />
            <Text style={styles.confirmBtnText}>Download</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.postPayActions}>
          <Pressable style={[styles.confirmBtn, { backgroundColor: '#6366F1' }]} onPress={() => handleDownloadInvoice(invoice)}>
            <FontAwesome5 name="download" size={12} color={'white'} />
            <Text style={styles.confirmBtnText}>Download</Text>
          </Pressable>
        </View>
      )}
     </View>
   );

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.sender === role;
    const onLongPress = () => {
      if (!isMe || item.deleted) return;
      if (item.invoice) {
        if (role !== 'vendor') return;
        if (item.invoice.paid) {
          Alert.alert('Cannot delete', 'Paid invoices cannot be deleted.');
          return;
        }
      }
      const ref = messageRefs.current[item.id];
      if (!ref) return;
      ref.measureInWindow((x, y, w, h) => {
        const left = isMe ? x + w - 120 : x;
        setMenu({ id: item.id, x: left, y: Math.max(8, y - 8), visible: true });
      });
    };
    return (
      <Pressable ref={(r) => { messageRefs.current[item.id] = r; }} style={[styles.bubbleRow, isMe ? styles.rowRight : styles.rowLeft]} onLongPress={onLongPress} delayLongPress={300}>
         {!isMe && (
           <View style={styles.avatarCircle}>
             {item.sender === 'vendor' ? <Text style={styles.avatarEmoji}>🏪</Text> : item.sender === 'bot' ? <Text style={styles.avatarEmoji}>🤖</Text> : <Text style={styles.avatarEmoji}>🧑</Text>}
           </View>
         )}
         <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          {item.deleted ? (
            <Text style={styles.deletedText}>This message has been deleted</Text>
          ) : (
            <>
              {item.text ? <Text style={styles.bubbleText}>{item.text}</Text> : null}
              {item.invoice ? renderInvoice(item.invoice) : null}
            </>
          )}
         </View>
       </Pressable>
     );
   };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Product reference card appears as first message (only seeded flow) */}
      {/* Small context menu overlay near message */}
      {menu.visible ? (
        <Pressable style={styles.menuOverlay} onPress={() => setMenu({ id: null, x: 0, y: 0, visible: false })}>
          <View style={[styles.contextMenu, { top: menu.y, left: menu.x }]}>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                const id = menu.id; if (!id) return;
                setMenu({ id: null, x: 0, y: 0, visible: false });
                setMessages((prev) => prev.map((m) => {
                  if (m.id !== id) return m;
                  if (m.invoice) {
                    return { ...m, invoice: undefined, text: undefined, deleted: true };
                  }
                  return { ...m, text: undefined, deleted: true };
                }));
              }}
            >
              <Text style={styles.menuItemText}>Delete</Text>
            </Pressable>
          </View>
        </Pressable>
      ) : null}
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <FontAwesome5 name="chevron-left" size={18} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{route.params?.name || 'Chat'}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content + Composer inside KAV for WhatsApp-like behavior */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: 'height' })} keyboardVerticalOffset={80}>
        {/* Messages */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, { paddingBottom: composerHeight + 8 }]}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
          ListHeaderComponent={(
            <>
              {shouldSeed && prodCard ? (
                <View style={[styles.bubbleRow, styles.rowLeft]}>
                  <View style={styles.avatarCircle}><Text style={styles.avatarEmoji}>🏪</Text></View>
                  <View style={[styles.bubble, styles.bubbleOther]}>
                    <View style={styles.productSummary}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        {prodCard.image ? (
                          <Image source={{ uri: prodCard.image }} style={styles.productThumb} resizeMode="cover" />
                        ) : (
                          <View style={[styles.productThumb, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5' }]}><Text>🛍️</Text></View>
                        )}
                        <View style={{ flex: 1 }}>
                          <Text style={styles.prodName} numberOfLines={1}>{prodCard.name}</Text>
                          {typeof prodCard.price === 'number' ? <Text style={styles.prodPrice}>NGN {prodCard.price}</Text> : null}
                        </View>
                        <Pressable style={styles.viewBtn} onPress={() => navigation.navigate('ProductDetail', { productId: prodCard.id, productName: prodCard.name })}>
                          <Text style={styles.viewBtnText}>View product</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              ) : null}
              {role === 'vendor' && showInvoiceForm ? (
                <View style={styles.invoiceComposer}>
                <Text style={styles.invTitle}>Create Invoice</Text>
                <View style={styles.invFieldRow}>
                  <Text style={styles.invLabel}>Product</Text>
                  <TextInput
                    style={styles.invInput}
                    placeholder="Product name"
                    placeholderTextColor={colors.muted}
                    value={invProduct}
                    onChangeText={setInvProduct}
                  />
                </View>
                <View style={styles.invFieldRow}>
                  <Text style={styles.invLabel}>Price</Text>
                  <TextInput
                    style={styles.invInput}
                    placeholder="0"
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.muted}
                    value={invPrice}
                    onChangeText={setInvPrice}
                  />
                </View>
                <View style={styles.invFieldRow}>
                  <Text style={styles.invLabel}>Delivery Fee</Text>
                  <TextInput
                    style={styles.invInput}
                    placeholder="0"
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.muted}
                    value={invDeliveryFee}
                    onChangeText={setInvDeliveryFee}
                  />
                </View>
                <View style={styles.invFieldRow}>
                  <Text style={styles.invLabel}>Expected Delivery Date</Text>
                  <Pressable style={styles.invInput} onPress={() => setShowDatePicker(true)}>
                    <Text style={{ color: invExpectedDate ? colors.text : colors.muted }}>
                      {invExpectedDate ? invExpectedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Select date'}
                    </Text>
                  </Pressable>
                  {showDatePicker && Platform.OS !== 'web' ? (() => {
                    const Picker = require('@react-native-community/datetimepicker').default;
                    return (
                      <Picker
                        value={invExpectedDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={(event: any, date?: Date) => {
                          if (Platform.OS !== 'ios') setShowDatePicker(false);
                          if (!date) return;
                          if (isPastDate(date)) {
                            Alert.alert('Wow You cant go back in time in our world, the date is bbehind');
                            return;
                          }
                          setInvExpectedDate(date);
                          if (Platform.OS === 'ios') setShowDatePicker(false);
                        }}
                      />
                    );
                  })() : null}
                </View>
                <View style={styles.invFieldRow}>
                  <Text style={styles.invLabel}>Buyer Delivery Address</Text>
                  <TextInput
                    style={styles.invInput}
                    placeholder="Street, City, State"
                    placeholderTextColor={colors.muted}
                    value={invAddress}
                    onChangeText={setInvAddress}
                    multiline
                  />
                </View>
                <View style={styles.invTotalRow}>
                  <Text style={styles.invTotalLabel}>Total</Text>
                  <Text style={styles.invTotalValue}>NGN {invTotal}</Text>
                </View>
                <View style={styles.invActions}>
                  <Pressable style={[styles.invBtn, styles.invCancel]} onPress={() => setShowInvoiceForm(false)}>
                    <Text style={styles.invBtnText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={[styles.invBtn, styles.invSend]} onPress={sendInvoice}>
                    <FontAwesome5 name="file-invoice-dollar" color={'white'} size={12} />
                    <Text style={[styles.invBtnText, { color: 'white' }]}>Send Invoice</Text>
                  </Pressable>
                </View>
                </View>
              ) : null}
            </>
          )}
        />

        {/* Composer */}
        <View style={styles.composerBar} onLayout={(e) => setComposerHeight(e.nativeEvent.layout.height)}>
          {role === 'vendor' && (
            <Pressable style={styles.iconBtn} onPress={() => setShowInvoiceForm((s) => !s)}>
              <FontAwesome5 name="file-invoice-dollar" size={16} color={colors.accent} />
            </Pressable>
          )}
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            placeholderTextColor={colors.muted}
            value={composer}
            onChangeText={setComposer}
          />
          <Pressable style={styles.sendBtn} onPress={sendText}>
            <FontAwesome5 name="paper-plane" color={'white'} size={14} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
     </SafeAreaView>
   );
 }

 const styles = StyleSheet.create({
   safe: { flex: 1, backgroundColor: colors.background },
  productSummary: { marginHorizontal: 12, marginTop: 12, backgroundColor: 'white', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#EFEFEF' },
  productThumb: { width: 44, height: 44, borderRadius: 8 },
  prodName: { fontSize: 13, color: colors.text, fontWeight: '700' },
  prodPrice: { fontSize: 12, color: colors.accent, fontWeight: '700' },
  viewBtn: { backgroundColor: '#F0F0F0', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
  viewBtnText: { fontSize: 12, fontWeight: '700', color: colors.text },
   header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
   headerTitle: { flex: 1, textAlign: 'center', fontSize: 15, fontWeight: '700', color: colors.text },

   listContent: { padding: 16, paddingBottom: 100 },
  invoiceComposer: { backgroundColor: 'white', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#EFEFEF', margin: 16 },
  invTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 8 },
  invFieldRow: { marginBottom: 8 },
  invLabel: { fontSize: 12, color: colors.muted, marginBottom: 4 },
  invInput: { backgroundColor: '#F5F5F5', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.text },
  invTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  invTotalLabel: { fontSize: 12, color: colors.muted },
  invTotalValue: { fontSize: 14, fontWeight: '800', color: colors.text },
  invActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 10 },
  invBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 10 },
  invCancel: { backgroundColor: '#F1F1F1' },
  invSend: { backgroundColor: colors.accent },
  invBtnText: { fontWeight: '700', color: colors.text },
   bubbleRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-end' },
   rowLeft: { justifyContent: 'flex-start' },
   rowRight: { justifyContent: 'flex-end' },
   avatarCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
   avatarEmoji: { fontSize: 16 },
   bubble: { maxWidth: '78%', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12 },
   bubbleMe: { backgroundColor: '#F0F7FF', borderTopRightRadius: 4, borderWidth: 1, borderColor: '#E3F2FF' },
   bubbleOther: { backgroundColor: '#F8F8F8', borderTopLeftRadius: 4, borderWidth: 1, borderColor: '#EFEFEF' },
   bubbleText: { fontSize: 13, color: colors.text },

   // Invoice
   invoiceCard: { backgroundColor: 'white', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#EFEFEF', marginTop: 6 },
   invoiceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
   invoiceTitle: { fontSize: 13, fontWeight: '700', color: colors.text },
   invoiceBadge: { fontSize: 10, color: 'white', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
   badgeUnpaid: { backgroundColor: '#F87171' },
   badgePaid: { backgroundColor: '#3B82F6' },
   invoiceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
   invoiceLabel: { fontSize: 12, color: colors.muted },
   invoiceValue: { fontSize: 12, color: colors.text, fontWeight: '600' },
   invoiceDivider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 6 },
   invoiceCode: { fontSize: 12, fontWeight: '800', color: colors.text },

   payBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.accent, paddingVertical: 10, borderRadius: 10, justifyContent: 'center', marginTop: 8 },
   payBtnText: { color: 'white', fontWeight: '700', fontSize: 13 },
   postPayActions: { flexDirection: 'row', gap: 8, marginTop: 8 },
   confirmBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 10 },
   confirmBtnText: { color: 'white', fontWeight: '700', fontSize: 12 },

   // Composer
   composerBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, gap: 8, borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: colors.background },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
   input: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.text },
   sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  // Deleted message and context menu
  deletedText: { fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' },
  menuOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20 },
  contextMenu: { position: 'absolute', width: 120, backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, elevation: 6 },
  menuItem: { paddingVertical: 8, paddingHorizontal: 12 },
  menuItemText: { fontSize: 13, fontWeight: '600', color: '#EF4444' },
 });
