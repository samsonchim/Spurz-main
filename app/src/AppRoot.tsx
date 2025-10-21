import React, { useEffect } from 'react';
import { View } from 'react-native';
import RootNavigator from './navigation/RootNavigator';
import OnboardingScreen from './screens/Onboarding/OnboardingScreen';
import { useAppStore } from './store/appStore';
import { colors } from './theme/colors';

export default function AppRoot() {
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  const hydrated = useAppStore((s) => s.hydrated);
  const hydrate = useAppStore((s) => s.hydrate);
  const setOnboarded = useAppStore((s) => s.setOnboarded);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  if (!hasOnboarded) return <OnboardingScreen onDone={() => setOnboarded(true)} />;
  return <RootNavigator />;
}
