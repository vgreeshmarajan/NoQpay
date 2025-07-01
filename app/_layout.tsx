import { useEffect, useState } from 'react';
import { Slot, Stack } from 'expo-router';
import { account } from '@/config/appwriteConfig';
import { View, ActivityIndicator } from 'react-native';
import { CartProvider } from '../context/CartContext';

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        await account.get();
        if (isMounted) setIsAuthenticated(true);
      } catch {
        if (isMounted) setIsAuthenticated(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1D3D47" />
      </View>
    );
  }

  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
        <Stack.Screen name="scanner" options={{ title: "Scanner", headerShown: false }} />
        <Stack.Screen name="cart" options={{ title: "Cart", headerShown: false }} />
        <Stack.Screen name="order" options={{ title: "Order", headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Login", headerShown: false }} />
        <Stack.Screen name="signup" options={{ title: "Signup", headerShown: false }} />
        <Stack.Screen name="payment" options={{ title: "Payment", headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: "Profile", headerShown: false }} />
        
        {/* Add other screens if needed */}
      </Stack>
    </CartProvider>
  );
}
