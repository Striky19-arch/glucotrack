import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/colors';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  themeColors: typeof colors;
};

const THEME_STORAGE_KEY = '@theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  // Charger le thème sauvegardé au démarrage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        } else {
          // Si aucun thème n'est sauvegardé, utiliser le thème système
          setIsDarkMode(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du thème:', error);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  // Sauvegarder le thème lors du changement
  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du thème:', error);
    }
  };

  const themeColors = isDarkMode ? {
    ...colors,
    background: '#1A1A1A',
    white: '#2A2A2A',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textLight: '#808080',
    backgroundLight: '#333333',
    border: '#404040',
    shadow: '#000000',
  } : colors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 