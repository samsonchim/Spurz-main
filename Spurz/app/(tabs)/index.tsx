import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const categories = [
  { id: '1', name: 'Favorites', icon: 'heart' },
  { id: '2', name: 'History', icon: 'time' },
  { id: '3', name: 'Following', icon: 'person-add' },
  { id: '4', name: 'More', icon: 'grid' },
];

const bannerData = [
  {
    id: '1',
    title: 'Fresh Fruits',
    subtitle: 'Best quality fruits available',
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: '2',
    title: 'Daily Deals',
    subtitle: 'Save up to 50% today',
    image: require('@/assets/images/react-logo.png'),
  },
];

const products = [
  {
    id: '1',
    name: 'Fresh Pears',
    brand: 'Local Farm',
    price: '$10.99',
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: '2',
    name: 'Watermelon Slices',
    brand: 'Fresh Market',
    price: '$8.99',
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: '3',
    name: 'Grilled Meat',
    brand: 'BBQ House',
    price: '$15.99',
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: '4',
    name: 'Mushrooms',
    brand: 'Organic Store',
    price: '$12.99',
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: '5',
    name: 'Radish Greens',
    brand: 'Green Farm',
    price: '$6.99',
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: '6',
    name: 'Orange Fruits',
    brand: 'Citrus Co',
    price: '$9.99',
    image: require('@/assets/images/react-logo.png'),
  },
];

const newArrivals = [
  {
    id: '1',
    name: 'Jacket',
    status: 'New Arrival!',
    price: '$75',
    originalPrice: '$90',
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: '2',
    name: 'Shirt',
    status: 'New Arrival!',
    price: '$48',
    originalPrice: '$60',
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: '3',
    name: 'Jacket',
    status: 'New Arrival!',
    price: '$65',
    originalPrice: '$80',
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: '4',
    name: 'Skirt',
    status: 'New Arrival!',
    price: '$35',
    originalPrice: '$45',
    image: require('@/assets/images/react-logo.png'),
  },
];

const trending = [
  {
    id: '1',
    name: 'Jacket',
    status: 'Trending Now!',
    price: '$45',
    originalPrice: '$65',
    image: require('@/assets/images/react-logo.png'),
  },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [currentBanner, setCurrentBanner] = useState(0);

  const renderBanner = ({ item }: any) => (
    <View style={styles.bannerSlide}>
      <Image source={item.image} style={styles.bannerImage} />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  const renderProduct = ({ item }: any) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        selectedCategory === item.id && styles.activeCategoryTab,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons 
        name={item.icon as any} 
        size={16} 
        color={selectedCategory === item.id ? '#FFA500' : '#666'} 
      />
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.activeCategoryText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderListItem = ({ item }: any) => (
    <TouchableOpacity style={styles.listItem}>
      <Image source={item.image} style={styles.listImage} />
      <View style={styles.listInfo}>
        <Text style={styles.listName}>{item.name}</Text>
        <Text style={styles.listStatus}>{item.status}</Text>
        <View style={styles.listPriceContainer}>
          <Text style={styles.listPrice}>{item.price}</Text>
          <Text style={styles.listOriginalPrice}>{item.originalPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Header */}
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* Banner Carousel */}
        <View style={styles.bannerContainer}>
          <FlatList
            data={bannerData}
            renderItem={renderBanner}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / (width - 32)
              );
              setCurrentBanner(index);
            }}
          />
          <View style={styles.bannerIndicators}>
            {bannerData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentBanner && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Products Grid */}
        <View style={styles.productsContainer}>
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
          />
        </View>

        {/* New Arrivals Section */}
        <View style={styles.listSection}>
          <Text style={styles.listSectionTitle}>New Arrivals</Text>
          <FlatList
            data={newArrivals}
            renderItem={renderListItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>

        {/* Trending Section */}
        <View style={styles.listSection}>
          <Text style={styles.listSectionTitle}>Trending</Text>
          <FlatList
            data={trending}
            renderItem={renderListItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingBottom: 80, // Space for tab bar
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoryContainer: {
    paddingVertical: 10,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeCategoryTab: {
    backgroundColor: '#fff5e6',
    borderColor: '#FFA500',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFA500',
  },
  bannerContainer: {
    paddingVertical: 20,
  },
  bannerSlide: {
    width: width - 32,
    height: 160,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e8e8e8',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: '#FFA500',
    width: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  productsContainer: {
    paddingHorizontal: 16,
  },
  productsGrid: {
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 6,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    padding: 12,
  },
  productBrand: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  listSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#f9f9f9',
    marginTop: 10,
  },
  listSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  listImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  listStatus: {
    fontSize: 12,
    color: '#FFA500',
    marginBottom: 6,
  },
  listPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginRight: 8,
  },
  listOriginalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
});
