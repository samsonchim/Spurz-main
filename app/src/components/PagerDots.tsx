import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  count: number;
  index: number;
};

export function PagerDots({ count, index }: Props) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dots: { flexDirection: 'row', gap: 10, marginTop: 24 },
  dot: { width: 36, height: 6, borderRadius: 3, backgroundColor: colors.dotInactive },
  dotActive: { backgroundColor: colors.accent },
});
