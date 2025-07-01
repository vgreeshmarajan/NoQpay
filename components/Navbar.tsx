import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';

interface NavbarProps {
  totalPrice: number;
  user: any;
  handleAuthAction: () => Promise<void>;
}

export default function Navbar({ totalPrice, user, handleAuthAction }: NavbarProps) {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleScanClick = () => {
    if (permission?.granted) {
      router.push('/scanner');
    } else {
      setModalVisible(true);
    }
  };

  const handlePermissionRequest = async () => {
    const { granted } = await requestPermission();
    if (granted) {
      router.push('/scanner');
    } else {
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.navbar}>
      <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
      <View style={styles.navRight}>
        <TouchableOpacity style={styles.scanButton} onPress={handleScanClick}>
          <Image
            source={require('../assets/images/qrscan.png')}
            style={styles.qrImage}
          />
          <Text style={styles.buttonText}>Scan QR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.authButton} onPress={handleAuthAction}>
          <Text style={styles.buttonText}>{user ? 'Logout' : 'Login'}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal to request camera permission */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>We need access to your camera to scan QR codes.</Text>
            <Pressable onPress={handlePermissionRequest} style={styles.modalButton}>
              <Text style={styles.buttonText}>Grant Permission</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logo: {
    width: 190,
    height: 190,
    margin: -40,
    resizeMode: 'contain',
  },
  navRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#63D2FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  qrImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  authButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2081C3',
  },
  modalButton: {
    backgroundColor: '#78D5D7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
});
