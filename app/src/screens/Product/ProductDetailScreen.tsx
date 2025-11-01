import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Image, Modal, FlatList, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import ErrorPopup from '../../components/ErrorPopup';
import { FontAwesome5 } from '@expo/vector-icons';
import { apiGet, API_BASE } from '../../services/api';

type RootStackParamList = {
  ProductDetail: { productId: string; productName: string };
};

type ProductDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
};

export default function ProductDetailScreen() {
  const navigation = useNavigation<ProductDetailNavigationProp>();
  const route = useRoute<ProductDetailRouteProp>();
  const [quantity, setQuantity] = useState(1);
  const [errVisible, setErrVisible] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any | null>(null);
  const [outlet, setOutlet] = useState<any | null>(null);
  const [images, setImages] = useState<string[]>([]);

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: '1',
      author: 'Chioma A.',
      rating: 5,
      text: 'Amazing phone! The camera quality is incredible and the display is stunning. Highly recommend!',
      date: '2 weeks ago',
      helpful: 45,
    },
    {
      id: '2',
      author: 'Okafor M.',
      rating: 4,
      text: 'Great device, very fast. Battery life could be better but overall very satisfied.',
      date: '1 week ago',
      helpful: 28,
    },
    {
      id: '3',
      author: 'Ade P.',
      rating: 5,
      text: 'Perfect! Exactly as described. Fast delivery and excellent customer service.',
      date: '3 days ago',
      helpful: 12,
    },
    {
      id: '4',
      author: 'Zainab K.',
      rating: 4,
      text: 'Very good phone. Processor is super fast, 5G connectivity works perfectly.',
      date: '1 day ago',
      helpful: 8,
    },
  ];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const id = route.params?.productId;
        if (!id) return;
        setLoading(true);
        const res = await apiGet(`/products/detail?id=${encodeURIComponent(id)}`);
        if (res.ok && mounted) {
          const data = (res.data as any) || {};
          const prod = data.product || null;
          const out = data.outlet || null;
          setProduct(prod);
          setOutlet(out);
          const imgs: string[] = Array.isArray(prod?.images) ? prod.images : [];
          const norm = imgs.map((u) => {
            if (!u) return '';
            if (u.startsWith('http') || u.startsWith('data:') || u.startsWith('file:')) return u;
            return `${API_BASE}${u.startsWith('/') ? u : `/${u}`}`;
          }).filter(Boolean) as string[];
          setImages(norm.length ? norm : ['https://via.placeholder.com/800']);
          setActiveImageIdx(0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [route.params?.productId]);

  const handleAddToCart = () => {
    const name = product?.name || route.params?.productName || 'item';
    setErrMessage(`Added ${quantity}x ${name} to cart!`);
    setErrVisible(true);
  };

  const handleBuyNow = () => {
    // TODO: Navigate to checkout
    navigation.goBack();
  };

  const renderReview = (item: Review) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View>
          <Text style={styles.reviewAuthor}>{item.author}</Text>
          <Text style={styles.reviewDate}>{item.date}</Text>
        </View>
        <Text style={styles.reviewRating}>{'★'.repeat(item.rating)}</Text>
      </View>
      <Text style={styles.reviewText}>{item.text}</Text>
      <View style={styles.reviewFooter}>
        <Pressable style={styles.helpfulBtn}>
          <Text style={styles.helpfulText}>👍 Helpful ({item.helpful})</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.topBar}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="chevron-left" size={20} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <View style={styles.headerRightGroup}>
          <Pressable style={styles.compareBtn}>
            <FontAwesome5 name="exchange-alt" size={20} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageCarousel}>
          <View style={styles.mainImage}>
            {images[activeImageIdx] ? (
              <Image source={{ uri: images[activeImageIdx] }} style={styles.mainImagePhoto} resizeMode="cover" />
            ) : null}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailContainer}
            scrollEventThrottle={16}
          >
            {images.map((u, idx) => (
              <Pressable
                key={idx}
                style={[styles.thumbnail, activeImageIdx === idx && styles.thumbnailActive]}
                onPress={() => setActiveImageIdx(idx)}
              >
                <Image source={{ uri: u }} style={styles.thumbnailImg} resizeMode="cover" />
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          {/* Outlet Name */}
          <Text style={styles.outletName}>📍 {outlet?.name || 'Outlet'}</Text>

          {/* Title & Rating */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{product?.name || route.params?.productName}</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.rating}>★★★★★ 4.5</Text>
              </View>
            </View>
          </View>

          {/* Pricing */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>NGN {product?.price ?? 0}</Text>
            {product?.old_price ? (
              <Text style={styles.oldPrice}>NGN {product.old_price}</Text>
            ) : null}
          </View>

          {/* Stock Status */}
          <View style={styles.stockRow}>
            <View style={[styles.stockIndicator, (product?.stock_quantity ?? 0) > 0 && styles.stockAvailable]} />
            <Text style={[styles.stockText, (product?.stock_quantity ?? 0) > 0 && styles.stockAvailableText]}>
              {(product?.stock_quantity ?? 0) > 0 ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>

          {/* Optional configurable options could go here */}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product?.description || 'No description provided.'}</Text>
          </View>

          {/* Quantity Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <Pressable
                style={styles.quantityBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.quantityBtnText}>−</Text>
              </Pressable>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <Pressable
                style={styles.quantityBtn}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          {/* Specs */}
          <View style={styles.specsContainer}>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Warranty</Text>
              <Text style={styles.specValue}>1 Year International</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Delivery</Text>
              <Text style={styles.specValue}>Free Shipping</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Return</Text>
              <Text style={styles.specValue}>30 Days Return</Text>
            </View>
          </View>

          {/* Reviews Button */}
          <View style={styles.section}>
            <Pressable style={styles.reviewsBtn} onPress={() => setShowReviewsModal(true)}>
              <Text style={styles.reviewsBtnText}>See Reviews</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <Pressable style={styles.addToCartBtn} onPress={handleAddToCart}>
          <View style={styles.actionBtnRow}>
            <FontAwesome5 name="shopping-cart" size={16} color={colors.text} />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </View>
        </Pressable>
        <Pressable style={styles.buyNowBtn} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </Pressable>
      </View>

      {/* Reviews Modal */}
      <Modal visible={showReviewsModal} animationType="slide" transparent onRequestClose={() => setShowReviewsModal(false)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowReviewsModal(false)}>
              <Text style={styles.modalCloseBtn}>✕</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Customer Reviews</Text>
            <View style={{ width: 30 }} />
          </View>
          <FlatList
            data={reviews}
            renderItem={({ item }) => renderReview(item)}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.reviewsList}
            scrollEventThrottle={16}
          />
        </SafeAreaView>
      </Modal>

      <ErrorPopup
        visible={errVisible}
        onDismiss={() => setErrVisible(false)}
        message={errMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 100 },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: { padding: 8, marginLeft: -8 },
  headerIcon: { width: 20, height: 20 },
  topBarTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  headerRightGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  compareBtn: { padding: 8 },
  cartBtn: { padding: 8 },
  cartIcon: { fontSize: 20 },

  // Image Carousel
  imageCarousel: { paddingHorizontal: 16, paddingVertical: 16 },
  mainImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  mainImagePhoto: { width: '100%', height: '100%' },
  badgePosition: { position: 'absolute', top: 12, right: 12 },
  badge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: 'white' },
  thumbnailContainer: { gap: 8, paddingRight: 16 },
  thumbnail: {
    width: 70,
    height: 70,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  thumbnailActive: { borderColor: colors.accent, borderWidth: 2 },
  thumbnailImg: { width: '100%', height: '100%', borderRadius: 10 },

  // Info Container
  infoContainer: { paddingHorizontal: 16 },

  // Outlet Name
  outletName: { fontSize: 12, color: colors.muted, fontWeight: '600', marginBottom: 12, marginTop: 8 },

  // Title
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  productName: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rating: { fontSize: 13, fontWeight: '600', color: colors.accent },
  reviewsLink: { fontSize: 12, color: colors.muted, textDecorationLine: 'underline' },

  // Price
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  price: { fontSize: 22, fontWeight: '800', color: colors.accent },
  oldPrice: { fontSize: 14, color: colors.muted, textDecorationLine: 'line-through' },
  discount: { fontSize: 12, fontWeight: '700', color: 'white', backgroundColor: colors.accent, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 'auto' },

  // Stock
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  stockIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF6B6B' },
  stockAvailable: { backgroundColor: '#51CF66' },
  stockText: { fontSize: 12, fontWeight: '600', color: '#FF6B6B' },
  stockAvailableText: { color: '#51CF66' },

  // Sections
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 10 },
  optionRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },

  // Color Option
  colorOption: { alignItems: 'center', gap: 6 },
  colorCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' },
  optionLabel: { fontSize: 11, fontWeight: '600', color: colors.muted },

  // Storage Option
  storageOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  storageText: { fontSize: 12, fontWeight: '600', color: colors.text },

  // Description
  descriptionText: { fontSize: 13, lineHeight: 20, color: colors.muted, fontFamily: 'Poppins_400Regular' },

  // Quantity
  quantitySelector: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, alignSelf: 'flex-start' },
  quantityBtn: { paddingHorizontal: 14, paddingVertical: 8 },
  quantityBtnText: { fontSize: 18, fontWeight: '700', color: colors.accent },
  quantityValue: { paddingHorizontal: 16, fontSize: 14, fontWeight: '600', color: colors.text },

  // Specs
  specsContainer: { backgroundColor: '#F8F8F8', borderRadius: 12, padding: 16, marginBottom: 20 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  specLabel: { fontSize: 12, color: colors.muted, fontFamily: 'Poppins_600SemiBold' },
  specValue: { fontSize: 12, fontWeight: '600', color: colors.text },

  // Action Bar
  actionBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  addToCartBtn: { flex: 1, backgroundColor: '#F0F0F0', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  addToCartText: { fontSize: 14, fontWeight: '600', color: colors.text },
  buyNowBtn: { flex: 1, backgroundColor: colors.accent, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  buyNowText: { fontSize: 14, fontWeight: '700', color: 'white' },

  // Reviews Modal
  modalSafe: { flex: 1, backgroundColor: colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalCloseBtn: { fontSize: 24, fontWeight: '700', color: colors.text },
  modalTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  reviewsList: { padding: 16 },

  // Review Item
  reviewItem: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  reviewAuthor: { fontSize: 13, fontWeight: '700', color: colors.text },
  reviewDate: { fontSize: 11, color: colors.muted, marginTop: 2 },
  reviewRating: { fontSize: 12, color: '#FFA500' },
  reviewText: { fontSize: 12, lineHeight: 18, color: colors.muted, marginBottom: 10, fontFamily: 'Poppins_400Regular' },
  reviewFooter: { flexDirection: 'row' },
  helpfulBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: '#F0F0F0' },
  helpfulText: { fontSize: 11, fontWeight: '600', color: colors.text },

  // Buttons helpers
  actionBtnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionBtnIcon: { width: 16, height: 16 },

  // Reviews CTA
  reviewsBtn: { backgroundColor: '#F0F0F0', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  reviewsBtnText: { fontSize: 14, fontWeight: '600', color: colors.text },
});
