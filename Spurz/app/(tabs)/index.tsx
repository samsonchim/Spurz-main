import { useToast } from '@/components/ToastProvider';
import { API_ENDPOINTS, getApiUrl } from '@/constants/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  image: string;
  isHot?: boolean;
  inStock: boolean;
}

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Peter England Casual',
    brand: 'Peter England',
    price: 4500,
    originalPrice: 5015,
    discount: 10,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    isHot: true,
    inStock: true,
  },
  {
    id: '2',
    name: 'Zip-Front Track Jacket',
    brand: 'Adidas',
    price: 2312,
    originalPrice: 3015,
    discount: 23,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
    inStock: true,
  },
  {
    id: '3',
    name: 'Louis Vuitton Jacket',
    brand: 'Louis Vuitton',
    price: 15530,
    originalPrice: 20012,
    discount: 22,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=300&h=300&fit=crop',
    inStock: true,
  },
  {
    id: '4',
    name: 'Zip-Front Track Jacket',
    brand: 'Nike',
    price: 25000,
    originalPrice: 30025,
    discount: 17,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    isHot: true,
    inStock: true,
  },
];

const categories = [
  'Mobiles',
  'Electronics', 
  'Fashion',
  'Furniture',
  'Grocery',
  'Appliances',
  'Toys',
  'More'
];

const filterOptions = [
  'Popular',
  'Newest',
  'Price: Low to High', 
  'Price: High to Low',
  'Rating'
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('Popular');
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState(sampleProducts);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const toast = useToast();

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await fetch(getApiUrl(API_ENDPOINTS.PRODUCTS), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const apiProducts = data.data.map((product: any) => ({
              id: product.id.toString(),
              name: product.name,
              brand: product.brand,
              price: product.price,
              originalPrice: product.originalPrice,
              discount: product.discount,
              rating: product.rating,
              image: product.image,
              isHot: product.isHot || false,
              inStock: product.inStock,
            }));
            
            setProducts(apiProducts);
          }
        }
      } catch (error) {
        console.log('Initial API load failed, using local data:', error);
        // Products are already set to sampleProducts by default
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadInitialData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    try {
      // Try to fetch from API first
      try {
        const response = await fetch(getApiUrl(API_ENDPOINTS.PRODUCTS), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Transform API data to match our Product interface
            const apiProducts = data.data.map((product: any) => ({
              id: product.id.toString(),
              name: product.name,
              brand: product.brand,
              price: product.price,
              originalPrice: product.originalPrice,
              discount: product.discount,
              rating: product.rating,
              image: product.image,
              isHot: product.isHot || false,
              inStock: product.inStock,
            }));
            
            setProducts(apiProducts);
            toast.showSuccess('Products refreshed from server!', 'Refresh Complete');
            return;
          }
        }
      } catch (apiError) {
        console.log('API fetch failed, using local data:', apiError);
      }

      // Fallback to local data with shuffle
      await new Promise(resolve => setTimeout(resolve, 1000));
      const shuffledProducts = [...sampleProducts].sort(() => Math.random() - 0.5);
      setProducts(shuffledProducts);
      toast.showSuccess('Products refreshed successfully!', 'Refresh Complete');
      
    } catch (error) {
      console.error('Refresh error:', error);
      toast.showError('Failed to refresh products. Please try again.', 'Refresh Error');
    } finally {
      setRefreshing(false);
    }
  }, [toast]);

  const Header = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <Text style={styles.appTitle}>Spurz</Text>
         </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="search-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="heart-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="bag-outline" size={24} color="#333" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const Banner = () => (
    <View style={styles.bannerContainer}>
      <View style={styles.salesBanner}>
        <Text style={styles.salesText}>Sales end in</Text>
        <View style={styles.countdown}>
          <View style={styles.timeBox}>
            <Text style={styles.timeNumber}>20</Text>
            <Text style={styles.timeLabel}>hrs</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeNumber}>33</Text>
            <Text style={styles.timeLabel}>Mins</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeNumber}>12</Text>
            <Text style={styles.timeLabel}>Secs</Text>
          </View>
        </View>
      </View>
    </View>
  );



  const MostPopularSection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Most Popular</Text>
        <TouchableOpacity onPress={() => toast.showInfo('View all products', 'Navigation')}>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.popularCard}
            onPress={() => toast.showSuccess(`${item.name} selected`, 'Product')}
          >
            <Image source={{ uri: item.image }} style={styles.popularImage} />
            <View style={styles.popularInfo}>
              <Text style={styles.popularTitle} numberOfLines={2}>{item.name}</Text>
              <View style={styles.ratingContainer}>
                {[1,2,3,4,5].map((star) => (
                  <Ionicons 
                    key={star} 
                    name="star" 
                    size={12} 
                    color={star <= item.rating ? "#FFD700" : "#E0E0E0"} 
                  />
                ))}
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.currentPrice}>${item.price.toFixed(2)}</Text>
                {item.originalPrice && (
                  <Text style={styles.originalPrice}>${item.originalPrice.toFixed(2)}</Text>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const PromoBanner = () => (
    <View style={styles.promoBannerContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled>
        <View style={styles.promoCard}>
          <Text style={styles.promoTitle}>Headphones</Text>
          <Text style={styles.promoSubtitle}>Up to 80% off</Text>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=100&fit=crop' }} 
            style={styles.promoImage} 
          />
        </View>
        <View style={styles.promoCard}>
          <Text style={styles.promoTitle}>Mobile Phones</Text>
          <Text style={styles.promoSubtitle}>From $1999</Text>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=100&fit=crop' }} 
            style={styles.promoImage} 
          />
        </View>
        <View style={styles.promoCard}>
          <Text style={styles.promoTitle}>Laptops</Text>
          <Text style={styles.promoSubtitle}>Up to 50% off</Text>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&h=100&fit=crop' }} 
            style={styles.promoImage} 
          />
        </View>
      </ScrollView>
    </View>
  );

  const CategoryTabs = () => (
    <View style={styles.categoryContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryTab,
              selectedCategory === category && styles.categoryTabActive
            ]}
            onPress={() => {
              setSelectedCategory(category);
              toast.showInfo(`${category} category selected`, 'Category');
            }}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
  const PopularItemsSection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Items</Text>
        <TouchableOpacity onPress={() => toast.showInfo('View all items', 'Navigation')}>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.popularItemsList}>
        <TouchableOpacity style={styles.popularItemCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop' }} 
            style={styles.popularItemImage} 
          />
          <View style={styles.popularItemInfo}>
            <Text style={styles.popularItemTitle}>Havells Swing Fan 400mm, Blue tone</Text>
            <Text style={styles.popularItemDiscount}>20% off</Text>
            <View style={styles.popularItemPrices}>
              <Text style={styles.popularItemPrice}>$1,299</Text>
              <Text style={styles.popularItemOriginalPrice}>$1500</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.popularItemAddBtn}>
            <Ionicons name="add" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity style={styles.popularItemCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop' }} 
            style={styles.popularItemImage} 
          />
          <View style={styles.popularItemInfo}>
            <Text style={styles.popularItemTitle}>OnePlus Nord 2T 5G 8GB RAM, 128GB Storage</Text>
            <Text style={styles.popularItemDiscount}>50% off</Text>
            <View style={styles.popularItemPrices}>
              <Text style={styles.popularItemPrice}>$999</Text>
              <Text style={styles.popularItemOriginalPrice}>$1,500</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.popularItemAddBtn}>
            <Ionicons name="add" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity style={styles.popularItemCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=80&h=80&fit=crop' }} 
            style={styles.popularItemImage} 
          />
          <View style={styles.popularItemInfo}>
            <Text style={styles.popularItemTitle}>ThinkPad L13 Yoga Gen 3 Dual core, Red tone</Text>
            <Text style={styles.popularItemDiscount}>20% off</Text>
            <View style={styles.popularItemPrices}>
              <Text style={styles.popularItemPrice}>$2299</Text>
              <Text style={styles.popularItemOriginalPrice}>$2500</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.popularItemAddBtn}>
            <Ionicons name="add" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );

  const TopSelectionSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Top Selection</Text>
      <View style={styles.topSelectionGrid}>
        <TouchableOpacity style={styles.topSelectionCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=150&h=100&fit=crop' }} 
            style={styles.topSelectionImage} 
          />
          <View style={styles.topSelectionInfo}>
            <Text style={styles.topSelectionTitle}>Wired Earphones</Text>
            <Text style={styles.topSelectionDiscount}>upto 50% off</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.topSelectionCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=100&fit=crop' }} 
            style={styles.topSelectionImage} 
          />
          <View style={styles.topSelectionInfo}>
            <Text style={styles.topSelectionTitle}>Top Mobiles</Text>
            <Text style={styles.topSelectionDiscount}>upto 50% off</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.topSelectionCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=100&fit=crop' }} 
            style={styles.topSelectionImage} 
          />
          <View style={styles.topSelectionInfo}>
            <Text style={styles.topSelectionTitle}>Headphones</Text>
            <Text style={styles.topSelectionDiscount}>upto 50% off</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.topSelectionCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&h=100&fit=crop' }} 
            style={styles.topSelectionImage} 
          />
          <View style={styles.topSelectionInfo}>
            <Text style={styles.topSelectionTitle}>Best Laptops</Text>
            <Text style={styles.topSelectionDiscount}>upto 50% off</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => {
        if (item.inStock) {
          toast.showSuccess(`${item.name} added to cart!`, 'Cart');
        } else {
          toast.showWarning(`${item.name} is out of stock`, 'Out of Stock');
        }
      }}
    >      
      <Image source={{ uri: item.image }} style={styles.productImage} />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        
        {item.name.includes('ZEALOT') && (
          <Text style={styles.topRatedText}>Top Rated in Audio & Radio</Text>
        )}
        
        <View style={styles.ratingContainer}>
          {[1,2,3,4,5].map((star) => (
            <Ionicons 
              key={star} 
              name="star" 
              size={12} 
              color={star <= item.rating ? "#FFD700" : "#E0E0E0"} 
            />
          ))}
          <Text style={styles.ratingCount}>
            {item.name.includes('ZEALOT') ? '338' : 
             item.name.includes('2pcs') ? '234' : 
             item.name.includes('Phone') ? '20' : '150'}
          </Text>
        </View>

        <Text style={styles.brandText}>Brand: {item.brand}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₦{item.price.toLocaleString()}</Text>
          <Ionicons name="flame" size={12} color="#FF6200" />
          <Text style={styles.soldText}>
            {item.name.includes('ZEALOT') ? '2.1K+sold' : 
             item.name.includes('2pcs') ? '3.3K+sold' : 
             '66 sold'}
          </Text>
        </View>

        {!item.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const BottomNotice = () => (
    <View style={styles.bottomNotice}>
      <View style={styles.spurzGuaranteeSection}>
        <Ionicons name="checkmark" size={20} color="#00C851" />
        <Text style={styles.guaranteeTitle}>SPURZ GUARANTEES YOUR PARCEL DELIVERY</Text>
        <View style={styles.guaranteeItems}>
          <Text style={styles.guaranteeItem}>• Refund for 45-day no delivery or 30-day no update</Text>
          <Text style={styles.guaranteeItem}>• Return if item damaged</Text>
          <Text style={styles.guaranteeItem}>• Credit for delay</Text>
        </View>
      </View>
      
      {isInitialLoad ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <View style={styles.refreshInstructions}>
          <TouchableOpacity 
            style={styles.noticeButton}
            onPress={() => toast.showInfo('Pull down from the top to refresh products!', 'Refresh Info')}
          >
            <Ionicons name="refresh" size={16} color="#FF6200" />
            <Text style={styles.noticeText}>Pull to refresh</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF6200']} // Android
            tintColor="#FF6200" // iOS
            title="Pull to refresh..." // iOS
            titleColor="#666666" // iOS
          />
        }
      >
        <Header />
        <Banner />
        <CategoryTabs />
        <MostPopularSection />
        <PromoBanner />
        <PopularItemsSection />
        <TopSelectionSection />
        
        <View style={styles.productsContainer}>
          <FlatList
            data={products}
            renderItem={({ item }) => <ProductCard item={item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
       
        
        <BottomNotice />
      </ScrollView>

      {/* Floating Demo Button */}
      <TouchableOpacity 
        style={styles.demoButton}
        onPress={() => {
          const actions = [
            () => {
              const toastTypes = ['success', 'error', 'info', 'warning'] as const;
              const messages = [
                'Operation completed successfully!',
                'Something went wrong. Please try again.',
                'Here\'s some helpful information.',
                'Please be careful with this action.'
              ];
              const randomIndex = Math.floor(Math.random() * 4);
              const type = toastTypes[randomIndex];
              const message = messages[randomIndex];
              toast.showToast(message, type, 'Demo Toast', 4000, 'top');
            },
            () => {
              toast.showInfo('Pull down from the top to refresh products!', 'Refresh Tip');
            },
            () => {
              onRefresh();
            }
          ];
          
          const randomAction = actions[Math.floor(Math.random() * actions.length)];
          randomAction();
        }}
      >
        <Ionicons name="notifications" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 0,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flex: 1,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  appVersion: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF6200',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  salesBanner: {
    backgroundColor: '#FF6200',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  salesText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  timeNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timeLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  topBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  topBannerText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginLeft: 8,
  },
  limitedOffer: {
    fontSize: 12,
    color: '#666',
    marginLeft: 'auto',
    marginRight: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
  },
  cameraIcon: {
    marginLeft: 10,
    padding: 4,
  },
  searchIcon: {
    marginLeft: 8,
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 6,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mainBanner: {
    backgroundColor: '#4A90E2',
    borderRadius: 15,
    padding: 20,
    minHeight: 160,
    position: 'relative',
  },
  seasonalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  megaPicksTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: -5,
  },
  viewMoreButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  viewMoreText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 12,
  },
  discountBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FFD700',
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  discountPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  discountOff: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  productImages: {
    position: 'absolute',
    bottom: -30,
    right: 20,
    flexDirection: 'row',
  },
  productImageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productCardImage: {
    width: 60,
    height: 40,
    borderRadius: 4,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  categoryContainer: {
    marginBottom: 20,
    paddingTop: 20,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTabActive: {
    backgroundColor: '#FF6200',
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  benefitsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  benefitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  benefitSubtext: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  spurzGuarantee: {
    backgroundColor: '#00C851',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  spurzGuaranteeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
  },
  privacyText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginRight: 8,
  },
  lightningDeals: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  lightningText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  limitedTimeText: {
    fontSize: 14,
    color: '#666',
  },
  productsContainer: {
    paddingHorizontal: 20,
  },
  horizontalProductsContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  horizontalProductCard: {
    width: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  horizontalProductImage: {
    width: '100%',
    height: 80,
    borderRadius: 6,
    marginBottom: 8,
  },
  horizontalProductPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6200',
    marginBottom: 4,
  },
  horizontalProductSold: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  horizontalProgressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  horizontalProgress: {
    height: '100%',
    backgroundColor: '#FF6200',
    borderRadius: 2,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productCard: {
    width: (width - 50) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 13,
    fontWeight: '400',
    color: '#333',
    marginBottom: 6,
    lineHeight: 16,
  },
  topRatedText: {
    fontSize: 11,
    color: '#FF6200',
    marginBottom: 4,
  },
  brandText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  soldText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  outOfStockText: {
    color: '#FF4444',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomNotice: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  spurzGuaranteeSection: {
    backgroundColor: '#E8F5E8',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  guaranteeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00C851',
    marginBottom: 10,
    marginLeft: 8,
  },
  guaranteeItems: {
    marginLeft: 8,
  },
  guaranteeItem: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
    lineHeight: 16,
  },
  noticeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF6200',
  },
  noticeText: {
    color: '#FF6200',
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  refreshInstructions: {
    alignItems: 'center',
  },
  demoButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6200',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Most Popular Section Styles
  popularCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  popularImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  popularInfo: {
    flex: 1,
  },
  popularTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6200',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: '#FF6200',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Section Styles
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#FF6200',
    fontWeight: '600',
  },
  
  // Promo Banner Styles
  promoBannerContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  promoCard: {
    backgroundColor: '#FF6200',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  promoImage: {
    width: 40,
    height: 40,
    marginLeft: 12,
  },
  
  // Popular Items Section Styles
  popularItemsList: {
    gap: 12,
  },
  popularItemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  popularItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  popularItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  popularItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  popularItemDiscount: {
    fontSize: 12,
    color: '#FF6200',
    marginBottom: 4,
  },
  popularItemPrices: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  popularItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  popularItemOriginalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  popularItemAddBtn: {
    backgroundColor: '#FF6200',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Top Selection Section Styles
  topSelectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  topSelectionCard: {
    width: (Dimensions.get('window').width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  topSelectionImage: {
    width: '100%',
    height: 80,
  },
  topSelectionInfo: {
    padding: 8,
  },
  topSelectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  topSelectionDiscount: {
    fontSize: 12,
    color: '#FF6200',
  },
});
