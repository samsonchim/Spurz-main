import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { apiGet, apiPost } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userSession } from '../../services/userSession';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorPopup from '../../components/ErrorPopup';

type Nav = NativeStackNavigationProp<RootStackParamList, 'CreateProduct'>;

export default function CreateProductScreen() {
  const navigation = useNavigation<Nav>();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priceStr, setPriceStr] = useState('');
  const [oldPriceStr, setOldPriceStr] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<string>('Electronics');
  // removed brand and sku fields per design
  const [tagsStr, setTagsStr] = useState('');
  const [quantity, setQuantity] = useState('');
  // color and size removed; stock quantity will be placed in their area
  const [condition, setCondition] = useState<string>('new');
  const [errVisible, setErrVisible] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const addPhoto = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) { Alert.alert('Permission needed', 'Allow media access to pick images.'); return; }

      const remaining = Math.max(0, 10 - photos.length);
      if (remaining === 0) return;

      const baseOptions: any = {
        quality: 0.9,
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      };

      let res: ImagePicker.ImagePickerResult | null = null;

      // Try multi-select first (supported on newer SDKs / iOS)
      try {
        res = await ImagePicker.launchImageLibraryAsync({
          ...baseOptions,
          allowsMultipleSelection: true,
          selectionLimit: remaining,
        } as any);
      } catch {
        // Fall back to single-select if the above options are not supported
        res = await ImagePicker.launchImageLibraryAsync(baseOptions);
      }

      if (!res || (res as any).canceled) return;

      const assets = (res as any).assets || [];
      const toAdd: string[] = [];
      for (const asset of assets) {
        if (asset?.base64) {
          const mime = 'image/jpeg';
          toAdd.push(`data:${mime};base64,${asset.base64}`);
        }
      }

      // In some single-select flows, assets may be empty; handle that too
      if (toAdd.length === 0 && (res as any).assets?.[0]?.base64) {
        toAdd.push(`data:image/jpeg;base64,${(res as any).assets[0].base64}`);
      }

      if (toAdd.length > 0) setPhotos((prev) => [...prev, ...toAdd].slice(0, 10));
    } catch (e) {
      // If anything goes wrong, attempt a final minimal single-select fallback
      try {
        const single = await ImagePicker.launchImageLibraryAsync({ quality: 0.9, base64: true });
        if (!single.canceled) {
          const asset = single.assets?.[0];
          if (asset?.base64) setPhotos((prev) => [...prev, `data:image/jpeg;base64,${asset.base64}`].slice(0, 10));
        }
      } catch {}
    }
  };

  // camera capture removed — gallery-only image picker

  const removePhoto = (uri: string) => setPhotos((prev) => prev.filter((u) => u !== uri));

  const canSave = useMemo(() => 
    title.trim().length > 0 && 
    !!Number(priceStr) && 
    (quantity === '' || Number(quantity) >= 0) &&
    (oldPriceStr === '' || Number(oldPriceStr) >= 0)
  , [title, priceStr, quantity, oldPriceStr]);

  const handleCreate = async () => {
    if (!canSave) { 
      setErrMsg('Please fill in the product title and valid price');
      setErrVisible(true);
      return; 
    }
    
    setSaving(true);
    try {
      const user = await userSession.getCurrentUser();
      const token = await userSession.getToken();
      
      if (!user || !token) {
        setErrMsg('Please log in to create products');
        setErrVisible(true);
        return;
      }

      // Get outlet ID for the user
      const outletResponse = await apiGet(`/outlets/my-outlet?userId=${user.id}`, token);
      if (!outletResponse.ok || !outletResponse.data?.outlet) {
        setErrMsg('You need to create an outlet first');
        setErrVisible(true);
        return;
      }

      const productData = {
        outletId: outletResponse.data.outlet.id,
        name: title.trim(),
        description: desc.trim(),
        price: parseFloat(priceStr),
        oldPrice: oldPriceStr ? parseFloat(oldPriceStr) : null,
        category: category,
        stockQuantity: quantity ? parseInt(quantity) : 0,
        condition: condition,
        status: 'active',
        isFeatured: false,
        tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
        images: photos
      };

      const response = await apiPost('/products/create', productData, token);
      
      if (!response.ok) {
        setErrMsg(response.error || 'Failed to create product');
        setErrVisible(true);
        return;
      }

      // flag dashboard to refresh once when user returns
      try { await AsyncStorage.setItem('dashboard_needs_refresh', '1'); } catch {}
      Alert.alert('Success', 'Product created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      setErrMsg('Network error. Please try again.');
      setErrVisible(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        behavior={Platform.select({ ios: 'padding', android: 'height' })} 
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Create Product</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Product Images */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Images</Text>
            <Text style={styles.sectionSubtitle}>Add up to 10 photos of your product</Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.photoRow}
            >
              {photos.map((uri, index) => (
                <View key={uri} style={styles.photoWrap}>
                  <Image source={{ uri }} style={styles.photo} />
                  <Pressable style={styles.photoRemove} onPress={() => removePhoto(uri)}>
                    <Feather name="x" size={16} color="white" />
                  </Pressable>
                  <Text style={styles.photoNumber}>{index + 1}</Text>
                </View>
              ))}
              
              {photos.length < 10 && (
                <Pressable style={[styles.photoWrap, styles.addWrap]} onPress={addPhoto}>
                  <Feather name="image" size={24} color={colors.accent} />
                  <Text style={styles.addText}>Gallery</Text>
                </Pressable>
              )}
            </ScrollView>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Name *</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter product name"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                value={desc}
                onChangeText={setDesc}
                placeholder="Describe your product in detail"
                placeholderTextColor="#9CA3AF"
                style={[styles.input, styles.textarea]}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Pricing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Price *</Text>
                <View style={styles.priceInputContainer}>
                  <TextInput
                    value={priceStr}
                    onChangeText={setPriceStr}
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    style={styles.priceInput}
                  />
                </View>
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Original Price</Text>
                <View style={styles.priceInputContainer}>
                  <TextInput
                    value={oldPriceStr}
                    onChangeText={setOldPriceStr}
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    style={styles.priceInput}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Category & Brand */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category & Brand</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
                {['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Toys', 'Automotive'].map((c) => (
                  <Pressable 
                    key={c} 
                    onPress={() => setCategory(c)} 
                    style={[styles.catChip, category === c && styles.catChipActive]}
                  >
                    <Text style={[styles.catChipText, category === c && styles.catChipTextActive]}>
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.row}>
              {/* Brand and SKU removed per design */}
            </View>
          </View>

          {/* Product Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            
            {/* Replace color & size row with Stock Quantity (full width) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Stock Quantity</Text>
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                style={styles.input}
              />
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Condition</Text>
                <View style={styles.conditionContainer}>
                  {['new', 'used', 'refurbished'].map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setCondition(c)}
                      style={[styles.conditionChip, condition === c && styles.conditionChipActive]}
                    >
                      <Text style={[styles.conditionText, condition === c && styles.conditionTextActive]}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Tags */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <Text style={styles.sectionSubtitle}>Add tags to help customers find your product</Text>
            
            <View style={styles.inputGroup}>
              <TextInput
                value={tagsStr}
                onChangeText={setTagsStr}
                placeholder="e.g. smartphone, apple, wireless, premium"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
              {tagsStr.trim().length > 0 && (
                <View style={styles.tagsRow}>
                  {tagsStr.split(',').map((t) => t.trim()).filter(Boolean).map((tag, index) => (
                    <View key={index} style={styles.tagChip}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Create Button */}
          <View style={styles.buttonContainer}>
            <Pressable 
              style={[styles.createButton, !canSave && styles.createButtonDisabled]} 
              disabled={!canSave || saving} 
              onPress={handleCreate}
            >
              {saving ? (
                <LoadingSpinner message="Creating Product..." size="small" />
              ) : (
                <>
                  <Feather name="plus" size={20} color="white" />
                  <Text style={styles.createButtonText}>Create Product</Text>
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>

        <ErrorPopup 
          visible={errVisible} 
          message={errMsg} 
          onDismiss={() => setErrVisible(false)} 
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#FAFAFA' 
  },
  
  // Header
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    backgroundColor: 'white',
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: { 
    padding: 8, 
    marginLeft: -8 
  },
  headerTitle: { 
    flex: 1, 
    textAlign: 'center', 
    fontSize: 18, 
    fontFamily: 'Poppins-SemiBold', 
    color: '#111827' 
  },
  headerSpacer: { 
    width: 40 
  },

  // Content
  content: { 
    padding: 20, 
    paddingBottom: 40 
  },
  
  // Sections
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },

  // Input Groups
  inputGroup: {
    marginBottom: 16,
  },
  label: { 
    fontSize: 14, 
    fontFamily: 'Poppins-Medium', 
    color: '#374151', 
    marginBottom: 8 
  },
  input: { 
    backgroundColor: '#F9FAFB', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    fontSize: 16, 
    fontFamily: 'Poppins-Regular',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textarea: { 
    minHeight: 100, 
    textAlignVertical: 'top' 
  },

  // Row Layout
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  // Price Input
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#111827',
  },

  // Photos
  photoRow: { 
    gap: 12 
  },
  photoWrap: { 
    width: 100, 
    height: 100, 
    borderRadius: 12, 
    overflow: 'hidden', 
    backgroundColor: '#F3F4F6', 
    position: 'relative', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  photo: { 
    width: '100%', 
    height: '100%' 
  },
  photoRemove: { 
    position: 'absolute', 
    top: 6, 
    right: 6, 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  photoNumber: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  addWrap: { 
    backgroundColor: '#F9FAFB', 
    borderStyle: 'dashed', 
    borderWidth: 2, 
    borderColor: '#D1D5DB' 
  },
  addText: { 
    fontSize: 12, 
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
    marginTop: 4,
  },

  // Categories
  catRow: { 
    gap: 8, 
    marginTop: 8 
  },
  catChip: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 24, 
    backgroundColor: '#F3F4F6', 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  catChipActive: { 
    backgroundColor: colors.accent, 
    borderColor: colors.accent 
  },
  catChipText: { 
    fontSize: 14, 
    fontFamily: 'Poppins-Medium',
    color: '#6B7280' 
  },
  catChipTextActive: { 
    color: 'white' 
  },

  // Condition
  conditionContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  conditionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  conditionChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  conditionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
  },
  conditionTextActive: {
    color: 'white',
  },

  // Tags
  tagsRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    marginTop: 12 
  },
  tagChip: { 
    backgroundColor: '#EEF2FF', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#C7D2FE' 
  },
  tagText: { 
    fontSize: 12, 
    fontFamily: 'Poppins-Medium',
    color: '#4338CA' 
  },

  // Button
  buttonContainer: {
    marginTop: 8,
  },
  createButton: { 
    backgroundColor: colors.accent, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 18,
    flexDirection: 'row',
    gap: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  createButtonText: { 
    color: 'white', 
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});
