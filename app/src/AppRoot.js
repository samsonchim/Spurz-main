import React, { useState } from 'react';
import { View } from 'react-native';
import OnboardingScreen from './screens/OnboardingScreen';

export default function AppRoot() {
  const [done, setDone] = useState(false);
  if (!done) return <OnboardingScreen onDone={() => setDone(true)} />;
  return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
}
