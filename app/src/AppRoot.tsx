import React, { useEffect, useState } from 'react';
import { Text, TextInput } from 'react-native';
import RootNavigator from './navigation/RootNavigator';
import OnboardingScreen from './screens/Onboarding/OnboardingScreen';
import { colors } from './theme/colors';
import {
  useFonts,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';
import { GlobalLoadingProvider } from './store/globalLoading';
import { GlobalPopupProvider } from './store/globalPopup';

export default function AppRoot() {
  // Always declare hooks in the same order before any returns
  const [done, setDone] = useState(true);
  const [fontsLoaded] = useFonts({
    // Base variant
    Poppins_900Black,
    // Aliases to ensure all previous fontFamily names resolve to Black
    Poppins_400Regular: Poppins_900Black,
    Poppins_600SemiBold: Poppins_900Black,
    Poppins_700Bold: Poppins_900Black,
    'Poppins-Regular': Poppins_900Black,
    'Poppins-Medium': Poppins_900Black,
    'Poppins-SemiBold': Poppins_900Black,
    'Poppins-Bold': Poppins_900Black,
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    // Enforce Poppins globally on Text and TextInput (cast to any to access defaultProps)
    const RNText = Text as any;
  RNText.defaultProps = RNText.defaultProps || {};
    const prevTextStyle = RNText.defaultProps.style || {};
  RNText.defaultProps.style = [prevTextStyle, { fontFamily: 'Poppins_900Black', color: colors.text }];

    const RNTextInput = TextInput as any;
  RNTextInput.defaultProps = RNTextInput.defaultProps || {};
    const prevInputStyle = RNTextInput.defaultProps.style || {};
  RNTextInput.defaultProps.style = [prevInputStyle, { fontFamily: 'Poppins_900Black', color: colors.text }];
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  if (!done) return (
    <GlobalPopupProvider>
      <GlobalLoadingProvider>
        <OnboardingScreen onDone={() => setDone(true)} />
      </GlobalLoadingProvider>
    </GlobalPopupProvider>
  );
  return (
    <GlobalPopupProvider>
      <GlobalLoadingProvider>
        <RootNavigator />
      </GlobalLoadingProvider>
    </GlobalPopupProvider>
  );
}
