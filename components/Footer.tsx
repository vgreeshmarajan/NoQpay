import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '@/context/CartContext'; 
import { useRouter } from 'expo-router';  

interface FooterProps {
  totalPrice: number;
}

export default function Footer({ totalPrice }: FooterProps) {
  const router = useRouter();

  return (
    <View style={styles.footer}>
      {/* 30% Orders Button */}
      <TouchableOpacity style={[styles.button, styles.ordersButton]} onPress={() => router.push('/order')}>
      <View style={styles.buttonContent}>
          <Image source={require('../assets/images/orders.png')} style={styles.icon} />
          <Text style={styles.buttonText}></Text>
        </View>
      </TouchableOpacity>

      {/* 70% Total Price Button */}
      <TouchableOpacity style={[styles.button, styles.totalButton]} onPress={() => router.push('/cart')}>
      <View style={styles.buttonContent}>
          <Image source={require('../assets/images/cart.png')} style={styles.icon} />
          <Text style={styles.buttonText}>₹{totalPrice.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row', // Arrange buttons horizontally
    alignContent: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap : 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 15,
    borderRadius: 25 // Rounded corners
  },
  button: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center',
    paddingHorizontal: 10, // Vertically center the content
  },
  icon: {
    width: 20,   // Adjust size as needed
    height: 20,  // Adjust size as needed
    resizeMode: 'contain',
  },
  ordersButton: {
    width: '20%',
    backgroundColor: '#ff9063', // Adjusted button color from the palette
    borderRadius: 12,
  },
  totalButton: {
    width: '80%',
    backgroundColor: '#63D2FF', // Soft blue for total button from the palette
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});