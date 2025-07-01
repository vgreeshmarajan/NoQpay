import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import LoginForm from '../components/LoginForm';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LoginForm router={router} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F9F9',
  },
});
