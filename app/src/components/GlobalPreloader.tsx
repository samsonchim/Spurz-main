import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Modal, Platform, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  visible: boolean;
  message?: string;
};

const GlobalPreloader: React.FC<Props> = ({ visible, message }) => {
  const dotX = useRef(new Animated.Value(0)).current;
  const dotY = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;
    const run = () => {
      dotX.setValue(0);
      dotY.setValue(0);
      dotOpacity.setValue(1);
      Animated.sequence([
        // 0% -> 25%: arc up-left
        Animated.parallel([
          Animated.timing(dotX, { toValue: -15, duration: 350, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(dotY, { toValue: -20, duration: 350, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        // 25% -> 50%: drop to center with brief fade
        Animated.parallel([
          Animated.timing(dotX, { toValue: 0, duration: 350, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(dotY, { toValue: 0, duration: 350, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(dotOpacity, { toValue: 0.2, duration: 120, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(dotOpacity, { toValue: 1, duration: 120, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          ]),
        ]),
        // 51% -> 100%: quick reset to start position
        Animated.timing(dotX, { toValue: -15, duration: 0, useNativeDriver: true }),
      ]).start(() => {
        // small pause then loop
        setTimeout(run, 200);
      });
    };
    const id = setTimeout(run, 50);
    return () => {
      clearTimeout(id);
      dotX.stopAnimation();
      dotY.stopAnimation();
      dotOpacity.stopAnimation?.();
    };
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.cartWrap}>
            {/* Animated product dot */}
            <Animated.View
              style={[
                styles.dot,
                {
                  opacity: dotOpacity,
                  transform: [
                    { translateX: dotX },
                    { translateY: dotY },
                  ],
                },
              ]}
            />

            {/* Cart handle/top */}
            <View style={styles.cartHandle} />
            {/* Cart body */}
            <View style={styles.cartBody} />
            {/* Wheels */}
            <View style={styles.wheelsRow}>
              <View style={styles.wheel} />
              <View style={styles.wheel} />
            </View>
          </View>
          <Text style={styles.title}>Loading products...</Text>
          <Text style={styles.subtitle}>Dropping item into cart</Text>
          {!!message && <Text style={styles.msg}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    minWidth: 200,
    paddingHorizontal: 22,
    paddingVertical: 20,
    borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 6 },
      default: {},
    }),
  },
  cartWrap: {
    width: 80,
    height: 60,
    marginBottom: 10,
  },
  dot: {
    position: 'absolute',
    zIndex: 20,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent || '#FF7A00',
    left: 34, // approx center minus half dot
    top: 6,
  },
  cartHandle: {
    position: 'absolute',
    top: -6,
    right: 10,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#374151',
    borderTopRightRadius: 10,
    zIndex: 10,
  },
  cartBody: {
    position: 'absolute',
    top: 0,
    left: 15,
    width: 50,
    height: 35,
    borderWidth: 3,
    borderBottomWidth: 0,
    borderColor: '#374151',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    zIndex: 10,
  },
  wheelsRow: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    width: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  wheel: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#374151' },
  title: { marginTop: 6, fontSize: 16, color: '#374151', fontWeight: '800' },
  subtitle: { marginTop: 2, fontSize: 12, color: '#6B7280' },
  msg: {
    marginTop: 10,
    fontSize: 13,
    color: '#555',
  },
});

export default GlobalPreloader;
