import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onHide: () => void;
  title?: string;
  position?: 'top' | 'center' | 'bottom';
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onHide,
  title,
  position = 'top',
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: position === 'top' ? -100 : 100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#4CAF50',
          icon: 'checkmark-circle',
          iconColor: '#FFFFFF',
          borderColor: '#45a049',
        };
      case 'error':
        return {
          backgroundColor: '#F44336',
          icon: 'alert-circle',
          iconColor: '#FFFFFF',
          borderColor: '#d32f2f',
        };
      case 'warning':
        return {
          backgroundColor: '#FF9800',
          icon: 'warning',
          iconColor: '#FFFFFF',
          borderColor: '#f57c00',
        };
      default:
        return {
          backgroundColor: '#2196F3',
          icon: 'information-circle',
          iconColor: '#FFFFFF',
          borderColor: '#1976d2',
        };
    }
  };

  const config = getToastConfig();

  const getPositionStyle = () => {
    const statusBarHeight = StatusBar.currentHeight || 0;
    switch (position) {
      case 'center':
        return {
          top: height / 2 - 50,
          alignSelf: 'center',
        };
      case 'bottom':
        return {
          bottom: 100,
          alignSelf: 'center',
        };
      default:
        return {
          top: statusBarHeight + 20,
          alignSelf: 'center',
        };
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.toastContainer,
          getPositionStyle(),
          {
            backgroundColor: config.backgroundColor,
            borderLeftColor: config.borderColor,
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.toastContent}
          onPress={hideToast}
          activeOpacity={0.9}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={config.icon as any}
              size={24}
              color={config.iconColor}
            />
          </View>
          
          <View style={styles.textContainer}>
            {title && (
              <Text style={styles.toastTitle}>{title}</Text>
            )}
            <Text style={styles.toastMessage}>{message}</Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={hideToast}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// Hook for easy usage
export const useToast = () => {
  const [toastConfig, setToastConfig] = React.useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title?: string;
    duration?: number;
    position?: 'top' | 'center' | 'bottom';
  }>({
    visible: false,
    message: '',
    type: 'info',
  });

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    title?: string,
    duration: number = 3000,
    position: 'top' | 'center' | 'bottom' = 'top'
  ) => {
    setToastConfig({
      visible: true,
      message,
      type,
      title,
      duration,
      position,
    });
  };

  const hideToast = () => {
    setToastConfig(prev => ({ ...prev, visible: false }));
  };

  const showSuccess = (message: string, title?: string) => 
    showToast(message, 'success', title);
  
  const showError = (message: string, title?: string) => 
    showToast(message, 'error', title);
  
  const showInfo = (message: string, title?: string) => 
    showToast(message, 'info', title);
  
  const showWarning = (message: string, title?: string) => 
    showToast(message, 'warning', title);

  return {
    ...toastConfig,
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideToast,
    ToastComponent: () => (
      <Toast
        visible={toastConfig.visible}
        message={toastConfig.message}
        type={toastConfig.type}
        title={toastConfig.title}
        duration={toastConfig.duration}
        position={toastConfig.position}
        onHide={hideToast}
      />
    ),
  };
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  toastContainer: {
    width: width - 32,
    maxWidth: 400,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  toastMessage: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    opacity: 0.95,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default Toast;
