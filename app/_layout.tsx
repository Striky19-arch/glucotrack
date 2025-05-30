import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import AnimatedSplash from '../components/AnimatedSplash';

// Garder le splash screen visible pendant l'animation
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { themeColors } = useTheme();
  const [isReady, setIsReady] = useState(false);
  useFrameworkReady();

  const handleAnimationComplete = async () => {
    await SplashScreen.hideAsync();
    setIsReady(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      {!isReady && <AnimatedSplash onAnimationComplete={handleAnimationComplete} />}
      <SafeAreaProvider>
        <Stack screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: themeColors.background }
        }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={themeColors.background === '#1A1A1A' ? 'light' : 'dark'} />
      </SafeAreaProvider>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}