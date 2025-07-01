import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'expo-router';
import { account } from '@/config/appwriteConfig';
import { PRODUCTS } from '@/config/productData';
import Footer from '@/components/Footer';
if (typeof window !== 'undefined') {
  // Import browser-specific configuration
  require('./config/web');
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | any;
  description: string;
  quantity?: number;
}

type CategoryProducts = [string, Product[]];

interface NavbarProps {
  totalPrice: number;
  user: any;
  handleAuthAction: () => Promise<void>;
}

interface FooterProps {
  totalPrice: number;
}

export default function HomeScreen() {
  const { addToCart, cart, clearCart } = useCart() || { addToCart: () => {}, cart: [] as Product[], clearCart: () => {} };
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);


  // Fetch user information on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await account.get();  // Get current user
        setUser(userData);  // Set user in state
      } catch (error) {
        setUser(null);  // No user found, set user as null
      }
    };
    fetchUser().catch((error) => console.error(error));
  }, []);

  const totalPrice = cart.reduce((acc: number, item: Product) => acc + item.price * (item.quantity || 1), 0);

  // Filter products based on search query
  const filteredProducts: CategoryProducts[] = Object.entries(PRODUCTS).map(([category, products]: [string, Product[]]) => [
    category,
    products.filter((product: Product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ]).filter((item): item is CategoryProducts => item[1].length > 0);

  // Handle Add to Cart
  const handleAddToCart = (product: Product): void => {
    if (!user) {
      setModalVisible(true);  // Show modal if user is not logged in
      return;
    }
    addToCart(product);  // Add to cart if user is logged in
  };

  // Handle login/logout action
  const handleAuthAction = async () => {
    if (user) {
      await account.deleteSession('current');  // Delete user session (logout)
      setUser(null);  // Reset user state
      clearCart();  // Clear the cart on logout
    } else {
      router.push('/login');  // Navigate to login page if not logged in
    }
  };

  return (
    <View style={styles.container}>
      {/* Navbar with Cart Price */}
      <Navbar totalPrice={totalPrice} user={user} handleAuthAction={handleAuthAction} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        style={styles.productcontainer}
        data={filteredProducts}
        keyExtractor={(item: CategoryProducts) => item[0]}
        renderItem={({ item }) => (
          <View style={styles.category}>
            <Text style={styles.categoryTitle}>{item[0]}</Text>
            {/* Horizontal FlatList to display products in a row of 3 */}
            <FlatList
              data={item[1]}
              keyExtractor={(prod: Product) => prod.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }: { item: Product }) => (
                <View style={styles.product}>
                  <Image
                    source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                    style={styles.image}
                  />
                  <TouchableOpacity
                    style={styles.infoContainer}
                    onPress={() => {
                      setSelectedProduct(item);
                      setDetailsModalVisible(true);
                    }}
                  >
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.price}>₹{item.price}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button} onPress={() => handleAddToCart(item)}>
                    <Text style={styles.buttonText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
      />

      {/* Product Details Modal */}
      <Modal visible={detailsModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button (X) */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDetailsModalVisible(false)} // Close modal
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {selectedProduct && (
              <>
                <Image
                  source={typeof selectedProduct.image === 'string' ? { uri: selectedProduct.image } : selectedProduct.image}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                <Text style={styles.modalPrice}>₹{selectedProduct.price}</Text>
                <Text style={styles.modalDescription}>{selectedProduct.description}</Text> {/* Add Description */}
              </>
            )}

          </View>
        </View>
      </Modal>


      {/* Login Required Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button (X) */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}  // Close modal when X is pressed
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.modalText}>You need to log in to add items to the cart.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                router.push('/login');  // Redirect to login page
              }}
            >
              <Text style={styles.modalButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Footer Component */}
      <Footer totalPrice={totalPrice} />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    padding: 10,
    backgroundColor: '#F7F9F9',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F9F9', // Light background color
  },
  category: {
    paddingLeft: 20,
    paddingTop: 20,
    paddingRight: 20,
    borderRadius: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#00202e', // Title color using a strong shade from the palette
  },
  productcontainer: {
    marginBottom: 80,
  },
  product: {
    alignItems: 'center',
    marginBottom: 10,
    minWidth: 150,
    maxWidth: 180,
  
    marginRight: 20,
    backgroundColor: '#ffff', // White background for each product
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
  },

  infoContainer: {
    width: '100%', // Make sure it takes the full width
    alignItems: 'flex-start', // Align text to the left
    paddingHorizontal: 5, // Add some padding for spacing
  },

  name: {
    fontSize: 16,
    color: '#006ebd', // Text color for product name
    textAlign: 'left', // Align the text to the left
  },

  price: {
    fontSize: 15,
    color: '#00202e', // Use a cool, pleasant price color
    textAlign: 'left', // Align the text to the left
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#63D2FF', // Soft blue for buttons
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker overlay
  },
  modalContent: {
    backgroundColor: '#FFFFFF', // White background for modal content
    padding: 25, // Increased padding for better spacing
    borderRadius: 15, // Rounded corners
    alignItems: 'center',
    width: 320, // Slightly wider modal
    shadowColor: '#000', // Shadow for subtle depth
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // Shadow for Android
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#2081C3', // Title color for modal text
    fontWeight: '500',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#78D5D7', // Slightly different blue for modal button
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 15,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 5,
    padding: 5, // Adjusted margin for better spacing
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Ensure it is above modal content
  },
  closeButtonText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: 'contain',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00202e',
    textAlign: 'center',
  },

  modalPrice: {
    fontSize: 16,
    color: '#2081C3',
    textAlign: 'center',
    marginTop: 5,
  },

  modalDescription: { 
    textAlign: 'center',
  }
});
