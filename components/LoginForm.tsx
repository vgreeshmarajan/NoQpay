import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';
import { account } from '@/config/appwriteConfig';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'expo-router';

interface CartContextType {
  fetchUserAndCart?: () => Promise<void>;
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const cartContext = useCart();
  const { fetchUserAndCart } = (cartContext || {}) as CartContextType;
  const router = useRouter();

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  // Validate password
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    // Email validation
    if (!validateEmail(email)) {
      setModalMessage('Please enter a valid email address.');
      setModalVisible(true);
      return;
    }

    // Password validation
    if (!validatePassword(password)) {
      setModalMessage('Password must be at least 6 characters long.');
      setModalVisible(true);
      return;
    }

    try {
      await account.createEmailPasswordSession(email, password);
      await fetchUserAndCart?.();
      router.replace('/');
    } catch (error: any) {
      setModalMessage(error?.message || 'Login failed. Please try again.');
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/icon.png")} style={styles.logo} />
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image source={require('@/assets/images/icon.png')} style={styles.alertImage} />
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    padding: 12,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1D3D47',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    marginTop: 10,
    color: '#1D3D47',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertImage: {
    width: 50,
    height: 50,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#1D3D47',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logo: { 
    width: 500,
    height: 500, 
    marginBottom: -150,
  },
});
