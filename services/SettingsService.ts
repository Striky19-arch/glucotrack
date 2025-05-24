// This is a simplified mock of a settings service
// In a real app, you would use AsyncStorage or another storage mechanism

import AsyncStorage from '@react-native-async-storage/async-storage';

type Profile = {
  age: string;
  weight: string;
  height: string;
  gender: 'male' | 'female';
};

type Thresholds = {
  bloodLow: string;
  bloodHigh: string;
  urineLow: string;
  urineHigh: string;
};

type Preferences = {
  unit: 'mg/dL' | 'mmol/L';
  notifications: boolean;
  darkMode: boolean;
};

class SettingsServiceClass {
  private PROFILE_KEY = 'user_profile';
  private THRESHOLDS_KEY = 'glucose_thresholds';
  private PREFERENCES_KEY = 'app_preferences';

  constructor() {
    console.log('Settings service initialized');
    
    // Initialize with defaults if not set
    this.initializeDefaults();
  }

  private async initializeDefaults() {
    // Check if profile exists, if not set defaults
    const profileJson = await AsyncStorage.getItem(this.PROFILE_KEY);
    if (!profileJson) {
      const defaultProfile: Profile = {
        age: '',
        weight: '',
        height: '',
        gender: 'male',
      };
      await AsyncStorage.setItem(this.PROFILE_KEY, JSON.stringify(defaultProfile));
    }
    
    // Check if thresholds exist, if not set defaults
    const thresholdsJson = await AsyncStorage.getItem(this.THRESHOLDS_KEY);
    if (!thresholdsJson) {
      const defaultThresholds: Thresholds = {
        bloodLow: '70',
        bloodHigh: '140',
        urineLow: '0',
        urineHigh: '15',
      };
      await AsyncStorage.setItem(this.THRESHOLDS_KEY, JSON.stringify(defaultThresholds));
    }
    
    // Check if preferences exist, if not set defaults
    const preferencesJson = await AsyncStorage.getItem(this.PREFERENCES_KEY);
    if (!preferencesJson) {
      const defaultPreferences: Preferences = {
        unit: 'mg/dL',
        notifications: true,
        darkMode: false,
      };
      await AsyncStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(defaultPreferences));
    }
  }

  // Profile Methods
  
  public async getProfile(): Promise<Profile | null> {
    try {
      const json = await AsyncStorage.getItem(this.PROFILE_KEY);
      return json ? JSON.parse(json) : null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }

  public async saveProfile(profile: Profile): Promise<boolean> {
    try {
      await AsyncStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      return false;
    }
  }

  // Thresholds Methods
  
  public async getThresholds(): Promise<Thresholds | null> {
    try {
      const json = await AsyncStorage.getItem(this.THRESHOLDS_KEY);
      return json ? JSON.parse(json) : null;
    } catch (error) {
      console.error('Error getting thresholds:', error);
      return null;
    }
  }

  public async saveThresholds(thresholds: Thresholds): Promise<boolean> {
    try {
      await AsyncStorage.setItem(this.THRESHOLDS_KEY, JSON.stringify(thresholds));
      return true;
    } catch (error) {
      console.error('Error saving thresholds:', error);
      return false;
    }
  }

  // Preferences Methods
  
  public async getPreferences(): Promise<Preferences | null> {
    try {
      const json = await AsyncStorage.getItem(this.PREFERENCES_KEY);
      return json ? JSON.parse(json) : null;
    } catch (error) {
      console.error('Error getting preferences:', error);
      return null;
    }
  }

  public async savePreferences(preferences: Preferences): Promise<boolean> {
    try {
      await AsyncStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      return false;
    }
  }

  // Utility methods
  
  // Convert between mg/dL and mmol/L
  public convertGlucoseUnit(value: number, fromUnit: 'mg/dL' | 'mmol/L'): number {
    if (fromUnit === 'mg/dL') {
      // Convert mg/dL to mmol/L
      return parseFloat((value / 18).toFixed(1));
    } else {
      // Convert mmol/L to mg/dL
      return Math.round(value * 18);
    }
  }

  // Calculate BMI
  public calculateBMI(weight: number, height: number): number {
    if (weight <= 0 || height <= 0) return 0;
    
    // BMI formula: weight (kg) / (height (m))²
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }

  // Get BMI category
  public getBMICategory(bmi: number): string {
    if (bmi <= 0) return 'Indéterminé';
    if (bmi < 18.5) return 'Insuffisance pondérale';
    if (bmi < 25) return 'Poids normal';
    if (bmi < 30) return 'Surpoids';
    return 'Obésité';
  }
}

// Export a singleton instance
export const SettingsService = new SettingsServiceClass();