import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop, Ellipse } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface SpotlightBackgroundProps {
  children: React.ReactNode;
}

export default function SpotlightBackground({ children }: SpotlightBackgroundProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Base Background Color */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#0F0E17' }]} />

      {/* Spotlight Effect */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
        <Svg height="100%" width="100%">
          <Defs>
            <RadialGradient
              id="spotlight"
              cx="50%"
              cy="-10%"
              rx="80%"
              ry="50%"
              fx="50%"
              fy="-10%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor="#7C6FFF" stopOpacity="0.25" />
              <Stop offset="0.5" stopColor="#7C6FFF" stopOpacity="0.05" />
              <Stop offset="1" stopColor="#0F0E17" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#spotlight)" />
        </Svg>
      </Animated.View>

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0E17',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});
