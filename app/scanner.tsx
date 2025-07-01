// wqrwer weATGQRYTQEYHGQ QY56W




// import React, { useState } from 'react';
// import { CameraView } from 'expo-camera';
// import { Linking, Platform, SafeAreaView, StyleSheet, Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
// import { Stack } from 'expo-router';
// import { useCart } from '@/context/CartContext';  // Import useCart hook
// import { PRODUCTS } from '@/config/productData';  // Import PRODUCTS
// import { Overlay } from './Overlay';

// export default function ScannerScreen() {
//   const [hasScanned, setHasScanned] = useState(false);
//   const [scannedProduct, setScannedProduct] = useState(null);  // Store scanned product data
//   const [modalVisible, setModalVisible] = useState(false);  // Control modal visibility
//   const { addToCart } = useCart();  // Access addToCart function from context

//   const handleBarcodeScanned = async ({ data }) => {
//     if (hasScanned) return; // Prevent scanning again if already scanned

//     setHasScanned(true);  // Mark as scanned

//     try {
//       // Parse the QR code data (assuming the data is in JSON format)
//       const productData = JSON.parse(data);

//       // Check if the scanned data matches any product in the PRODUCTS list
//       const productCategory = Object.values(PRODUCTS).flat();  // Flatten the product categories into a single array
//       const product = productCategory.find(item => item.id === productData.id);

//       if (product) {
//         setScannedProduct(product);  // Set the scanned product details
//         setModalVisible(true);  // Show the modal to add the product to the cart
//       } else {
//         Alert.alert('Product not found', 'The scanned QR code does not match any product.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Something went wrong while scanning the QR code.');
//       setHasScanned(false);  // Reset the scanning state in case of error
//     }
//   };

//   const handleAddToCart = () => {
//     if (scannedProduct) {
//       addToCart(scannedProduct);  // Add the scanned product to the cart
//       setModalVisible(false);  // Close the modal after adding
//       Alert.alert('Success', `${scannedProduct.name} has been added to the cart!`);
//     }
//   };

//   return (
//     <SafeAreaView style={StyleSheet.absoluteFillObject}>
//       {Platform.OS === 'android' && <Stack.Screen />}
//       <CameraView
//         style={StyleSheet.absoluteFillObject}
//         facing="back"
//         onBarcodeScanned={handleBarcodeScanned}
//       />
//       <Overlay />

//       {/* Product Add Modal */}
//       <Modal visible={modalVisible} transparent animationType="fade">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             {scannedProduct && (
//               <>
//                 <Text style={styles.modalTitle}>{scannedProduct.name}</Text>
//                 <Text style={styles.modalPrice}>Price: ₹{scannedProduct.price}</Text>
//                 <TouchableOpacity style={styles.modalButton} onPress={handleAddToCart}>
//                   <Text style={styles.modalButtonText}>Add to Cart</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.modalButton}
//                   onPress={() => setModalVisible(false)} // Close modal
//                 >
//                   <Text style={styles.modalButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//     width: 300,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   modalPrice: {
//     fontSize: 16,
//     marginBottom: 20,
//   },
//   modalButton: {
//     backgroundColor: '#007BFF',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   modalButtonText: {
//     color: 'white',
//     fontSize: 16,
//   },
// });








// ewrfwehfwAET NQJTNRJKTG


// import React, { useState } from 'react';
// import { CameraView } from 'expo-camera';
// import { Linking, Platform, SafeAreaView, StyleSheet, Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
// import { Stack } from 'expo-router';
// import { useRouter } from 'expo-router';  // Import useRouter to handle navigation
// import { useCart } from '@/context/CartContext';  // Import useCart hook
// import { PRODUCTS } from '@/config/productData';  // Import PRODUCTS
// import { account } from '@/config/appwriteConfig';  // To check if the user is logged in
// import { Overlay } from './Overlay';

// export default function ScannerScreen() {
//   const [hasScanned, setHasScanned] = useState(false);
//   const [scannedProduct, setScannedProduct] = useState(null);  // Store scanned product data
//   const [modalVisible, setModalVisible] = useState(false);  // Control modal visibility
//   const [loginModalVisible, setLoginModalVisible] = useState(false);  // Control login modal visibility
//   const { addToCart } = useCart();  // Access addToCart function from context
//   const [user, setUser] = useState(null);  // State to hold user information
//   const router = useRouter();  // Hook for navigation

//   // Check if the user is logged in
//   const checkUserLogin = async () => {
//     try {
//       const userData = await account.get();  // Get current user info
//       setUser(userData);  // Set user data if logged in
//     } catch (error) {
//       setUser(null);  // No user found, so user is not logged in
//     }
//   };

//   React.useEffect(() => {
//     checkUserLogin();  // Check user login status on component mount
//   }, []);

//   const handleBarcodeScanned = async ({ data }) => {
//     if (hasScanned) return; // Prevent scanning again if already scanned

//     setHasScanned(true);  // Mark as scanned

//     try {
//       // Parse the QR code data (assuming the data is in JSON format)
//       const productData = JSON.parse(data);

//       // Check if the scanned data matches any product in the PRODUCTS list
//       const productCategory = Object.values(PRODUCTS).flat();  // Flatten the product categories into a single array
//       const product = productCategory.find(item => item.id === productData.id);

//       if (product) {
//         setScannedProduct(product);  // Set the scanned product details
//         if (user) {
//           setModalVisible(true);  // Show the modal to add the product to the cart if the user is logged in
//         } else {
//           setLoginModalVisible(true);  // Show login modal if the user is not logged in
//         }
//       } else {
//         Alert.alert('Product not found', 'The scanned QR code does not match any product.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Something went wrong while scanning the QR code.');
//       setHasScanned(false);  // Reset the scanning state in case of error
//     }
//   };

//   const handleAddToCart = () => {
//     if (scannedProduct) {
//       addToCart(scannedProduct);  // Add the scanned product to the cart
//       setModalVisible(false);  // Close the modal after adding
//       Alert.alert('Success', `${scannedProduct.name} has been added to the cart!`);
//     }
//   };

//   const handleLoginRedirect = () => {
//     // Close the login modal and redirect to the login screen
//     setLoginModalVisible(false);
//     router.push('/login');  // Redirect to the login screen
//   };

//   return (
//     <SafeAreaView style={StyleSheet.absoluteFillObject}>
//       {Platform.OS === 'android' && <Stack.Screen />}
//       <CameraView
//         style={StyleSheet.absoluteFillObject}
//         facing="back"
//         onBarcodeScanned={handleBarcodeScanned}
//       />
//       <Overlay />

//       {/* Product Add Modal */}
//       <Modal visible={modalVisible} transparent animationType="fade">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             {scannedProduct && (
//               <>
//                 <Text style={styles.modalTitle}>{scannedProduct.name}</Text>
//                 <Text style={styles.modalPrice}>Price: ₹{scannedProduct.price}</Text>
//                 <TouchableOpacity style={styles.modalButton} onPress={handleAddToCart}>
//                   <Text style={styles.modalButtonText}>Add to Cart</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.modalButton}
//                   onPress={() => setModalVisible(false)} // Close modal
//                 >
//                   <Text style={styles.modalButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>

//       {/* Login Required Modal */}
//       <Modal visible={loginModalVisible} transparent animationType="fade">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalText}>You need to log in to add items to the cart.</Text>
//             <TouchableOpacity
//               style={styles.modalButton}
//               onPress={handleLoginRedirect}  // Redirect to login screen
//             >
//               <Text style={styles.modalButtonText}>Go to Login</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.modalButton}
//               onPress={() => setLoginModalVisible(false)} // Close modal
//             >
//               <Text style={styles.modalButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//     width: 300,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   modalPrice: {
//     fontSize: 16,
//     marginBottom: 20,
//   },
//   modalText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   modalButton: {
//     backgroundColor: '#007BFF',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   modalButtonText: {
//     color: 'white',
//     fontSize: 16,
//   },
// });







// wsf fgdwagrwtuthwujgnersaynerkyhiuyrygner

import React, { useState } from 'react';
import { CameraView } from 'expo-camera';
import { Linking, Platform, SafeAreaView, StyleSheet, Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';  // Import useRouter to handle navigation
import { useCart } from '@/context/CartContext';  // Import useCart hook
import { PRODUCTS } from '@/config/productData';  // Import PRODUCTS
import { account } from '@/config/appwriteConfig';  // To check if the user is logged in
import { Overlay } from '@/context/Overlay';

export default function ScannerScreen() {
  const [hasScanned, setHasScanned] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);  // Store scanned product data
  const [modalVisible, setModalVisible] = useState(false);  // Control modal visibility
  const [loginModalVisible, setLoginModalVisible] = useState(false);  // Control login modal visibility
  const { addToCart } = useCart();  // Access addToCart function from context
  const [user, setUser] = useState(null);  // State to hold user information
  const router = useRouter();  // Hook for navigation

  // Check if the user is logged in
  const checkUserLogin = async () => {
    try {
      const userData = await account.get();  // Get current user info
      setUser(userData);  // Set user data if logged in
    } catch (error) {
      setUser(null);  // No user found, so user is not logged in
    }
  };

  React.useEffect(() => {
    checkUserLogin();  // Check user login status on component mount
  }, []);

  const handleBarcodeScanned = async ({ data }) => {
    if (hasScanned) return; // Prevent scanning again if already scanned

    setHasScanned(true);  // Mark as scanned

    try {
      // Parse the QR code data (assuming the data is in JSON format)
      const productData = JSON.parse(data);

      // Check if the scanned data matches any product in the PRODUCTS list
      const productCategory = Object.values(PRODUCTS).flat();  // Flatten the product categories into a single array
      const product = productCategory.find(item => item.id === productData.id);

      if (product) {
        setScannedProduct(product);  // Set the scanned product details
        if (user) {
          setModalVisible(true);  // Show the modal to add the product to the cart if the user is logged in
        } else {
          setLoginModalVisible(true);  // Show login modal if the user is not logged in
        }
      } else {
        Alert.alert('Product not found', 'The scanned QR code does not match any product.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while scanning the QR code.');
      setHasScanned(false);  // Reset the scanning state in case of error
    }
  };

  const handleAddToCart = () => {
    if (scannedProduct) {
      addToCart(scannedProduct);  // Add the scanned product to the cart
      setModalVisible(false);  // Close the modal after adding
      Alert.alert('Success', `${scannedProduct.name} has been added to the cart!`);
      setHasScanned(false);  // Reset scanner state to allow scanning again
    }
  };

  const handleLoginRedirect = () => {
    // Close the login modal and redirect to the login screen
    setLoginModalVisible(false);
    router.push('/login');  // Redirect to the login screen
  };

  const handleCloseModal = () => {
    setModalVisible(false);  // Close modal
    setHasScanned(false);  // Reset scanner to allow for a new scan
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      {Platform.OS === 'android' && <Stack.Screen />}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}
      />
      <Overlay />

      {/* Product Add Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {scannedProduct && (
              <>
                <Text style={styles.modalTitle}>{scannedProduct.name}</Text>
                <Text style={styles.modalPrice}>Price: ₹{scannedProduct.price}</Text>
                <TouchableOpacity style={styles.modalButton} onPress={handleAddToCart}>
                  <Text style={styles.modalButtonText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleCloseModal} // Close modal and reset scanner
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Login Required Modal */}
      <Modal visible={loginModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>You need to log in to add items to the cart.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleLoginRedirect}  // Redirect to login screen
            >
              <Text style={styles.modalButtonText}>Go to Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setLoginModalVisible(false)} // Close modal
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
