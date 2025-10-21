import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Button({ title, onPress, style }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.btn, style]} android_ripple={{ color: '#ffffff55' }}>
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 120,
    alignItems: 'center',
  },
  label: {
    color: colors.white,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
});
