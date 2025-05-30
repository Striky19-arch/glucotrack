import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { Save, ChevronRight, Bell, Clock, FileSliders as Sliders, Ruler, LifeBuoy } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { SettingsService } from '@/services/SettingsService';
import { BMICalculator } from '@/components/BMICalculator';
import { useTheme } from '@/contexts/ThemeContext';

type Profile = {
  age: string;
  weight: string;
  height: string;
  gender: 'male' | 'female';
};

type Preferences = {
  unit: 'mg/dL' | 'mmol/L';
  notifications: boolean;
  darkMode: boolean;
};

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme, themeColors } = useTheme();
  const [profile, setProfile] = useState<Profile>({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
  });
  
  const [thresholds, setThresholds] = useState({
    bloodLow: '70',
    bloodHigh: '140',
    urineLow: '0',
    urineHigh: '15',
  });
  
  const [preferences, setPreferences] = useState<Preferences>({
    unit: 'mg/dL',
    notifications: true,
    darkMode: false,
  });

  // Load settings from storage
  useEffect(() => {
    const loadSettings = async () => {
      const savedProfile = await SettingsService.getProfile();
      const savedThresholds = await SettingsService.getThresholds();
      const savedPreferences = await SettingsService.getPreferences();
      
      if (savedProfile) setProfile(savedProfile);
      if (savedThresholds) setThresholds(savedThresholds);
      if (savedPreferences) {
        setPreferences(savedPreferences);
        if (savedPreferences.darkMode !== isDarkMode) {
          toggleTheme();
        }
      }
    };
    
    loadSettings();
  }, []);

  // Save profile changes
  const saveProfile = async () => {
    await SettingsService.saveProfile(profile);
    // Show success message
  };

  // Save threshold changes
  const saveThresholds = async () => {
    await SettingsService.saveThresholds(thresholds);
    // Show success message
  };

  // Toggle preferences
  const toggleNotifications = (value: boolean) => {
    const updatedPreferences = { ...preferences, notifications: value };
    setPreferences(updatedPreferences);
    SettingsService.savePreferences(updatedPreferences);
  };

  const toggleDarkMode = (value: boolean) => {
    const updatedPreferences = { ...preferences, darkMode: value };
    setPreferences(updatedPreferences);
    SettingsService.savePreferences(updatedPreferences);
    toggleTheme();
  };

  // Change unit
  const changeUnit = (unit: 'mg/dL' | 'mmol/L') => {
    const updatedPreferences = { ...preferences, unit };
    setPreferences(updatedPreferences);
    SettingsService.savePreferences(updatedPreferences);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Stack.Screen
        options={{
          title: 'Paramètres',
          headerShown: true,
          headerStyle: {
            backgroundColor: themeColors.white,
          },
          headerTitleStyle: {
            color: themeColors.text,
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Profil personnel</Text>
        
        <View style={[styles.card, { backgroundColor: themeColors.white }]}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>Âge</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: themeColors.border,
                color: themeColors.text,
                backgroundColor: themeColors.backgroundLight,
              }]}
              value={profile.age}
              onChangeText={(text) => setProfile({ ...profile, age: text })}
              keyboardType="numeric"
              placeholder="Âge en années"
              placeholderTextColor={themeColors.textLight}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>Poids (kg)</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: themeColors.border,
                color: themeColors.text,
                backgroundColor: themeColors.backgroundLight,
              }]}
              value={profile.weight}
              onChangeText={(text) => setProfile({ ...profile, weight: text })}
              keyboardType="numeric"
              placeholder="Poids en kg"
              placeholderTextColor={themeColors.textLight}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>Taille (cm)</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: themeColors.border,
                color: themeColors.text,
                backgroundColor: themeColors.backgroundLight,
              }]}
              value={profile.height}
              onChangeText={(text) => setProfile({ ...profile, height: text })}
              keyboardType="numeric"
              placeholder="Taille en cm"
              placeholderTextColor={themeColors.textLight}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>Genre</Text>
            <View style={[styles.genderSelector, { borderColor: themeColors.border }]}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  profile.gender === 'male' && { backgroundColor: themeColors.primary },
                ]}
                onPress={() => setProfile({ ...profile, gender: 'male' })}
              >
                <Text
                  style={[
                    styles.genderText,
                    { color: profile.gender === 'male' ? themeColors.white : themeColors.text },
                  ]}
                >
                  Homme
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  profile.gender === 'female' && { backgroundColor: themeColors.primary },
                ]}
                onPress={() => setProfile({ ...profile, gender: 'female' })}
              >
                <Text
                  style={[
                    styles.genderText,
                    { color: profile.gender === 'female' ? themeColors.white : themeColors.text },
                  ]}
                >
                  Femme
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <BMICalculator 
            weight={parseFloat(profile.weight) || 0}
            height={parseFloat(profile.height) || 0}
          />
          
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: themeColors.primary }]} 
            onPress={saveProfile}
          >
            <Save size={18} color={themeColors.white} />
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Valeurs seuils</Text>
        
        <View style={[styles.card, { backgroundColor: themeColors.white }]}>
          <Text style={[styles.subSectionTitle, { color: themeColors.text }]}>Glycémie sanguine</Text>
          
          <View style={styles.thresholdContainer}>
            <View style={styles.thresholdGroup}>
              <Text style={[styles.thresholdLabel, { color: themeColors.textSecondary }]}>Seuil bas</Text>
              <View style={[styles.thresholdInputContainer, { borderColor: themeColors.border }]}>
                <TextInput
                  style={[styles.thresholdInput, { 
                    color: themeColors.text,
                    backgroundColor: themeColors.backgroundLight,
                  }]}
                  value={thresholds.bloodLow}
                  onChangeText={(text) => setThresholds({ ...thresholds, bloodLow: text })}
                  keyboardType="numeric"
                />
                <Text style={[styles.unitText, { color: themeColors.textSecondary }]}>
                  {preferences.unit}
                </Text>
              </View>
            </View>
            
            <View style={styles.thresholdGroup}>
              <Text style={[styles.thresholdLabel, { color: themeColors.textSecondary }]}>Seuil haut</Text>
              <View style={[styles.thresholdInputContainer, { borderColor: themeColors.border }]}>
                <TextInput
                  style={[styles.thresholdInput, { 
                    color: themeColors.text,
                    backgroundColor: themeColors.backgroundLight,
                  }]}
                  value={thresholds.bloodHigh}
                  onChangeText={(text) => setThresholds({ ...thresholds, bloodHigh: text })}
                  keyboardType="numeric"
                />
                <Text style={[styles.unitText, { color: themeColors.textSecondary }]}>
                  {preferences.unit}
                </Text>
              </View>
            </View>
          </View>
          
          <Text style={[styles.subSectionTitle, { color: themeColors.text }]}>Glucose urinaire</Text>
          
          <View style={styles.thresholdContainer}>
            <View style={styles.thresholdGroup}>
              <Text style={[styles.thresholdLabel, { color: themeColors.textSecondary }]}>Seuil bas</Text>
              <View style={[styles.thresholdInputContainer, { borderColor: themeColors.border }]}>
                <TextInput
                  style={[styles.thresholdInput, { 
                    color: themeColors.text,
                    backgroundColor: themeColors.backgroundLight,
                  }]}
                  value={thresholds.urineLow}
                  onChangeText={(text) => setThresholds({ ...thresholds, urineLow: text })}
                  keyboardType="numeric"
                />
                <Text style={[styles.unitText, { color: themeColors.textSecondary }]}>
                  {preferences.unit}
                </Text>
              </View>
            </View>
            
            <View style={styles.thresholdGroup}>
              <Text style={[styles.thresholdLabel, { color: themeColors.textSecondary }]}>Seuil haut</Text>
              <View style={[styles.thresholdInputContainer, { borderColor: themeColors.border }]}>
                <TextInput
                  style={[styles.thresholdInput, { 
                    color: themeColors.text,
                    backgroundColor: themeColors.backgroundLight,
                  }]}
                  value={thresholds.urineHigh}
                  onChangeText={(text) => setThresholds({ ...thresholds, urineHigh: text })}
                  keyboardType="numeric"
                />
                <Text style={[styles.unitText, { color: themeColors.textSecondary }]}>
                  {preferences.unit}
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: themeColors.primary }]} 
            onPress={saveThresholds}
          >
            <Save size={18} color={themeColors.white} />
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Préférences</Text>
        
        <View style={[styles.card, { backgroundColor: themeColors.white }]}>
          <View style={styles.settingRow}>
            <View style={[styles.settingIconContainer, { backgroundColor: themeColors.backgroundLight }]}>
              <Ruler size={20} color={themeColors.primary} />
            </View>
            <Text style={[styles.settingLabel, { color: themeColors.text }]}>Unité de mesure</Text>
            <View style={[styles.unitSelector, { borderColor: themeColors.border }]}>
              <TouchableOpacity
                style={[
                  styles.unitOption,
                  preferences.unit === 'mg/dL' && { backgroundColor: themeColors.primary },
                ]}
                onPress={() => changeUnit('mg/dL')}
              >
                <Text
                  style={[
                    styles.unitOptionText,
                    { color: preferences.unit === 'mg/dL' ? themeColors.white : themeColors.text },
                  ]}
                >
                  mg/dL
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.unitOption,
                  preferences.unit === 'mmol/L' && { backgroundColor: themeColors.primary },
                ]}
                onPress={() => changeUnit('mmol/L')}
              >
                <Text
                  style={[
                    styles.unitOptionText,
                    { color: preferences.unit === 'mmol/L' ? themeColors.white : themeColors.text },
                  ]}
                >
                  mmol/L
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
          
          <View style={styles.settingRow}>
            <View style={[styles.settingIconContainer, { backgroundColor: themeColors.backgroundLight }]}>
              <Bell size={20} color={themeColors.primary} />
            </View>
            <Text style={[styles.settingLabel, { color: themeColors.text }]}>Notifications</Text>
            <Switch
              value={preferences.notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: themeColors.backgroundLight, true: themeColors.primary }}
              thumbColor={themeColors.white}
            />
          </View>
          
          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
          
          <View style={styles.settingRow}>
            <View style={[styles.settingIconContainer, { backgroundColor: themeColors.backgroundLight }]}>
              <Clock size={20} color={themeColors.primary} />
            </View>
            <Text style={[styles.settingLabel, { color: themeColors.text }]}>Mode sombre</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: themeColors.backgroundLight, true: themeColors.primary }}
              thumbColor={themeColors.white}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Support</Text>
        
        <View style={[styles.card, { backgroundColor: themeColors.white }]}>
          <TouchableOpacity style={styles.supportRow}>
            <View style={[styles.supportIconContainer, { backgroundColor: themeColors.backgroundLight }]}>
              <LifeBuoy size={20} color={themeColors.primary} />
            </View>
            <Text style={[styles.supportLabel, { color: themeColors.text }]}>Aide et documentation</Text>
            <ChevronRight size={20} color={themeColors.textLight} />
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
          
          <TouchableOpacity style={styles.supportRow}>
            <View style={[styles.supportIconContainer, { backgroundColor: themeColors.backgroundLight }]}>
              <Sliders size={20} color={themeColors.primary} />
            </View>
            <Text style={[styles.supportLabel, { color: themeColors.text }]}>Options avancées</Text>
            <ChevronRight size={20} color={themeColors.textLight} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.appInfoContainer}>
          <Text style={[styles.appVersion, { color: themeColors.textSecondary }]}>GlucoTrack v1.0.0</Text>
          <Text style={[styles.appCopyright, { color: themeColors.textLight }]}>© 2025 GlucoTrack</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
    color: colors.text,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  genderSelector: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: colors.primary,
  },
  genderText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedGenderText: {
    color: colors.white,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  thresholdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  thresholdGroup: {
    width: '48%',
  },
  thresholdLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  thresholdInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  thresholdInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  unitText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  unitSelector: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  unitOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  selectedUnit: {
    backgroundColor: colors.primary,
  },
  unitOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedUnitText: {
    color: colors.white,
    fontWeight: '600',
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  supportIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  supportLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  appInfoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  appVersion: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: colors.textLight,
  },
});