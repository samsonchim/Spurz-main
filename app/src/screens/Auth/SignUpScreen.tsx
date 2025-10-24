import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { Feather } from '@expo/vector-icons';
import ErrorPopup from '../../components/ErrorPopup';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

export default function SignUpScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errVisible, setErrVisible] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });
  if (!fontsLoaded) return null;

  const canGoBack = navigation?.canGoBack?.() ?? false;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.topRow}>
              <Pressable onPress={() => (canGoBack ? navigation.goBack() : null)} hitSlop={12}>
                <Feather name="arrow-left" size={26} color={colors.text} />
              </Pressable>
            </View>

            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Create new account</Text>

            <View style={{ height: 20 }} />

            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor="#B0B0B0"
              style={styles.input}
              autoCapitalize="words"
              returnKeyType="next"
            />

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
              style={styles.registerBtn}
              onPress={() => {
                if (!name || !email || !password) {
                  setErrMsg('Please fill in all fields');
                  setErrVisible(true);
                  return;
                }
                // TODO: submit to API; for now navigate Home
                navigation.navigate('Home');
              }}
              android_ripple={{ color: '#ffffff55' }}
            >
              <Text style={styles.registerText}>Register</Text>
            </Pressable>

            <View style={styles.rowCenter}>
              <Text style={styles.haveAccount}>Have an account?</Text>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signIn}> Sign In</Text>
              </Pressable>
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.orWith}>Or with</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialRow}>
              <Pressable style={styles.socialBtn}>
                <Image source={require('../../../assets/google.png')} style={styles.socialIcon} resizeMode="contain" />
              </Pressable>
              <Pressable style={styles.socialBtn}>
                <Image source={require('../../../assets/apple.png')} style={styles.socialIcon} resizeMode="contain" />
              </Pressable>
            </View>
            <ErrorPopup visible={errVisible} message={errMsg} onDismiss={() => setErrVisible(false)} />
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
  registerBtn: {
    marginTop: 24,
    backgroundColor: colors.accent,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: { color: '#fff', fontFamily: 'Poppins_600SemiBold', fontSize: 18 },
  rowCenter: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 18 },
  haveAccount: { fontFamily: 'Poppins_400Regular', color: '#6E6E6E', fontSize: 16 },
  signIn: { fontFamily: 'Poppins_600SemiBold', color: colors.accent, fontSize: 16 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 28 },
  divider: { flex: 1, height: 1, backgroundColor: '#E6E1D7' },
  orWith: { fontFamily: 'Poppins_600SemiBold', color: '#6E6E6E' },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 18, marginTop: 28 },
  socialBtn: {
    height: 52,
    width: 52,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E6E6E6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  socialIcon: { width: 22, height: 22 },
});
