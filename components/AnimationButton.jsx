import React from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AnimatedCheckButton({ isCompleted, onPress }) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true })
    ]).start();
    
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.taskcheck}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons
          name={isCompleted ? "checkmark-circle" : "ellipse-outline"}
          size={28}
          color={isCompleted ? "#a28fffdc" : "#f3acc1"}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = {
  taskcheck: {
    marginRight:0,
  },
};