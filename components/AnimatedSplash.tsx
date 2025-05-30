import { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  useSharedValue,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface AnimatedSplashProps {
  onAnimationComplete: () => void;
}

const AnimatedSplash = ({ onAnimationComplete }: AnimatedSplashProps) => {
  // Valeurs animées
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  // Style animé
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    // Animation de zoom et fondu
    scale.value = withSequence(
      withTiming(1.2, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
      withTiming(1, { duration: 500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
    );
    opacity.value = withDelay(
      200,
      withTiming(1, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }, () => {
        // Appeler onAnimationComplete après l'animation
        runOnJS(onAnimationComplete)();
      })
    );
  }, []);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Image
        source={require('../assets/images/favicon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
  },
  logo: {
    width: Math.min(screenWidth * 0.6, 300),
    height: Math.min(screenWidth * 0.6, 300),
  },
});

export default AnimatedSplash; 