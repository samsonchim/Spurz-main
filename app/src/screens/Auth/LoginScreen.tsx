import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { Feather } from '@expo/vector-icons';
import ErrorPopup from '../../components/ErrorPopup';
import OverlayLoading from '../../components/OverlayLoading';
import LoadingSpinner from '../../components/LoadingSpinner';
import { apiPost } from '../../services/api';
import { userSession } from '../../services/userSession';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errVisible, setErrVisible] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.topRow}>
              <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
                <Feather name="arrow-left" size={26} color={colors.text} />
              </Pressable>
            </View>

            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>Welcome back</Text>

            <View style={{ height: 20 }} />

            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Your Email"
              placeholderTextColor="#B0B0B0"
              style={styles.input}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="next"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Your Password"
                placeholderTextColor="#B0B0B0"
                style={[styles.input, styles.inputFlex]}
                secureTextEntry={!show}
                autoCapitalize="none"
                returnKeyType="done"
              />
              <Pressable onPress={() => setShow((s) => !s)} hitSlop={10} style={styles.eyeBtn}>
                <Feather name={show ? 'eye' : 'eye-off'} size={20} color="#9A9A9A" />
              </Pressable>
            </View>

            <Pressable
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={async () => {
                if (!email || !password) {
                  setErrMsg('Please fill in all fields');
                  setErrVisible(true);
                  return;
                }
                setLoading(true);
                try {
                  const response = await apiPost('/auth/login', {
                    email: email.trim(),
                    password,
                  });
                  
                  if (!response.ok) {
                    setErrMsg(response.error || 'Login failed');
                    setErrVisible(true);
                    return;
                  }
                  
                  // Store user session data
                  if (response.data?.user && response.data?.token) {
                    await userSession.setSession({
                      user: response.data.user,
                      token: response.data.token
                    });
                    console.log('Login successful:', response.data);
                  }
                  
                  // Success - navigate to home
                  navigation.navigate('Home');
                } catch (e) {
                  setErrMsg('Network error. Please try again.');
                  setErrVisible(true);
                } finally {
                  setLoading(false);
                }
              }}
              android_ripple={{ color: '#ffffff55' }}
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner message="Signing in..." size="small" />
              ) : (
                <Text style={styles.loginText}>Login</Text>
              )}
            </Pressable>

            <View style={styles.rowCenter}>
              <Text style={styles.haveAccount}>No account?</Text>
              <Pressable onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signUp}> Create one</Text>
              </Pressable>
            </View>

            <ErrorPopup visible={errVisible} message={errMsg} onDismiss={() => setErrVisible(false)} />
            <OverlayLoading visible={loading} message="Signing in..." />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { fontFamily: 'Poppins_700Bold', fontSize: 28, color: colors.text },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: 16, color: '#6E6E6E', marginTop: 2 },
  label: { fontFamily: 'Poppins_700Bold', color: colors.text, fontSize: 16, marginTop: 18, marginBottom: 8 },
  input: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#EDEDED',
    fontFamily: 'Poppins_400Regular',
    color: colors.text,
  },
  inputRow: { position: 'relative' },
  inputFlex: { paddingRight: 48 },
  eyeBtn: { position: 'absolute', right: 12, top: 18 },
  loginBtn: {
    marginTop: 24,
    backgroundColor: colors.accent,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginText: { color: '#fff', fontFamily: 'Poppins_600SemiBold', fontSize: 18 },
  rowCenter: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 18 },
  haveAccount: { fontFamily: 'Poppins_400Regular', color: '#6E6E6E', fontSize: 16 },
  signUp: { fontFamily: 'Poppins_600SemiBold', color: colors.accent, fontSize: 16 },
});
