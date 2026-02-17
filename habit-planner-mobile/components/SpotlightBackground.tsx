import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Spotlight Blob
const SpotlightBlob = ({ 
  style, 
  duration, 
  delay, 
  initialX, 
  initialY, 
  colors 
}: { 
  style: any, 
  duration: number, 
  delay: number, 
  initialX: number, 
  initialY: number, 
  colors: string[] 
}) => {
  const transX = useRef(new Animated.Value(0)).current; 
  const transY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Random movement simulation using loops
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(transX, {
              toValue: (Math.random() - 0.5) * 100, // Move somewhat randomly
              duration: duration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin),
            }),
            Animated.timing(transY, {
              toValue: (Math.random() - 0.5) * 100,
              duration: duration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin),
            }),
            Animated.timing(rotate, {
              toValue: (Math.random() - 0.5) * 20, // Rotate slightly
              duration: duration * 1.2,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin),
            }),
          ]),
          Animated.parallel([
            Animated.timing(transX, {
              toValue: 0,
              duration: duration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin),
            }),
            Animated.timing(transY, {
              toValue: 0,
              duration: duration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin),
            }),
            Animated.timing(rotate, {
              toValue: 0,
              duration: duration * 1.2,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin),
            }),
          ]),
        ])
      ).start();
    };

    setTimeout(() => {
      animate();
    }, delay * 1000); // Convert sec to ms
  }, []);

  const rotateStr = rotate.interpolate({
    inputRange: [-20, 20],
    outputRange: ['-20deg', '20deg'],
  });

  return (
    <Animated.View
      style={[
        styles.blob,
        style,
        {
          left: initialX,
          top: initialY,
          transform: [
            { translateX: transX },
            { translateY: transY },
            { rotate: rotateStr },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={colors as any}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
};

interface SpotlightBackgroundProps {
  children: React.ReactNode;
}

export default function SpotlightBackground({ children }: SpotlightBackgroundProps) {
  // We use multiple layers of fuzzy, moving gradients to simulate the spotlight effect
  // typically seen in Aceternity/UI designs.
  
  return (
    <View style={styles.container}>
      {/* Base Background */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#0F0E17' }]} />

      {/* Moving Blobs */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* Top Left Blob (Purple) */}
        <SpotlightBlob
          duration={12000}
          delay={0}
          initialX={-width * 0.4}
          initialY={-height * 0.2}
          colors={['rgba(124, 111, 255, 0.35)', 'transparent']}
          style={{ width: width * 1.2, height: height * 0.8, borderRadius: width * 0.6 }}
        />
        
        {/* Top Right Blob (Cyan/Teal hint) */}
        <SpotlightBlob
          duration={15000}
          delay={3}
          initialX={width * 0.2}
          initialY={-height * 0.3}
          colors={['rgba(78, 205, 196, 0.25)', 'transparent']}
          style={{ width: width * 1.0, height: height * 0.8, borderRadius: width * 0.5 }}
        />

        {/* Center/Bottom Blob (Warm/Gold hint) */}
        <SpotlightBlob
          duration={18000}
          delay={5}
          initialX={-width * 0.1}
          initialY={height * 0.1}
          colors={['rgba(255, 180, 67, 0.15)', 'transparent']}
          style={{ width: width * 1.5, height: height * 0.6, borderRadius: width * 0.75 }}
        />
      </View>
      
      {/* Overlay for smoothing */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(15, 14, 23, 0.3)' }]} />

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
    overflow: 'hidden', // Important to clip blobs
  },
  content: {
    flex: 1,
    zIndex: 10, // Ensure content is above background
  },
  blob: {
    position: 'absolute',
    opacity: 0.8,
    // Add blur effect if supported on platform, otherwise rely on gradient alpha
    // On web: filter: blur(100px)
    // On native: hard to blur view, so use very soft gradient or specialized blur view
    // Here we rely on large, soft LinearGradients with transparency.
  },
});
