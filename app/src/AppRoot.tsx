import React, { useEffect, useState } from 'react';
import { Text, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import RootNavigator from './navigation/RootNavigator';
import OnboardingScreen from './screens/Onboarding/OnboardingScreen';

export default function AppRoot() {
  // Always declare hooks in the same order before any returns
  const [done, setDone] = useState(false);
  const [fontsLoaded] = useFonts({
    // Base family
    Poppins: require('../assets/poppins.ttf'),
    // Aliases to maintain compatibility with existing style names
    Poppins_400Regular: require('../assets/poppins.ttf'),
    Poppins_600SemiBold: require('../assets/poppins.ttf'),
    Poppins_700Bold: require('../assets/poppins.ttf'),
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    // Enforce Poppins globally on Text and TextInput (cast to any to access defaultProps)
    const RNText = Text as any;
    RNText.defaultProps = RNText.defaultProps || {};
    const prevTextStyle = RNText.defaultProps.style || {};
  RNText.defaultProps.style = [prevTextStyle, { fontFamily: 'Poppins_400Regular' }];

    const RNTextInput = TextInput as any;
    RNTextInput.defaultProps = RNTextInput.defaultProps || {};
    const prevInputStyle = RNTextInput.defaultProps.style || {};
  RNTextInput.defaultProps.style = [prevInputStyle, { fontFamily: 'Poppins_400Regular' }];
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  if (!done) return <OnboardingScreen onDone={() => setDone(true)} />;
  return <RootNavigator />;
}
