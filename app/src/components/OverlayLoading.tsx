import React, { useEffect, useRef } from 'react'
import { View, Text, ActivityIndicator, StyleSheet, Animated, Dimensions } from 'react-native'
import { colors } from '../theme/colors'

interface OverlayLoadingProps {
  visible: boolean
  message?: string
  size?: 'small' | 'large'
}

const { width, height } = Dimensions.get('window')

export default function OverlayLoading({ visible, message = 'Loading...', size = 'large' }: OverlayLoadingProps) {
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [visible, opacity])

  if (!visible) return null

  return (
    <Animated.View style={[styles.overlay, { opacity }] } pointerEvents={visible ? 'auto' : 'none'}>
      <View style={styles.box}>
        <ActivityIndicator size={size} color={colors.accent} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  box: {
    minWidth: 140,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  message: {
    marginTop: 10,
    color: colors.text,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular'
  }
})
