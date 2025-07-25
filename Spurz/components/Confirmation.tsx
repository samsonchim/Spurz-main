import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const MailToSuccess = () => {
  const checkX = useRef(new Animated.Value(-150)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const mailScale = useRef(new Animated.Value(1)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation sequence
    Animated.sequence([
      // Start with mail bounce
      Animated.timing(mailScale, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(mailScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      // Animate line
      Animated.timing(lineWidth, {
        toValue: 100,
        duration: 800,
        useNativeDriver: false,
      }),
      // Animate check in
      Animated.parallel([
        Animated.timing(checkX, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.animationRow}>
        {/* Mail Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: mailScale }] }
          ]}
        >
          <Ionicons name="mail" size={40} color="#FFA500" />
        </Animated.View>

        {/* Animated Dashed Line */}
        <View style={styles.lineContainer}>
          <Animated.View
            style={[
              styles.animatedLine,
              { width: lineWidth }
            ]}
          />
          <View style={styles.dashedLine} />
        </View>

        {/* Success Check Animation */}
        <Animated.View
          style={[
            styles.checkContainer,
            {
              transform: [
                { translateX: checkX },
                { scale: checkScale }
              ],
            },
          ]}
        >
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={24} color="#ffffff" />
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  animationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5e6',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  lineContainer: {
    width: 100,
    height: 2,
    marginHorizontal: 15,
    position: 'relative',
    justifyContent: 'center',
  },
  dashedLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 1,
  },
  animatedLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#00C853',
    borderRadius: 1,
  },
  checkContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default MailToSuccess;
