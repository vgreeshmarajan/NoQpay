import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { databases, account } from '@/config/appwriteConfig';
import { useCart } from '@/context/CartContext';
import RazorpayPayment from './payments/RazorpayPayment';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const ORDERS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID;

interface PaymentError {
  title: string;
  message: string;
}

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const totalAmount = parseFloat(typeof params.total === 'string' ? params.total : '0');
  const { cart, clearCart } = useCart() || { cart: null, clearCart: null };
  const [error, setError] = useState<PaymentError | null>(null);
  const [loading, setLoading] = useState(false);

  // Early return if cart context is not available
  if (!cart || !clearCart) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorMessage}>Unable to process payment. Please try again.</Text>
      </View>
    );
  }

  const handlePaymentSuccess = async (paymentId: string) => {
    setLoading(true);
    try {
      // Get current user
      const user = await account.get();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Save order to database
      await databases.createDocument(
        DATABASE_ID!,
        ORDERS_COLLECTION_ID!,
        'unique()',
        {
          userId: user.$id, // Add user ID to order
          items: JSON.stringify(cart),
          total: totalAmount,
          status: 'completed',
          paymentId: paymentId,
          createdAt: new Date().toISOString()
        }
      );

      // Clear cart and redirect
      await clearCart();
      router.replace('/');
    } catch (err: any) {
      console.error('Failed to save order:', err);
      setError({
        title: 'Order Creation Failed',
        message: err.message || 'Failed to create your order. Please contact support.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error: any) => {
    setError({
      title: 'Payment Failed',
      message: error.description || 'Something went wrong with the payment'
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Payment</Text>
      <Text style={styles.amount}>Total Amount: ₹{totalAmount.toFixed(2)}</Text>
      
      <RazorpayPayment
        amount={totalAmount}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />

      {loading && (
        <Modal transparent visible={loading}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0070BA" />
            <Text style={styles.loadingText}>Processing your order...</Text>
          </View>
        </Modal>
      )}

      {error && (
        <Modal transparent visible={!!error} onRequestClose={() => setError(null)}>
          <View style={styles.errorContainer}>
            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>{error.title}</Text>
              <Text style={styles.errorMessage}>{error.message}</Text>
              <TouchableOpacity 
                style={styles.errorButton}
                onPress={() => setError(null)}
              >
                <Text style={styles.errorButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  amount: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0070BA'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  errorContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center'
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#d32f2f'
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 20
  },
  errorButton: {
    backgroundColor: '#0070BA',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});
