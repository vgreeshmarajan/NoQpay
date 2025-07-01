import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';

export default function CartScreen() {
  const router = useRouter();
  const { cart = [], addToCart, decreaseQuantity } = useCart(); // Ensure cart is an array
  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  const isCartEmpty = cart.length === 0; // Check if the cart is empty

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping Cart</Text>

      {isCartEmpty ? (
        <Text style={styles.emptyText}>Your cart is empty</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image
                source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                style={styles.image}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>₹{item.price}</Text>
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity style={styles.button} onPress={() => decreaseQuantity(item.id)}>
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity style={styles.button} onPress={() => addToCart(item)}>
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Total Price Button */}
      <TouchableOpacity
        style={[styles.totalButton, isCartEmpty && styles.disabledButton]} // Add disabled style
        onPress={() => !isCartEmpty && router.push(`/payment?total=${totalPrice}`)} // Prevent navigation if the cart is empty
        disabled={isCartEmpty} // Disable the button when the cart is empty
      >
        <Text style={styles.totalButtonText}>
          {isCartEmpty ? "Your cart is empty" : `Proceed to Pay ₹${totalPrice}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F9F9', // Slightly lighter background
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 10, // Added margin to the left for a slight offset
    marginRight: 10, // Added margin to the right for a slight offset
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
  image: {
    width: 60, // Increased size for better visibility
    height: 60,
    marginRight: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007BFF',
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 6,
    borderRadius: 5,
    marginHorizontal: 8,
    elevation: 5, // Adding shadow for a raised effect
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  quantity: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginHorizontal: 10,
  },
  totalButton: {
    backgroundColor: '#28a745',
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  totalButtonText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ddd', // Gray out the button when disabled
  },
});
