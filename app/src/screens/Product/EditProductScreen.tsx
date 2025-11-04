import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { apiPost } from '../../services/api';
import { userSession } from '../../services/userSession';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { useGlobalPopup } from '../../store/globalPopup';

type Nav = NativeStackNavigationProp<RootStackParamList, 'EditProduct'>;
type Rt = RouteProp<RootStackParamList, 'EditProduct'>;

export default function EditProductScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const popup = useGlobalPopup();
  const { productId, name, price, description, images, category: catParam, stockQuantity, tags } = route.params || ({} as any);

  const [title, setTitle] = useState(name ?? '');
  const [desc, setDesc] = useState(description ?? '');
  const [priceStr, setPriceStr] = useState(typeof price === 'number' ? String(price) : '');
  const [photos, setPhotos] = useState<string[]>(images ?? []);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<string>(catParam ?? 'Electronics');
  const [tagsStr, setTagsStr] = useState(Array.isArray(tags) ? tags.join(', ') : '');
  const [quantity, setQuantity] = useState(stockQuantity != null ? String(stockQuantity) : '');

  const addPhoto = async () => {
    try {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) { popup.info('Allow media access to pick images.', 'Permission needed'); return; }
  const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.9 });
      if (res.canceled) return;
      const uri = res.assets?.[0]?.uri; if (!uri) return;
      setPhotos((prev) => [...prev, uri]);
    } catch (e) { /* noop */ }
  };

  const addPhotoFromCamera = async () => {
    try {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) { popup.info('Allow camera access to take photos.', 'Permission needed'); return; }
      const res = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.9 });
      if (res.canceled) return;
      const uri = res.assets?.[0]?.uri; if (!uri) return;
      setPhotos((prev) => [...prev, uri]);
    } catch (e) { /* noop */ }
  };

  const removePhoto = (uri: string) => setPhotos((prev) => prev.filter((u) => u !== uri));

  const canSave = useMemo(() => title.trim().length > 0 && !!Number(priceStr) && (quantity === '' || Number(quantity) >= 0), [title, priceStr, quantity]);

  const handleSave = async () => {
  if (!canSave) { popup.info('Please fill title and enter a valid price'); return; }
  if (!productId) { popup.error('Missing product id', 'Error'); return; }
    setSaving(true);
    try {
      const user = await userSession.getCurrentUser();
      const token = await userSession.getToken();
  if (!user || !token) { popup.info('Please log in', 'Error'); return; }

      const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
      const payload: any = {
        productId,
        name: title.trim(),
        description: desc.trim(),
        price: parseFloat(priceStr),
        images: photos,
        category,
        stockQuantity: quantity ? parseInt(quantity) : 0,
        tags,
      };

      const res = await apiPost('/products/update', payload, token);
      if (!res.ok) {
        popup.error(res.error || 'Could not save changes', 'Error');
        return;
      }
      try { await AsyncStorage.setItem('dashboard_needs_refresh', '1'); } catch {}
      popup.success('Product updated successfully.', 'Saved');
      navigation.goBack();
    } catch (e) {
      popup.error('Could not save changes.', 'Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <FontAwesome5 name="chevron-left" size={18} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Product</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter product title"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        {/* Photos */}
  <Text style={styles.label}>Pictures</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoRow}>
          {photos.map((uri) => (
            <View key={uri} style={styles.photoWrap}>
              <Image source={{ uri }} style={styles.photo} />
              <Pressable style={styles.photoRemove} onPress={() => removePhoto(uri)}>
                <Text style={styles.photoRemoveTxt}>✕</Text>
              </Pressable>
            </View>
          ))}
          <Pressable style={[styles.photoWrap, styles.addWrap]} onPress={addPhoto}>
            <Text style={styles.addPlus}>＋</Text>
            <Text style={styles.addText}>Gallery</Text>
          </Pressable>
          <Pressable style={[styles.photoWrap, styles.addWrap]} onPress={addPhotoFromCamera}>
            <Text style={styles.addPlus}>📷</Text>
            <Text style={styles.addText}>Camera</Text>
          </Pressable>
        </ScrollView>

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {['Electronics','Fashion','Properties','Furniture','Books','Sports','Jewelry'].map((c) => (
            <Pressable key={c} onPress={() => setCategory(c)} style={[styles.catChip, category === c && styles.catChipActive]}>
              <Text style={[styles.catChipText, category === c && styles.catChipTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Tags */}
        <Text style={styles.label}>Tags</Text>
        <TextInput
          value={tagsStr}
          onChangeText={setTagsStr}
          placeholder="e.g. iphone, apple, smartphone"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        {tagsStr.trim().length > 0 ? (
          <View style={styles.tagsRow}>
            {tagsStr.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
              <View key={tag} style={styles.tagChip}><Text style={styles.tagText}>#{tag}</Text></View>
            ))}
          </View>
        ) : null}

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={desc}
          onChangeText={setDesc}
          placeholder="Describe your product"
          placeholderTextColor={colors.muted}
          style={[styles.input, styles.textarea]}
          multiline
        />

        {/* Price */}
        <Text style={styles.label}>Price</Text>
        <TextInput
          value={priceStr}
          onChangeText={setPriceStr}
          placeholder="0"
          placeholderTextColor={colors.muted}
          keyboardType="decimal-pad"
          style={styles.input}
        />

        {/* Quantity */}
        <Text style={styles.label}>Quantity Available</Text>
        <TextInput
          value={quantity}
          onChangeText={setQuantity}
          placeholder="0"
          placeholderTextColor={colors.muted}
          keyboardType="number-pad"
          style={styles.input}
        />

        <View style={{ height: 12 }} />
        <Pressable style={[styles.saveBtn, !canSave && { opacity: 0.5 }]} disabled={!canSave || saving} onPress={handleSave}>
          <Text style={styles.saveTxt}>{saving ? 'Saving...' : 'Save Changes'}</Text>
        </Pressable>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 15, color: colors.text, fontFamily: 'Poppins_700Bold' },
  content: { padding: 16 },
  label: { fontSize: 13, color: colors.muted, marginBottom: 6, fontFamily: 'Poppins_600SemiBold' },
  input: { backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, color: colors.text, fontFamily: 'Poppins_400Regular' },
  textarea: { minHeight: 110, textAlignVertical: 'top' },
  photoRow: { gap: 10 },
  photoWrap: { width: 96, height: 96, borderRadius: 12, overflow: 'hidden', backgroundColor: '#EFEFEF', position: 'relative', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E5E5' },
  photo: { width: '100%', height: '100%' },
  photoRemove: { position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  photoRemoveTxt: { color: 'white', fontSize: 12, lineHeight: 12 },
  addWrap: { backgroundColor: '#F9FAFB', borderStyle: 'dashed', borderWidth: 1, borderColor: '#D1D5DB' },
  addPlus: { fontSize: 20, color: colors.muted, marginBottom: 2 },
  addText: { fontSize: 12, color: colors.muted, fontFamily: 'Poppins_400Regular' },
  saveBtn: { backgroundColor: colors.accent, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  saveTxt: { color: 'white', fontFamily: 'Poppins_700Bold' },
  // Category & Tags
  catRow: { gap: 8, marginTop: 4, marginBottom: 8 },
  catChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F0F0', borderWidth: 1, borderColor: '#E5E7EB' },
  catChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  catChipText: { fontSize: 12, color: colors.muted, fontFamily: 'Poppins_600SemiBold' },
  catChipTextActive: { color: 'white' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6, marginBottom: 8 },
  tagChip: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  tagText: { fontSize: 12, color: colors.text, fontFamily: 'Poppins_600SemiBold' },
});
