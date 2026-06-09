import React from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native'; // 💡 修正：引入 StyleSheet 確保樣式標準化
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../theme/ThemeContext.js";

export default function AnimatedCheckButton({ isCompleted, onPress }) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true })
    ]).start();
    
    onPress();
  };

  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={handlePress} style={styles.taskcheck}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons
          name={isCompleted ? "checkmark-circle" : "ellipse-outline"}
          color={isCompleted ? theme.second : theme.primary}
          size={28}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  taskcheck: {
    marginRight: 0,
    justifyContent: 'center',
  },
});