import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProductCardProps {
  name: string;
  price: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price }) => {
  return (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.productPrice}>{price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
  },
});

export default ProductCard;
