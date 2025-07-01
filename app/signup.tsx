import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import SignupForm from '../components/SignupForm';

export default function SignupScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SignupForm router={router} />
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
  }
});
