import React, { useCallback } from 'react';
import { NavigationContainer, DefaultTheme, Theme, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import ProductDetailScreen from '../screens/Product/ProductDetailScreen';
import EditProductScreen from '../screens/Product/EditProductScreen';
import CreateProductScreen from '../screens/Product/CreateProductScreen';
import ChatDetailScreen from '../screens/Chats/ChatDetailScreen';
import ConversationsListScreen from '../screens/Chats/ConversationsListScreen';
import VendorOnboardingScreen from '../screens/Onboarding/VendorOnboardingScreen';
import FollowingListScreen from '../screens/Profile/FollowingListScreen';
import CartScreen from '../screens/Profile/CartScreen';
import InvoicesListScreen from '../screens/Profile/InvoicesListScreen';
import LikedProductsScreen from '../screens/Profile/LikedProductsScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import VendorDashboardScreen from '../screens/Vendor/VendorDashboardScreen';
import { userSession } from '../services/userSession';

export type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  Home: undefined;
  ProductDetail: { productId: string; productName: string };
  EditProduct: { 
    productId: string; 
    name?: string; 
    price?: number; 
    description?: string; 
    images?: string[];
    category?: string;
    stockQuantity?: number;
    tags?: string[];
  };
  CreateProduct: undefined;
  ChatDetail: { chatId: string; name: string; role?: 'buyer' | 'vendor'; productName?: string; productId?: string; initialText?: string; initialSend?: boolean; serverSeeded?: boolean };
  Conversations: undefined;
  VendorOnboarding: { email?: string; userId?: string } | undefined;
  FollowingList: undefined;
  Cart: undefined;
  InvoicesList: undefined;
  LikedProducts: undefined;
  Settings: undefined;
  VendorDashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#FFFFFF' },
};

export default function RootNavigator() {
  const navRef = createNavigationContainerRef<RootStackParamList>();
  const authScreens = new Set<keyof RootStackParamList>(['Login','SignUp']);

  const ensureAuthGuard = useCallback(async () => {
    try {
      const user = await userSession.getCurrentUser();
      if (!user && navRef.isReady()) {
        const route = navRef.getCurrentRoute();
        const name = route?.name as keyof RootStackParamList | undefined;
        if (!name || !authScreens.has(name)) {
          navRef.navigate('Login');
        }
      }
    } catch {}
  }, [navRef]);

  return (
    <NavigationContainer
      ref={navRef}
      theme={navTheme}
      onReady={ensureAuthGuard}
      onStateChange={ensureAuthGuard}
    >
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="VendorOnboarding" component={VendorOnboardingScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
  <Stack.Screen name="EditProduct" component={EditProductScreen} />
    <Stack.Screen name="CreateProduct" component={CreateProductScreen} />
        <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
  <Stack.Screen name="Conversations" component={ConversationsListScreen} />
        <Stack.Screen name="FollowingList" component={FollowingListScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="InvoicesList" component={InvoicesListScreen} />
        <Stack.Screen name="LikedProducts" component={LikedProductsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="VendorDashboard" component={VendorDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
