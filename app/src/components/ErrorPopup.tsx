import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export type ErrorPopupProps = {
  visible: boolean;
  message: string;
  onDismiss?: () => void;
  duration?: number; // ms, auto-hide; omit to keep persistent
  tilt?: 'left' | 'right';
  style?: ViewStyle; // extra style for the card
};

// A floating error popup with subtle 3D tilt and depth. Transparent backdrop.
export function ErrorPopup({ visible, message, onDismiss, duration = 5000, tilt = 'left', style }: ErrorPopupProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;
  const swing = useRef(new Animated.Value(0)).current; // -1..1

  const base = tilt === 'left' ? -2 : 2; // base angle in deg
  const rotate = swing.interpolate({ inputRange: [-1, 1], outputRange: [`${base - 3}deg`, `${base + 3}deg`] });

  // Try to use expo-blur if available; fall back to a light dim overlay
  const BlurView = useMemo(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require('expo-blur').BlurView as React.ComponentType<any>;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let hideTimer: NodeJS.Timeout | undefined;
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 7, tension: 80, useNativeDriver: true }),
      ]).start();
      // Start a gentle, continuous left-right swing
      Animated.loop(
        Animated.sequence([
          Animated.timing(swing, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(swing, { toValue: -1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
      if (duration) hideTimer = setTimeout(() => onDismiss?.(), duration);
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 160, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.96, duration: 160, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]).start();
      swing.stopAnimation();
      swing.setValue(0);
    }
    return () => {
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [visible, duration, onDismiss, opacity, scale, swing]);

  if (!visible) return null;

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {/* Transparent backdrop that still lets you dismiss on tap around the card */}
      {BlurView ? (
        <BlurView style={styles.backdrop} intensity={26} tint="light">
          <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
        </BlurView>
      ) : (
        <Pressable style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.06)' }]} onPress={onDismiss} />
      )}
      <Animated.View
        style={[
          styles.cardWrap,
          { opacity, transform: [{ perspective: 900 }, { scale }, { rotateZ: rotate }] },
        ]}
        pointerEvents="box-none"
      >
        <View style={[styles.card, style]} accessibilityRole="alert" accessibilityLabel="Error">
          <Ionicons name="warning" size={18} color={colors.white} style={styles.icon} />
          <Text style={styles.text}>{message}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject },
  cardWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '86%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#E53935', // vibrant red
    // subtle depth
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  icon: { marginRight: 8 },
  text: { color: colors.white, fontSize: 14, fontFamily: 'Poppins_600SemiBold' },
});

export default ErrorPopup;
