import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TextInput, Pressable, Image, KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Alert, ScrollView, Linking, Platform } from 'react-native';
import { apiPost } from '../../services/api';
import { colors } from '../../theme/colors';

export default function VendorOnboardingScreen({ navigation, route }: any) {
  const [outletName, setOutletName] = useState('');
  const [locations, setLocations] = useState('');
  const [category, setCategory] = useState<string>('Electronics');
  const [phone, setPhone] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [logoType, setLogoType] = useState<string | null>(null);
  const [about, setAbout] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pickImage = async () => {
    try {
      // Request media library permission (iOS/Android)
      const libPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const libStatus = libPerm.status;

      // On some platforms/types, 'limited' may not exist on PermissionStatus union; only check not granted
      if (libStatus !== 'granted') {
        Alert.alert('Permission required', 'Permission to access photos is required to add a logo.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]);
        return;
      }

      // Try opening library
      let res: any = null;
      try {
  res = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, base64: true });
      } catch (e) {
        console.warn('launchImageLibraryAsync failed', e);
      }

      // If library failed or user cancelled without selecting, try camera as a fallback on devices
      if ((!res || res.canceled) && Platform.OS !== 'web') {
        const camPerm = await ImagePicker.requestCameraPermissionsAsync();
        if (camPerm.status === 'granted') {
          try {
            res = await ImagePicker.launchCameraAsync({ quality: 0.7, base64: true });
          } catch (e) {
            console.warn('launchCameraAsync failed', e);
          }
        }
      }

      if (res && !res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const uri = asset?.uri ?? null;
        setLogo(uri);
        if (asset?.base64) setLogoBase64(asset.base64 as string);
        // try to extract mime type from uri extension
        const match = uri?.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
        const ext = match?.[1]?.toLowerCase();
        if (ext) {
          const map: any = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
          setLogoType(map[ext] || `image/${ext}`);
        }
      } else if (!res) {
        Alert.alert('Error', 'Could not open image picker.');
      }
    } catch (err) {
      console.warn('pickImage error', err);
      Alert.alert('Error', 'Could not open image picker.');
    }
  };

  const submit = async () => {
    const payload = {
      name: outletName,
      locations,
      category,
      phone,
      about,
      userId: route?.params?.userId,
      logoBase64,
      logoType,
    };
    const res = await apiPost('/outlets/create', payload);
    if (res.ok) {
      navigation.navigate('VendorDashboard');
    } else {
      // TODO: show error to user
      console.warn('Failed to create outlet', res.error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Outlet Setup</Text>
          <Text style={styles.sub}>You can skip — you’ll be a buyer for now.</Text>

        <Pressable style={styles.logoWrap} onPress={pickImage}>
          {logo ? (
            <Image source={{ uri: logo }} style={styles.logoImg} />
          ) : (
            <Text style={{ color: colors.muted }}>Add Logo</Text>
          )}
        </Pressable>

        <Text style={styles.label}>Outlet Name</Text>
        <TextInput style={styles.input} value={outletName} onChangeText={setOutletName} placeholder="e.g. TechHub" placeholderTextColor="#A0A0A0" />

        <Text style={[styles.label, { fontFamily: 'Poppins_700Bold' }]}>Delivery Locations</Text>
        <TextInput
          style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
          value={locations}
          onChangeText={setLocations}
          multiline
          placeholder="Type locations (comma-separated)"
          placeholderTextColor="#A0A0A0"
        />

        <Text style={[styles.label, { fontFamily: 'Poppins_700Bold' }]}>A little about the outlet</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          value={about}
          onChangeText={setAbout}
          multiline
          placeholder="Tell customers about your outlet"
          placeholderTextColor="#A0A0A0"
        />

        <Text style={[styles.label, { fontFamily: 'Poppins_700Bold' }]}>Outlet Category</Text>
        <Pressable style={styles.dropdown} onPress={() => setDropdownOpen((s) => !s)}>
          <Text style={styles.dropdownText}>{category}</Text>
        </Pressable>
        {dropdownOpen && (
          <View style={styles.dropdownListWrapper}>
            <ScrollView style={styles.dropdownList} nestedScrollEnabled>
              {['Electronics', 'Fashion', 'Home', 'Books', 'Sports', 'Beauty', 'Toys', 'Groceries', 'Automotive', 'Garden', 'Music', 'Health'].map((c) => (
                <Pressable key={c} style={styles.dropdownItem} onPress={() => { setCategory(c); setDropdownOpen(false); }}>
                  <Text style={styles.dropdownItemText}>{c}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="e.g. +234..." placeholderTextColor="#A0A0A0" />

        <View style={{ height: 16 }} />
        <Pressable style={styles.primaryBtn} onPress={submit}>
          <Text style={styles.primaryText}>Save & Continue</Text>
        </Pressable>
        <Pressable style={styles.skipBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, fontFamily: 'Poppins_700Bold' },
  sub: { fontSize: 12, color: colors.muted, marginTop: 2, marginBottom: 10, fontFamily: 'Poppins_400Regular' },
  logoWrap: { width: 120, height: 80, borderRadius: 60, backgroundColor: '#F3F3F3', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', alignSelf: 'center', marginVertical: 12, borderWidth: 1, borderColor: '#E5E5E5' },
  logoImg: { width: '100%', height: '100%' },
  label: { fontSize: 14, color: colors.text, fontWeight: '700', marginTop: 12, marginBottom: 6, fontFamily: 'Poppins_700Bold' },
  input: { height: 48, borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#F5F5F5', color: colors.text, fontFamily: 'Poppins_400Regular' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#EFEFEF' },
  chipActive: { backgroundColor: colors.accent },
  chipText: { fontSize: 12, color: colors.text, fontWeight: '700' },
  chipTextActive: { color: 'white' },
  dropdown: { height: 48, borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#F5F5F5', justifyContent: 'center' },
  dropdownText: { fontSize: 14, color: colors.text, fontFamily: 'Poppins_400Regular' },
  dropdownList: { backgroundColor: '#fff', borderRadius: 8, paddingVertical: 6, marginTop: 6, elevation: 4, borderWidth: StyleSheet.hairlineWidth, borderColor: '#E6E6E6' },
  dropdownListWrapper: { maxHeight: 200 },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 12 },
  dropdownItemText: { fontSize: 14, color: colors.text, fontFamily: 'Poppins_400Regular' },
  primaryBtn: { backgroundColor: colors.accent, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: 'white', fontWeight: '800', fontFamily: 'Poppins_600SemiBold' },
  skipBtn: { alignItems: 'center', marginTop: 10 },
  skipText: { color: colors.muted, fontWeight: '700', fontFamily: 'Poppins_600SemiBold' },
  // chipText and chipTextActive are defined earlier; duplicates removed to fix lint error
});
