// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { account, databases } from '@/config/appwriteConfig';

// const CartContext = createContext(null);

// const DATABASE_ID = '67bd9cac0012d512b997';
// const COLLECTION_ID = '67bd9cb20007e2470135';

// export function CartProvider({ children }) {
//   const [cart, setCart] = useState([]);
//   const [userId, setUserId] = useState(null);
//   const [cartItems, setCartItems] = useState([]);

//   const resetCart = () => {
//     setCartItems([]);
//   };


//   // Fetch user session and cart on login
//   const fetchUserAndCart = async () => {
//     try {
//       const user = await account.get();
//       setUserId(user.$id);

//       // Fetch user's cart document
//       const cartData = await databases.getDocument(DATABASE_ID, COLLECTION_ID, user.$id);
//       setCart(cartData.items ? JSON.parse(cartData.items) : []);
//     } catch (error) {
//       console.log('No cart found, initializing empty cart.');
//       setCart([]); // Reset cart if no document found
//     }
//   };

//   // Load cart when component mounts
//   useEffect(() => {
//     fetchUserAndCart();
//   }, []);

//   // Save cart to Appwrite
//   const saveCartToDatabase = async (newCart) => {
//     if (!userId) return;

//     try {
//       let cartDoc;
//       try {
//         cartDoc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, userId);
//       } catch (error) {}

//       if (cartDoc) {
//         await databases.updateDocument(DATABASE_ID, COLLECTION_ID, userId, {
//           items: JSON.stringify(newCart),
//         });
//       } else {
//         await databases.createDocument(DATABASE_ID, COLLECTION_ID, userId, {
//           userId,
//           items: JSON.stringify(newCart),
//         });
//       }
//     } catch (error) {
//       console.error('Error saving cart:', error);
//     }
//   };

//   // Add item to cart and sync
//   const addToCart = async (item) => {
//     const updatedCart = [...cart, item];
//     setCart(updatedCart);
//     await saveCartToDatabase(updatedCart);
//   };

//   // Remove item from cart
//   const removeFromCart = async (id) => {
//     const updatedCart = cart.filter(item => item.id !== id);
//     setCart(updatedCart);
//     await saveCartToDatabase(updatedCart);
//   };

//   // Logout function (clears cart)
//   const logout = async () => {
//     try {
//       await account.deleteSession('current');
//       setUserId(null);
//       setCart([]); // Reset cart on logout
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };

//   return (
//     <CartContext.Provider value={{ cart, addToCart, removeFromCart, fetchUserAndCart, logout ,}}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   return useContext(CartContext);
// }

//new2

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { account, databases } from '@/config/appwriteConfig';

// const CartContext = createContext(null);

// const DATABASE_ID = '67bd9cac0012d512b997';
// const COLLECTION_ID = '67bd9cb20007e2470135';

// export function CartProvider({ children }) {
//   const [cart, setCart] = useState([]);
//   const [userId, setUserId] = useState(null);

//   // Fetch user session and cart on login
//   const fetchUserAndCart = async () => {
//     try {
//       const user = await account.get();
//       setUserId(user.$id);

//       // Fetch user's cart document
//       const cartData = await databases.getDocument(DATABASE_ID, COLLECTION_ID, user.$id);
//       setCart(cartData.items ? JSON.parse(cartData.items) : []);
//     } catch {
//       setCart([]); // Reset cart if no document found
//     }
//   };

//   useEffect(() => {
//     fetchUserAndCart();
//   }, []);

//   // Save cart to Appwrite
//   const saveCartToDatabase = async (newCart) => {
//     if (!userId) return;

//     try {
//       let cartDoc;
//       try {
//         cartDoc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, userId);
//       } catch (error) {}

//       if (cartDoc) {
//         await databases.updateDocument(DATABASE_ID, COLLECTION_ID, userId, {
//           items: JSON.stringify(newCart),
//         });
//       } else {
//         await databases.createDocument(DATABASE_ID, COLLECTION_ID, userId, {
//           userId,
//           items: JSON.stringify(newCart),
//         });
//       }
//     } catch (error) {
//       console.error('Error saving cart:', error);
//     }
//   };

//   // Add to cart (with quantity initialization)
//   const addToCart = async (product) => {
//     const existingProduct = cart.find((item) => item.id === product.id);
//     let updatedCart;

//     if (existingProduct) {
//       updatedCart = cart.map((item) =>
//         item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//     } else {
//       updatedCart = [...cart, { ...product, quantity: 1 }];
//     }

//     setCart(updatedCart);
//     await saveCartToDatabase(updatedCart);
//   };

//   // Increase Quantity
//   const increaseQuantity = async (id) => {
//     const updatedCart = cart.map((item) =>
//       item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//     );
//     setCart(updatedCart);
//     await saveCartToDatabase(updatedCart);
//   };

//   // Decrease Quantity (Remove if quantity reaches 0)
//   const decreaseQuantity = async (id) => {
//     const updatedCart = cart
//       .map((item) =>
//         item.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item
//       )
//       .filter((item) => item.quantity > 0);

//     setCart(updatedCart);
//     await saveCartToDatabase(updatedCart);
//   };

//   // Remove from cart
//   const removeFromCart = async (id) => {
//     const updatedCart = cart.filter((item) => item.id !== id);
//     setCart(updatedCart);
//     await saveCartToDatabase(updatedCart);
//   };

//   return (
//     <CartContext.Provider
//       value={{ cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   return useContext(CartContext);
// }



// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { account, databases } from '@/config/appwriteConfig';

// const CartContext = createContext(null);

// const DATABASE_ID = '67bd9cac0012d512b997';
// const COLLECTION_ID = '67bd9cb20007e2470135';

// export function CartProvider({ children }) {
//   const [cart, setCart] = useState([]); // Store cart items
//   const [userId, setUserId] = useState(null); // Store user ID
//   const [cartItems, setCartItems] = useState([]); // Unused, can be removed if not needed.

//   // Reset the cart (used in logout function)
//   const resetCart = () => {
//     setCart([]);
//   };

//   // Fetch user session and cart on login
//   const fetchUserAndCart = async () => {
//     try {
//       const user = await account.get();
//       setUserId(user.$id);

//       // Fetch user's cart document
//       const cartData = await databases.getDocument(DATABASE_ID, COLLECTION_ID, user.$id);
//       setCart(cartData.items ? JSON.parse(cartData.items) : []);
//     } catch (error) {
//       console.log('No cart found, initializing empty cart.');
//       setCart([]); // Reset cart if no document found
//     }
//   };

//   // Load cart when component mounts
//   useEffect(() => {
//     fetchUserAndCart();
//   }, []);

//   // Save cart to Appwrite
//   const saveCartToDatabase = async (newCart) => {
//     if (!userId) return;

//     try {
//       let cartDoc;
//       try {
//         cartDoc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, userId);
//       } catch (error) {}

//       if (cartDoc) {
//         await databases.updateDocument(DATABASE_ID, COLLECTION_ID, userId, {
//           items: JSON.stringify(newCart),
//         });
//       } else {
//         await databases.createDocument(DATABASE_ID, COLLECTION_ID, userId, {
//           userId,
//           items: JSON.stringify(newCart),
//         });
//       }
//     } catch (error) {
//       console.error('Error saving cart:', error);
//     }
//   };

//   // Add item to cart and sync
//   const addToCart = async (product) => {
//     const existingProduct = cart.find((item) => item.id === product.id);
//     let updatedCart;

//     if (existingProduct) {
//       updatedCart = cart.map((item) =>
//         item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//     } else {
//       updatedCart = [...cart, { ...product, quantity: 1 }];
//     }

//     setCart(updatedCart);
//     await saveCartToDatabase(updatedCart);
//   };

//   // Increase Quantity
//   const increaseQuantity = async (id) => {
//     const updatedCart = cart.map((item) =>
//       item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//     );
//     setCart(updatedCart);
//     await saveCartToDatabase(updatedCart);
//   };

//   // Decrease Quantity (Remove if quantity reaches 0)
//   const decreaseQuantity = async (id) => {
//     const updatedCart = cart
//       .map((item) =>
//         item.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item
//       )
//       .filter((item) => item.quantity > 0);

//     setCart(updatedCart);
//     await saveCartToDatabase(updatedCart);
//   };

//   // Remove item from cart
//   const removeFromCart = async (id) => {
//     const updatedCart = cart.filter((item) => item.id !== id);
//     setCart(updatedCart);
//     await saveCartToDatabase(updatedCart);
//   };

//   // Logout function (clears cart)
//   const logout = async () => {
//     try {
//       await account.deleteSession('current');
//       setUserId(null);
//       resetCart(); // Reset cart on logout
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         increaseQuantity,
//         decreaseQuantity,
//         removeFromCart,
//         fetchUserAndCart,
//         logout,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   return useContext(CartContext);
// }










import React, { createContext, useContext, useState, useEffect } from 'react';
import { account, databases } from '@/config/appwriteConfig';

const CartContext = createContext(null);

// Access the DATABASE_ID and COLLECTION_ID from environment variables
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID;

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]); // Store cart items
  const [userId, setUserId] = useState(null); // Store user ID

  // Reset the cart (used in logout function)
  const resetCart = () => {
    setCart([]);
  };

  // Fetch user session and cart on login
  const fetchUserAndCart = async () => {
    try {
      const user = await account.get();
      setUserId(user.$id);
  
      // Fetch user's cart document
      const cartData = await databases.getDocument(DATABASE_ID, COLLECTION_ID, user.$id);
      setCart(cartData.items ? JSON.parse(cartData.items) : []);
  
      return user; // ✅ Return the user object
    } catch (error) {
      console.log('No cart found, initializing empty cart.');
      setCart([]);
      return null; // ✅ Return null if user not found
    }
  };
  

  // Load cart when component mounts
  useEffect(() => {
    fetchUserAndCart();
  }, []);

  // Save cart to Appwrite
  const saveCartToDatabase = async (newCart) => {
    if (!userId) return;

    try {
      let cartDoc;
      try {
        cartDoc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, userId);
      } catch (error) {}

      if (cartDoc) {
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, userId, {
          items: JSON.stringify(newCart),
        });
      } else {
        await databases.createDocument(DATABASE_ID, COLLECTION_ID, userId, {
          userId,
          items: JSON.stringify(newCart),
        });
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  // Add item to cart and sync
  const addToCart = async (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    let updatedCart;

    if (existingProduct) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    await saveCartToDatabase(updatedCart);
  };

  // Increase Quantity
  const increaseQuantity = async (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    await saveCartToDatabase(updatedCart);
  };

  // Decrease Quantity (Remove if quantity reaches 0)
  const decreaseQuantity = async (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    await saveCartToDatabase(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = async (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    await saveCartToDatabase(updatedCart);
  };

  // Logout function (clears cart)
  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUserId(null);
      resetCart(); // Reset cart on logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const clearCart = async () => {
    setCart([]); // Reset cart in state
  };
  

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        fetchUserAndCart,
        logout,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}





// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { account, databases } from '@/config/appwriteConfig';

// const CartContext = createContext(null);

// // Access the DATABASE_ID and COLLECTION_ID from environment variables
// const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
// const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID;

// export function CartProvider({ children }) {
//   const [cart, setCart] = useState([]); // Store cart items
//   const [userId, setUserId] = useState(null); // Store user ID

//   // Reset the cart (used in logout function)
//   const resetCart = () => {
//     setCart([]);
//   };

//   // Fetch user session and cart on login
//   const fetchUserAndCart = async () => {
//     try {
//       const user = await account.get();
//       setUserId(user.$id);

//       // Fetch user's cart document
//       const cartData = await databases.getDocument(DATABASE_ID, COLLECTION_ID, user.$id);
//       setCart(cartData.items ? JSON.parse(cartData.items) : []);
//     } catch (error) {
//       console.log('No cart found, initializing empty cart.');
//       setCart([]); // Reset cart if no document found
//     }
//   };

//   // Fetch cart whenever the userId changes (on login)
//   useEffect(() => {
//     if (userId) {
//       fetchUserAndCart();
//     }
//   }, [userId]); // Fetch cart only when userId changes (login)

//   // Save cart to Appwrite
//   const saveCartToDatabase = async (newCart) => {
//     if (!userId) return;

//     try {
//       let cartDoc;
//       try {
//         cartDoc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, userId);
//       } catch (error) {}

//       if (cartDoc) {
//         await databases.updateDocument(DATABASE_ID, COLLECTION_ID, userId, {
//           items: JSON.stringify(newCart),
//         });
//       } else {
//         await databases.createDocument(DATABASE_ID, COLLECTION_ID, userId, {
//           userId,
//           items: JSON.stringify(newCart),
//         });
//       }
//     } catch (error) {
//       console.error('Error saving cart:', error);
//     }
//   };

//   // Add item to cart and sync
//   const addToCart = async (product) => {
//     const existingProduct = cart.find((item) => item.id === product.id);
//     let updatedCart;

//     if (existingProduct) {
//       updatedCart = cart.map((item) =>
//         item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//     } else {
//       updatedCart = [...cart, { ...product, quantity: 1 }];
//     }

//     setCart(updatedCart);
//     await saveCartToDatabase(updatedCart);
//   };

//   // Increase Quantity
//   const increaseQuantity = async (id) => {
//     const updatedCart = cart.map((item) =>
//       item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//     );
//     setCart(updatedCart);
//     await saveCartToDatabase(updatedCart);
//   };

//   // Decrease Quantity (Remove if quantity reaches 0)
//   const decreaseQuantity = async (id) => {
//     const updatedCart = cart
//       .map((item) =>
//         item.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item
//       )
//       .filter((item) => item.quantity > 0);

//     setCart(updatedCart);
//     await saveCartToDatabase(updatedCart);
//   };

//   // Remove item from cart
//   const removeFromCart = async (id) => {
//     const updatedCart = cart.filter((item) => item.id !== id);
//     setCart(updatedCart);
//     await saveCartToDatabase(updatedCart);
//   };

//   // Logout function (clears cart)
//   const logout = async () => {
//     try {
//       await account.deleteSession('current'); // Delete current session (logout)
//       setUserId(null); // Reset userId to null
//       resetCart(); // Reset cart on logout
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         increaseQuantity,
//         decreaseQuantity,
//         removeFromCart,
//         fetchUserAndCart,
//         logout,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   return useContext(CartContext);
// }
