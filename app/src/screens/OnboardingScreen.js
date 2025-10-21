import React, { useMemo, useState } from 'react';
import { Image, ImageBackground, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

const bg = '#FFFAF0';
const accent = '#F89B1C';
const dot = '#D8CFC4';
const dark = '#191919';

const slides = [
  {
    key: 'discover',
    title: 'Discover Trusted\nVendor Around You',
    subtitle: 'Find Great Deals From Verified\nSellers And Outlet',
    image: require('../../assets/onboarding-1.png'),
  },
  {
    key: 'escrow',
    title: 'Pay Safely With Escrow',
    subtitle: 'Your Money Is Protected Until\nYou Confirm Delivery',
    image: require('../../assets/onboarding-2.png'),
  },
  {
    key: 'simplify',
    title: 'Simplify Your  Transaction',
    subtitle: 'Chat Directly, Confirm Items, And\nReview Your Experience',
    image: require('../../assets/onboarding-3.png'),
  },
];

export default function OnboardingScreen({ onDone }) {
  const [index, setIndex] = useState(0);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const slide = slides[index];

  const handleNext = () => {
    if (index < slides.length - 1) setIndex((i) => i + 1);
    else onDone?.();
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={bg} />
      <View style={styles.container}>
        <Image source={slide.image} style={styles.hero} resizeMode="contain" />
        <View style={styles.textWrap}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
          <View style={styles.dots}>
            {slides.map((s, i) => (
              <View key={s.key} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>
        </View>
        <View style={styles.footer}>
          {index < slides.length - 1 ? (
            <Pressable onPress={onDone} hitSlop={8}>
              <Text style={styles.skip}>Skip</Text>
            </Pressable>
          ) : (
            <View style={{ width: 64 }} />
          )}
          <Pressable onPress={handleNext} style={styles.cta} android_ripple={{ color: '#ffffff55' }}>
            <Text style={styles.ctaText}>{index === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: bg },
  container: {
    flex: 1,
    backgroundColor: bg,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  hero: {
    width: '100%',
    height: '46%',
    marginTop: 24,
  },
  textWrap: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    color: dark,
    fontSize: 32,
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: 0.2,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    color: '#6E6E6E',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  dot: {
    width: 36,
    height: 6,
    borderRadius: 3,
    backgroundColor: dot,
  },
  dotActive: {
    backgroundColor: accent,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skip: {
    fontFamily: 'Poppins_600SemiBold',
    color: dark,
    fontSize: 16,
  },
  cta: {
    backgroundColor: accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 120,
    alignItems: 'center',
  },
  ctaText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
});
