import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Image, 
  Alert,
  Modal,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Platform,
  ToastAndroid
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../theme/colors';
import { Feather } from '@expo/vector-icons';
import { apiGet, apiPost, API_BASE } from '../../services/api';
import { userSession } from '../../services/userSession';
import LoadingSpinner from '../../components/LoadingSpinner';
import OverlayLoading from '../../components/OverlayLoading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../../components/BottomNav';
import { ImageSourcePropType } from 'react-native';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
  status?: string;
  is_active?: boolean; // derived from status
  stock_quantity?: number;
  category?: string;
  tags?: string[];
  created_at: string;
}

interface Outlet {
  id: string;
  name: string;
  category: string;
  locations?: string;
  phone?: string;
  about?: string;
  logo_path?: string;
  cover_photo_path?: string;
  face_of_brand_path?: string;
  _followersCount?: number;
  _followingCount?: number;
  outlet_likes?: number;
}

export default function Dashboard({ navigation }: any) {
  const [outlet, setOutlet] = useState<Outlet | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [imageVersion, setImageVersion] = useState<number>(Date.now());
  const [uploading, setUploading] = useState<null | ('cover'|'face'|'logo')>(null);
  const [productMenu, setProductMenu] = useState<{ id: string | null; visible: boolean; x: number; y: number }>({
    id: null,
    visible: false,
    x: 0,
    y: 0
  });

  useEffect(() => {
    loadFromCacheThenMaybeFetch();
  }, []);

  // When coming back from create/edit flows, do a targeted refresh only if flagged
  useEffect(() => {
    const unsub = navigation.addListener('focus', async () => {
      try {
        const flag = await AsyncStorage.getItem('dashboard_needs_refresh');
        if (flag) {
          const user = await userSession.getCurrentUser();
          const token = await userSession.getToken();
          if (user && token) {
            await fetchAndCache(user.id, token);
            setImageVersion(Date.now());
          }
          await AsyncStorage.removeItem('dashboard_needs_refresh');
        }
      } catch {}
    });
    return unsub;
  }, [navigation]);

  const OUTLET_CACHE_KEY = 'vendor_outlet_cache_v1';
  const PRODUCTS_CACHE_KEY = 'vendor_products_cache_v1';

  const loadFromCacheThenMaybeFetch = async () => {
    setLoading(true);
    try {
      const user = await userSession.getCurrentUser();
      const token = await userSession.getToken();
      if (!user || !token) { navigation.navigate('Login'); return; }

      // Load from cache first
      const [outletRaw, productsRaw] = await Promise.all([
        AsyncStorage.getItem(OUTLET_CACHE_KEY),
        AsyncStorage.getItem(PRODUCTS_CACHE_KEY),
      ]);
      const outletCache = outletRaw ? (JSON.parse(outletRaw) as Outlet | null) : null;
      const productsCache = productsRaw ? (JSON.parse(productsRaw) as Product[]) : [];
      if (outletCache !== null) setOutlet(outletCache);
      if (productsCache) setProducts(productsCache);

      // Fetch only if no cache yet (first-time)
      if (outletCache === null || productsCache.length === 0) {
        await fetchAndCache(user.id, token);
      }
    } catch (error) {
      console.error('Error initializing dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAndCache = async (userId: string, token: string) => {
    // Fetch outlet
    const outletResponse = await apiGet(`/outlets/my-outlet?userId=${userId}`, token);
    if (outletResponse.ok) {
      const o = (outletResponse.data as any)?.outlet || null;
      setOutlet(o);
      await AsyncStorage.setItem(OUTLET_CACHE_KEY, JSON.stringify(o));
    }
    // Fetch products
    await loadProducts(userId, token, true);
  };

  const loadProducts = async (userId: string, token: string, writeCache = false) => {
    setProductsLoading(true);
    try {
      const response = await apiGet(`/products/my-products?userId=${userId}`, token);
      if (response.ok) {
        const raw = (response.data as any)?.products || [];
        const list: Product[] = raw.map((p: any) => ({
          ...p,
          is_active: typeof p.status === 'string' ? p.status.toLowerCase() === 'active' : true,
        }));
        setProducts(list);
        if (writeCache) {
          await AsyncStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(list));
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleProductAction = (productId: string, action: 'hide' | 'delete' | 'edit') => {
    setProductMenu({ id: null, visible: false, x: 0, y: 0 });
    
    switch (action) {
      case 'hide':
        {
          const p = products.find((x) => x.id === productId);
          const active = p ? (p.is_active ?? (p.status === 'active')) : false;
          const title = active ? 'Hide Product' : 'Unhide Product';
          const message = active ? 'Are you sure you want to hide this product?' : 'Make this product visible again?';
          Alert.alert(title, message, [
          { text: 'Cancel', style: 'cancel' },
            { text: active ? 'Hide' : 'Unhide', onPress: () => hideProduct(productId) }
          ]);
        }
        break;
      case 'delete':
        Alert.alert('Delete Product', 'Are you sure you want to delete this product? This action cannot be undone.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteProduct(productId) }
        ]);
        break;
      case 'edit':
        {
          const p = products.find((x) => x.id === productId);
          navigation.navigate('EditProduct', {
            productId,
            name: p?.name,
            price: p?.price,
            description: p?.description,
            images: p?.images ?? [],
            category: (p as any)?.category,
            stockQuantity: (p as any)?.stock_quantity ?? 0,
            tags: (p as any)?.tags ?? [],
          });
    }
    break;
    }
  };
  const hideProduct = async (productId: string) => {
    try {
      if (!user || !token) return;
      const current = products.find((p) => p.id === productId);
      const nextStatus = current?.is_active ? 'hidden' : 'active';
      const res = await apiPost('/products/update', { productId, status: nextStatus }, token);
      if (res.ok) {
        const updated = products.map((p) => p.id === productId ? { ...p, status: nextStatus, is_active: nextStatus === 'active' } : p);
        setProducts(updated);
        await AsyncStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(updated));
        if (Platform.OS === 'android') {
          ToastAndroid.show(nextStatus === 'active' ? 'Product unhidden' : 'Product hidden', ToastAndroid.SHORT);
        }
      } else {
        Alert.alert('Update failed', res.error || 'Could not update product');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not update product');
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const user = await userSession.getCurrentUser();
      const token = await userSession.getToken();
      if (!user || !token) return;
      const res = await apiPost('/products/delete', { productId }, token);
      if (res.ok) {
        const updated = products.filter((p) => p.id !== productId);
        setProducts(updated);
        await AsyncStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(updated));
        if (Platform.OS === 'android') {
          ToastAndroid.show('Product deleted', ToastAndroid.SHORT);
        }
      } else {
        Alert.alert('Delete failed', res.error || 'Could not delete product');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not delete product');
    }
  };

  const getLogoUrl = (outlet: Outlet) => {
    if (outlet.logo_path) {
      // logo_path is stored like "/outlets/logos/<id>.<ext>" served from Next public folder
      const path = outlet.logo_path.startsWith('/') ? outlet.logo_path : `/${outlet.logo_path}`;
      return `${API_BASE}${path}?v=${imageVersion}`;
    }
    // Return a placeholder with the outlet name initial
    return `https://via.placeholder.com/80/4A90E2/FFFFFF?text=${outlet.name?.charAt(0)?.toUpperCase() || 'O'}`;
  };

  const getCoverUrl = (outlet: Outlet) => {
    if (outlet.cover_photo_path) {
      const p = outlet.cover_photo_path.startsWith('/') ? outlet.cover_photo_path : `/${outlet.cover_photo_path}`;
      return `${API_BASE}${p}?v=${imageVersion}`;
    }
    return undefined;
  };

  const getFaceUrl = (outlet: Outlet) => {
    if (outlet.face_of_brand_path) {
      const p = outlet.face_of_brand_path.startsWith('/') ? outlet.face_of_brand_path : `/${outlet.face_of_brand_path}`;
      return `${API_BASE}${p}?v=${imageVersion}`;
    }
    return undefined;
  };

  const showProductMenu = (productId: string, event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setProductMenu({
      id: productId,
      visible: true,
      x: pageX,
      y: pageY
    });
  };
  const renderProduct = (product: Product) => (
    <View key={product.id} style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: (() => {
            const first = product.images?.[0];
            if (!first) return 'https://via.placeholder.com/150';
            // Use as-is for absolute http(s) or data URIs
            if (first.startsWith('http') || first.startsWith('data:') || first.startsWith('file:')) return first;
            // Prefix API_BASE for relative paths like "/products/<file>.png"
            return `${API_BASE}${first.startsWith('/') ? first : `/${first}`}`;
          })() }} 
          style={styles.productImage}
          resizeMode="cover"
        />
        <Pressable 
          style={styles.menuButton}
          onPress={(e) => showProductMenu(product.id, e)}
        >
          <Feather name="more-vertical" size={20} color={colors.text} />
        </Pressable>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <View style={styles.priceStatusRow}>
          <Text style={styles.productPrice}>NGN {product.price.toLocaleString()}</Text>
          <View style={styles.productStatus}>
            <View style={[styles.statusDot, { backgroundColor: (product.is_active ?? (product.status === 'active')) ? '#4CAF50' : '#FF9800' }]} />
            <Text style={styles.statusText}>
              {(product.is_active ?? (product.status === 'active')) ? 'Active' : 'Hidden'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Header menu state
  const [headerMenuVisible, setHeaderMenuVisible] = useState(false);
  const handleHeaderMenuAction = (action: 'invoices' | 'colorTheme' | 'kyc') => {
    setHeaderMenuVisible(false);
    if (action === 'invoices') return navigation.navigate('InvoicesList');
    if (action === 'colorTheme') return navigation.navigate('Settings');
    if (action === 'kyc') return navigation.navigate('Settings');
  };

  // Image pickers for cover and face
  const pickAndUpload = async (type: 'cover' | 'face' | 'logo') => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) { Alert.alert('Permission needed', 'Allow media access to pick images.'); return; }
      const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.9, base64: true });
      if (res.canceled) return;
      const asset = res.assets?.[0]; if (!asset?.base64) return;

      const user = await userSession.getCurrentUser();
      const token = await userSession.getToken();
      if (!user || !token || !outlet) { return; }

      const endpoint = type === 'cover' ? '/outlets/upload-cover' : (type === 'face' ? '/outlets/upload-face' : '/outlets/upload-logo');
      if (uploading) return; // prevent duplicate uploads
      setUploading(type);
      const r = await apiPost(endpoint, { outletId: outlet.id, imageBase64: asset.base64 }, token);
      if (r.ok && r.data?.outlet) {
        const updated = r.data.outlet as any;
        setOutlet(updated);
        await AsyncStorage.setItem(OUTLET_CACHE_KEY, JSON.stringify(updated));
        setImageVersion(Date.now());
        const msg = type === 'cover' ? 'Cover updated' : (type === 'face' ? 'Face updated' : 'Logo updated');
        if (Platform.OS === 'android') {
          ToastAndroid.show(msg, ToastAndroid.SHORT);
        } else {
          Alert.alert('Success', msg);
        }
      } else {
        Alert.alert('Upload failed', r.error || 'Could not update image');
      }
    } catch (e) {}
    finally {
      setUploading(null);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <OverlayLoading visible={true} message="Loading dashboard..." />
      </SafeAreaView>
    );
  }

  if (!outlet) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.noOutletContainer}>
          <Pressable 
            style={styles.createOutletButton}
            onPress={() => navigation.navigate('VendorOnboarding')}
          >
            <Text style={styles.createOutletButtonText}>Create Outlet</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <OverlayLoading visible={!!uploading} message={uploading ? `Uploading ${uploading}...` : 'Uploading...'} />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.backButton} />
        <Pressable style={styles.headerMenuButton} onPress={() => setHeaderMenuVisible(true)}>
          <Feather name="more-vertical" size={24} color={colors.text} />
        </Pressable>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              try {
                setRefreshing(true);
                const user = await userSession.getCurrentUser();
                const token = await userSession.getToken();
                if (!user || !token) return;
                await fetchAndCache(user.id, token);
                setImageVersion(Date.now());
              } finally {
                setRefreshing(false);
              }
            }}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        {/* Cover Section with overlay menu and overlapping logo */}
        <View style={styles.coverContainer}>
          <Pressable onPress={() => pickAndUpload('cover')}>
            {getCoverUrl(outlet) ? (
              <Image 
                source={{ uri: getCoverUrl(outlet)! }}
                style={styles.coverImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.coverImage, styles.coverPlaceholder]}>
                <Feather name="image" size={24} color={colors.muted} />
                <Text style={styles.coverPlaceholderText}>Add cover photo</Text>
              </View>
            )}
          </Pressable>
          {/* Overlapping logo */}
          <Pressable onPress={() => pickAndUpload('logo')} style={styles.logoOverlapWrap}>
            {outlet.logo_path ? (
              <Image source={{ uri: getLogoUrl(outlet) }} style={styles.logoOverlap} resizeMode="cover" />
            ) : (
              <View style={[styles.logoOverlap, styles.logoPlaceholder]}>
                <Feather name="image" size={18} color={colors.muted} />
                <Text style={styles.logoPlaceholderText}>Add Logo</Text>
              </View>
            )}
          </Pressable>
        </View>
        <View style={styles.outletCard}>
          <View style={styles.outletHeader}>
            <View style={styles.outletInfo}>
              <Text style={styles.outletName}>{outlet.name}</Text>
              <Text style={styles.outletCategory}>{outlet.category}</Text>
              <Text style={styles.outletLocation}>📍 {outlet.locations || 'Location not set'}</Text>
              {Boolean(outlet.about) && (
                <Text style={styles.outletAbout}>{outlet.about}</Text>
              )}
            </View>
          </View>

          {/* Face of the brand */}
          <View style={styles.faceSection}>
            <Text style={styles.faceLabel}>Face of the Brand</Text>
            <Pressable onPress={() => pickAndUpload('face')} style={styles.faceImageWrap}>
              {getFaceUrl(outlet) ? (
                <Image 
                  source={{ uri: getFaceUrl(outlet)! }}
                  style={styles.faceImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.faceImage, styles.facePlaceholder]}>
                  <Feather name="image" size={18} color={colors.muted} />
                  <Text style={styles.facePlaceholderText}>Add Face</Text>
                </View>
              )}
            </Pressable>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{outlet._followersCount || 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{outlet._followingCount || 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{outlet.outlet_likes || 0}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{products.length}</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
          </View>
        </View>

        {/* Products Section */}
        <View style={styles.productsSection}>
          <View style={styles.productsHeader}>
            <Text style={styles.productsTitle}>My Products</Text>
            <Pressable 
              style={styles.addProductButton}
              onPress={() => navigation.navigate('CreateProduct')}
            >
              <Feather name="plus" size={20} color="#fff" />
              <Text style={styles.addProductButtonText}>Add Product</Text>
            </Pressable>
          </View>

          {productsLoading ? (
            <View style={styles.loadingContainer}>
              <LoadingSpinner message="Loading products..." size="small" />
            </View>
          ) : products.length === 0 ? (
            <View style={styles.noProductsContainer}>
              <Feather name="package" size={48} color="#ccc" />
              <Text style={styles.noProductsText}>No products yet</Text>
              <Text style={styles.noProductsSubtext}>Add your first product to get started</Text>
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {products.map(renderProduct)}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Mobile Bottom Navigation - include Home/Feed/Chats/Profile too */}
      <BottomNav
        items={[
          { key: 'home', label: 'Home', icon: require('../../../assets/icons/home.png') as ImageSourcePropType },
          { key: 'dashboard', label: 'Dashboard', icon: require('../../../assets/icons/dashboard.png') as ImageSourcePropType },
          { key: 'feed', label: 'Feed', icon: require('../../../assets/icons/feed.png') as ImageSourcePropType },
          { key: 'chats', label: 'Chats', icon: require('../../../assets/icons/chats.png') as ImageSourcePropType },
          { key: 'profile', label: 'Profile', icon: require('../../../assets/icons/profile.png') as ImageSourcePropType },
        ]}
        activeKey={'dashboard'}
        onChange={(k) => {
          if (k === 'dashboard') {
            navigation.navigate('VendorDashboard');
            return;
          }
          // For other tabs, route into Home screen with a target tab param
          if (k === 'home' || k === 'feed' || k === 'chats' || k === 'profile') {
            navigation.navigate('Home', { tab: k });
          }
        }}
      />

      {/* Product Menu Modal */}
      <Modal
        visible={productMenu.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setProductMenu({ id: null, visible: false, x: 0, y: 0 })}
      >
        <TouchableOpacity 
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setProductMenu({ id: null, visible: false, x: 0, y: 0 })}
        >
          <View style={[styles.menuContainer, { left: productMenu.x - 100, top: productMenu.y - 50 }]}>
            <Pressable 
              style={styles.menuItem}
              onPress={() => handleProductAction(productMenu.id!, 'edit')}
            >
              <Feather name="edit-2" size={16} color={colors.text} />
              <Text style={styles.menuItemText}>Edit</Text>
            </Pressable>
            <Pressable 
              style={styles.menuItem}
              onPress={() => handleProductAction(productMenu.id!, 'hide')}
            >
              <Feather name="eye-off" size={16} color={colors.text} />
              <Text style={styles.menuItemText}>
                {(() => {
                  const pr = products.find((p) => p.id === productMenu.id);
                  return pr?.is_active ? 'Hide' : 'Unhide';
                })()}
              </Text>
            </Pressable>
            <Pressable 
              style={[styles.menuItem, styles.deleteMenuItem]}
              onPress={() => handleProductAction(productMenu.id!, 'delete')}
            >
              <Feather name="trash-2" size={16} color="#FF5252" />
              <Text style={[styles.menuItemText, styles.deleteMenuText]}>Delete</Text>
            </Pressable>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Header Menu Modal */}
      <Modal
        visible={headerMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setHeaderMenuVisible(false)}
      >
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setHeaderMenuVisible(false)}>
          <View style={[styles.menuContainer, { position: 'absolute', top: 80, right: 16 }] }>
            <Pressable style={styles.menuItem} onPress={() => handleHeaderMenuAction('invoices')}>
              <Feather name="file-text" size={16} color={colors.text} />
              <Text style={styles.menuItemText}>Invoices</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => handleHeaderMenuAction('colorTheme')}>
              <Feather name="sun" size={16} color={colors.text} />
              <Text style={styles.menuItemText}>Color Theme</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => handleHeaderMenuAction('kyc')}>
              <Feather name="user" size={16} color={colors.text} />
              <Text style={styles.menuItemText}>KYC</Text>
            </Pressable>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1 },
  coverContainer: {
    position: 'relative',
    backgroundColor: '#eee'
  },
  coverImage: {
    width: '100%',
    height: 200
  },
  headerMenuBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 18,
    padding: 6
  },
  logoOverlapWrap: {
    position: 'absolute',
    bottom: -32,
    left: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff'
  },
  logoOverlap: {
    width: '100%',
    height: '100%'
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  backButton: { padding: 8 },
  headerSpacer: { flex: 1 },
  headerMenuButton: { padding: 8 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: colors.text,
  },

  // No Outlet
  noOutletContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  noOutletTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    color: colors.text,
    marginTop: 16,
    marginBottom: 4,
    textTransform: 'none'
  },
  noOutletText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 24,
    textTransform: 'none'
  },
  createOutletButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12
  },
  createOutletButtonText: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16
  },

  // Outlet Card
  outletCard: {
    margin: 20,
    marginTop: 36,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  outletHeader: {
    flexDirection: 'row',
    marginBottom: 20
  },
  outletInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  outletName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    color: colors.text,
    marginBottom: 4
  },
  outletCategory: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.accent,
    marginBottom: 4
  },
  outletLocation: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.muted
  },
  outletAbout: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: colors.muted,
    marginTop: 6
  },
  faceSection: {
    marginTop: 10,
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  faceLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: colors.text
  },
  faceImageWrap: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
    marginTop: 6,
    alignSelf: 'flex-start'
  },
  faceImage: {
    width: '100%',
    height: '100%'
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0'
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: colors.text,
    marginBottom: 4
  },
  statLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: colors.muted
  },

  // Products Section
  productsSection: {
    paddingHorizontal: 20,
    marginBottom: 20
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  productsTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: colors.text
  },
  addProductButton: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  addProductButtonText: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginLeft: 4
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center'
  },
  noProductsContainer: {
    alignItems: 'center',
    padding: 40
  },
  noProductsText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: colors.muted,
    marginTop: 16,
    marginBottom: 8
  },
  noProductsSubtext: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center'
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  productCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  productImageContainer: {
    position: 'relative',
    height: 120
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  menuButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 4
  },
  productInfo: {
    padding: 12
  },
  productName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    color: colors.text,
    marginBottom: 2
  },
  priceStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  productPrice: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    color: colors.accent
  },
  productStatus: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  statusText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11.5,
    color: colors.muted
  },

  // Menu Modal
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  menuItemText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.text,
    marginLeft: 12
  },
  deleteMenuItem: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0'
  },
  deleteMenuText: {
    color: '#FF5252'
  },

  // Placeholders for images
  coverPlaceholder: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  coverPlaceholderText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.muted,
  },
  logoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  logoPlaceholderText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    color: colors.muted,
    marginTop: 2,
  },
  facePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  facePlaceholderText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: colors.muted,
  }
});
