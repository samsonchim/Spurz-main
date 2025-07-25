import MailToSuccess from '@/components/Confirmation';
import { API_ENDPOINTS, getApiUrl } from '@/constants/api';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EmailVerificationScreen() {
  const { email, fullName } = useLocalSearchParams();
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.RESEND_VERIFICATION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          'Email Sent!',
          'A new verification email has been sent to your inbox.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          data.message || 'Failed to resend email. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Network error. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignup = () => {
    router.replace('/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail-outline" size={60} color="#FFA500" />
          </View>
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a verification link to
          </Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* Confirmation Animation */}
        <View style={styles.animationContainer}>
          <MailToSuccess />
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#00C853" />
            <Text style={styles.instructionText}>
              Click the verification link in your email
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#00C853" />
            <Text style={styles.instructionText}>
              You'll be automatically redirected to the app
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="time-outline" size={20} color="#FFA500" />
            <Text style={styles.instructionText}>
              Link expires in 24 hours
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Text style={styles.troubleText}>
            Didn't receive the email? Check your spam folder or
          </Text>
          
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendEmail}
            disabled={isResending}
          >
            <Ionicons 
              name="refresh" 
              size={16} 
              color="#FFA500" 
              style={styles.resendIcon} 
            />
            <Text style={styles.resendButtonText}>
              {isResending ? 'Sending...' : 'Resend Email'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToSignup}
          >
            <Text style={styles.backButtonText}>Back to Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Need help? Contact support at support@spurz.com
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#FFA500',
    fontWeight: '600',
    textAlign: 'center',
  },
  animationContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  instructions: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 10,
    flex: 1,
  },
  actions: {
    alignItems: 'center',
  },
  troubleText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 15,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5e6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFA500',
    marginBottom: 15,
  },
  resendIcon: {
    marginRight: 8,
  },
  resendButtonText: {
    fontSize: 16,
    color: '#FFA500',
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666666',
    textDecorationLine: 'underline',
  },
  footer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
});
