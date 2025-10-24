import React, { useEffect, useRef } from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View, Pressable, Animated, Easing } from 'react-native';
import { colors } from '../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export type BottomItem = {
  key: string;
  label: string;
  icon: ImageSourcePropType;
};

type Props = {
  items: BottomItem[];
  activeKey: string;
  onChange: (key: string) => void;
};

export default function BottomNav({ items, activeKey, onChange }: Props) {
  // Per-item animations
  const animRefs = useRef<{ [key: string]: { scale: Animated.Value; opacity: Animated.Value } }>({});

  // Initialize animations for each item
  useEffect(() => {
    items.forEach((it) => {
      if (!animRefs.current[it.key]) {
        animRefs.current[it.key] = {
          scale: new Animated.Value(1),
          opacity: new Animated.Value(0.6),
        };
      }
    });
  }, [items]);

  // Trigger animation when active key changes
  useEffect(() => {
    items.forEach((it) => {
      const anim = animRefs.current[it.key];
      if (!anim) return;

      const isActive = it.key === activeKey;
      Animated.parallel([
        Animated.timing(anim.scale, {
          toValue: isActive ? 1.08 : 1,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: isActive ? 1 : 0.6,
          duration: 240,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [activeKey, items]);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safe}>
      <View style={styles.bar}>
        {items.map((it) => {
          const active = it.key === activeKey;
          const anim = animRefs.current[it.key];

          return (
            <Pressable
              key={it.key}
              style={[styles.item, active && styles.itemActive]}
              onPress={() => onChange(it.key)}
              android_ripple={{ color: 'rgba(248, 155, 28, 0.12)', radius: 50 }}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  active && styles.iconContainerActive,
                  anim && {
                    transform: [{ scale: anim.scale }],
                    opacity: anim.opacity,
                  },
                ]}
              >
                <Image
                  source={it.icon}
                  style={[styles.icon, active ? styles.iconActive : styles.iconInactive]}
                  resizeMode="contain"
                />
              </Animated.View>
              <Animated.Text
                style={[
                  styles.label,
                  active ? styles.labelActive : styles.labelInactive,
                  anim && { opacity: anim.opacity },
                ]}
                numberOfLines={1}
              >
                {it.label}
              </Animated.Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  bar: {
    marginHorizontal: 14,
    marginBottom: 10,
    marginTop: 6,
    backgroundColor: colors.white,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 12,
    // Minimal shadow - floating effect
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 14,
    position: 'relative',
  },
  itemActive: {
    backgroundColor: 'rgba(248, 155, 28, 0.12)',
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderRadius: 10,
  },
  iconContainerActive: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(248, 155, 28, 0.15)',
  },
  icon: { width: 24, height: 24 },
  iconActive: { tintColor: colors.accent, width: 28, height: 28 },
  iconInactive: { tintColor: '#C0C0C0' },
  label: {
    fontSize: 10,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  labelActive: { color: colors.accent, fontFamily: 'Poppins_700Bold', fontSize: 10.5 },
  labelInactive: { color: '#A8A8A8' },
});
