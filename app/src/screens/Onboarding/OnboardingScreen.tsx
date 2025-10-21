import React, { useState } from 'react';
import { Image, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { colors } from '../../theme/colors';
import { Button } from '../../components/Button';
import { PagerDots } from '../../components/PagerDots';

const slides = [
  {
    key: 'discover',
    title: 'Discover Trusted\nVendor Around You',
    subtitle: 'Find Great Deals From Verified\nSellers And Outlet',
    image: require('../../../logo.png'),
  },
  {
    key: 'escrow',
    title: 'Pay Safely With Escrow',
    subtitle: 'Your Money Is Protected Until\nYou Confirm Delivery',
    image: require('../../../logo.png'),
  },
  {
    key: 'simplify',
    title: 'Simplify Your  Transaction',
    subtitle: 'Chat Directly, Confirm Items, And\nReview Your Experience',
    image: require('../../../logo.png'),
  },
] as const;

type Props = { onDone?: () => void };

export default function OnboardingScreen({ onDone }: Props) {
  const [index, setIndex] = useState(0);
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });
  const slide = slides[index];

  const handleNext = () => {
    if (index < slides.length - 1) setIndex((i) => i + 1);
    else onDone?.();
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        <Image source={slide.image} style={styles.hero} resizeMode="contain" />
        <View style={styles.textWrap}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
          <PagerDots count={slides.length} index={index} />
        </View>
        <View style={styles.footer}>
          {index < slides.length - 1 ? (
            <Pressable onPress={onDone} hitSlop={8}>
              <Text style={styles.skip}>Skip</Text>
            </Pressable>
          ) : (
            <View style={{ width: 64 }} />
          )}
          <Button title={index === slides.length - 1 ? 'Get Started' : 'Next'} onPress={handleNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24 },
  hero: { width: '100%', height: '46%', marginTop: 24 },
  textWrap: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 8 },
  title: { fontFamily: 'Poppins_700Bold', color: colors.text, fontSize: 32, textAlign: 'center', lineHeight: 40, letterSpacing: 0.2, marginBottom: 12 },
  subtitle: { fontFamily: 'Poppins_400Regular', color: colors.muted, fontSize: 16, textAlign: 'center', lineHeight: 24 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skip: { fontFamily: 'Poppins_600SemiBold', color: colors.text, fontSize: 16 },
});
