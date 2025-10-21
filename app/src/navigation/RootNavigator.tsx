import React from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';

export type RootStackParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#FFFFFF' },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
