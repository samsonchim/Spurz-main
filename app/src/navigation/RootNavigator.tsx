import React from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import ProductDetailScreen from '../screens/Product/ProductDetailScreen';
import EditProductScreen from '../screens/Product/EditProductScreen';
import CreateProductScreen from '../screens/Product/CreateProductScreen';
import ChatDetailScreen from '../screens/Chats/ChatDetailScreen';
import FollowingListScreen from '../screens/Profile/FollowingListScreen';
import CartScreen from '../screens/Profile/CartScreen';
import InvoicesListScreen from '../screens/Profile/InvoicesListScreen';
import LikedProductsScreen from '../screens/Profile/LikedProductsScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';

export type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  Home: undefined;
  ProductDetail: { productId: string; productName: string };
  EditProduct: { productId: string; name?: string; price?: number; description?: string; images?: string[] };
  CreateProduct: undefined;
  ChatDetail: { chatId: string; name: string; role?: 'buyer' | 'vendor' };
  FollowingList: undefined;
  Cart: undefined;
  InvoicesList: undefined;
  LikedProducts: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#FFFFFF' },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName="SignUp" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
  <Stack.Screen name="EditProduct" component={EditProductScreen} />
    <Stack.Screen name="CreateProduct" component={CreateProductScreen} />
        <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
        <Stack.Screen name="FollowingList" component={FollowingListScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="InvoicesList" component={InvoicesListScreen} />
        <Stack.Screen name="LikedProducts" component={LikedProductsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
