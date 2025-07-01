import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { databases, client } from '@/config/appwriteConfig';
import { useCart } from '@/context/CartContext';
import { Query, type Models } from 'appwrite';

type RootStackParamList = {
  index: undefined;
  login: undefined;
};

type NavigationType = {
  navigate: (screen: keyof RootStackParamList) => void;
};

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order extends Models.Document {
  userId: string;
  total: number;
  items: string; // JSON string of OrderItem[]
  status: 'pending' | 'completed' | 'cancelled';
}

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const ORDERS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID;

if (!DATABASE_ID || !ORDERS_COLLECTION_ID) {
  throw new Error('Missing required environment variables for orders functionality');
}

export default function OrdersScreen() {
  const { fetchUserAndCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationType>();
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchOrders = async (userId: string) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
        ]
      );

      const orderDocuments = response.documents as Order[];
      setOrders(orderDocuments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeOrders = async () => {
      try {
        const user = await fetchUserAndCart();
        if (!user) {
          navigation.navigate('login');
          setError('Please login to view your orders.');
          return;
        }
        setCurrentUser(user);
        await fetchOrders(user.$id);

        // Subscribe to real-time updates
        const unsubscribe = client.subscribe(
          [`databases.${DATABASE_ID}.collections.${ORDERS_COLLECTION_ID}.documents`],
          (response: { 
            events: string[];
            payload: unknown;
          }) => {
            if (!currentUser) return;

            const event = response.events[0];
            const payload = response.payload as Order;

            // Only process events for the current user's orders
            if (payload.userId === currentUser.$id) {
              console.log('Received real-time update:', event, payload);

              if (event.includes('create')) {
                setOrders(prev => [payload, ...prev]);
              } else if (event.includes('update')) {
                setOrders(prev => 
                  prev.map(order => order.$id === payload.$id ? payload : order)
                );
              } else if (event.includes('delete')) {
                setOrders(prev => 
                  prev.filter(order => order.$id !== payload.$id)
                );
              }
            }
          }
        );

        return () => {
          console.log('Unsubscribing from real-time updates');
          unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing orders:', error);
        setError('Failed to initialize orders. Please try again.');
        setLoading(false);
      }
    };

    initializeOrders();
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('index');
      return true;  
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Orders</Text>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {orders.length === 0 ? (
        <Text style={styles.noOrdersText}>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <Text style={styles.orderDate}> {new Date(item.$createdAt).toLocaleString()}</Text>
              <Text style={styles.totalText}>Total: {item.total}</Text>
              <Text style={styles.statusText}>Status: {item.status}</Text>
              <Text style={styles.itemsHeader}>Items:</Text>
              {(() => {
                try {
                  const products = JSON.parse(item.items) as OrderItem[];
                  return products.map((product: OrderItem, index: number) => (
                    <View key={index} style={styles.itemRow}>
                      <Text style={styles.itemText}>
                        {product.name} (x{product.quantity})
                      </Text>
                      <Text style={styles.itemPrice}>{product.price * product.quantity}</Text>
                    </View>
                  ));
                } catch (e) {
                  return <Text style={styles.errorText}>Error loading order items</Text>;
                }
              })()}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#F0F0F5',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  noOrdersText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 60,
    color: '#777',
    fontWeight: '500',
  },
  orderCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginLeft: 10,
    marginRight: 10,
  },
  orderDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  totalText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginTop: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 5,
  },
  itemsHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#444',
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
});
