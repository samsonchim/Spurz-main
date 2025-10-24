import React, { useState } from 'react';
import RootNavigator from './navigation/RootNavigator';
import OnboardingScreen from './screens/Onboarding/OnboardingScreen';

export default function AppRoot() {
  const [done, setDone] = useState(false);
  if (!done) return <OnboardingScreen onDone={() => setDone(true)} />;
  return <RootNavigator />;
}
