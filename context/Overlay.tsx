import { View, StyleSheet } from "react-native";

export function Overlay() {
  return <View style={styles.overlay} />;
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: "50%", // Position vertically at the center of the screen
    left: "50%", // Position horizontally at the center of the screen
    width: 200,  // Set width (fixed square size)
    height: 200, // Set height (fixed square size)
    marginTop: -100, // Offset by half of the height to fully center vertically
    marginLeft: -100, // Offset by half of the width to fully center horizontally
    borderWidth: 4,
    borderColor: "white",
    borderRadius: 10,
  },
});
