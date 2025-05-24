import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { Save, ChevronRight, Bell, Clock, FileSliders as Sliders, Ruler, LifeBuoy } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { SettingsService } from '@/services/SettingsService';
import { BMICalculator } from '@/components/BMICalculator';

export default function SettingsScreen() {
  const [profile, setProfile] = useState({
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
  
  const [preferences, setPreferences] = useState({
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
      if (savedPreferences) setPreferences(savedPreferences);
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
  };

  // Change unit
  const changeUnit = (unit: string) => {
    const updatedPreferences = { ...preferences, unit };
    setPreferences(updatedPreferences);
    SettingsService.savePreferences(updatedPreferences);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Paramètres',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTitleStyle: {
            color: colors.text,
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Profil personnel</Text>
        
        <View style={styles.card}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Âge</Text>
            <TextInput
              style={styles.input}
              value={profile.age}
              onChangeText={(text) => setProfile({ ...profile, age: text })}
              keyboardType="numeric"
              placeholder="Âge en années"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Poids (kg)</Text>
            <TextInput
              style={styles.input}
              value={profile.weight}
              onChangeText={(text) => setProfile({ ...profile, weight: text })}
              keyboardType="numeric"
              placeholder="Poids en kg"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Taille (cm)</Text>
            <TextInput
              style={styles.input}
              value={profile.height}
              onChangeText={(text) => setProfile({ ...profile, height: text })}
              keyboardType="numeric"
              placeholder="Taille en cm"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Genre</Text>
            <View style={styles.genderSelector}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  profile.gender === 'male' && styles.selectedGender,
                ]}
                onPress={() => setProfile({ ...profile, gender: 'male' })}
              >
                <Text
                  style={[
                    styles.genderText,
                    profile.gender === 'male' && styles.selectedGenderText,
                  ]}
                >
                  Homme
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  profile.gender === 'female' && styles.selectedGender,
                ]}
                onPress={() => setProfile({ ...profile, gender: 'female' })}
              >
                <Text
                  style={[
                    styles.genderText,
                    profile.gender === 'female' && styles.selectedGenderText,
                  ]}
                >
                  Femme
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* BMI Calculator */}
          <BMICalculator 
            weight={parseFloat(profile.weight) || 0}
            height={parseFloat(profile.height) || 0}
          />
          
          <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
            <Save size={18} color={colors.white} />
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Valeurs seuils</Text>
        
        <View style={styles.card}>
          <Text style={styles.subSectionTitle}>Glycémie sanguine</Text>
          
          <View style={styles.thresholdContainer}>
            <View style={styles.thresholdGroup}>
              <Text style={styles.thresholdLabel}>Seuil bas</Text>
              <View style={styles.thresholdInputContainer}>
                <TextInput
                  style={styles.thresholdInput}
                  value={thresholds.bloodLow}
                  onChangeText={(text) => setThresholds({ ...thresholds, bloodLow: text })}
                  keyboardType="numeric"
                />
                <Text style={styles.unitText}>{preferences.unit}</Text>
              </View>
            </View>
            
            <View style={styles.thresholdGroup}>
              <Text style={styles.thresholdLabel}>Seuil haut</Text>
              <View style={styles.thresholdInputContainer}>
                <TextInput
                  style={styles.thresholdInput}
                  value={thresholds.bloodHigh}
                  onChangeText={(text) => setThresholds({ ...thresholds, bloodHigh: text })}
                  keyboardType="numeric"
                />
                <Text style={styles.unitText}>{preferences.unit}</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.subSectionTitle}>Glucose urinaire</Text>
          
          <View style={styles.thresholdContainer}>
            <View style={styles.thresholdGroup}>
              <Text style={styles.thresholdLabel}>Seuil bas</Text>
              <View style={styles.thresholdInputContainer}>
                <TextInput
                  style={styles.thresholdInput}
                  value={thresholds.urineLow}
                  onChangeText={(text) => setThresholds({ ...thresholds, urineLow: text })}
                  keyboardType="numeric"
                />
                <Text style={styles.unitText}>{preferences.unit}</Text>
              </View>
            </View>
            
            <View style={styles.thresholdGroup}>
              <Text style={styles.thresholdLabel}>Seuil haut</Text>
              <View style={styles.thresholdInputContainer}>
                <TextInput
                  style={styles.thresholdInput}
                  value={thresholds.urineHigh}
                  onChangeText={(text) => setThresholds({ ...thresholds, urineHigh: text })}
                  keyboardType="numeric"
                />
                <Text style={styles.unitText}>{preferences.unit}</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.saveButton} onPress={saveThresholds}>
            <Save size={18} color={colors.white} />
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Préférences</Text>
        
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ruler size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingLabel}>Unité de mesure</Text>
            <View style={styles.unitSelector}>
              <TouchableOpacity
                style={[
                  styles.unitOption,
                  preferences.unit === 'mg/dL' && styles.selectedUnit,
                ]}
                onPress={() => changeUnit('mg/dL')}
              >
                <Text
                  style={[
                    styles.unitOptionText,
                    preferences.unit === 'mg/dL' && styles.selectedUnitText,
                  ]}
                >
                  mg/dL
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.unitOption,
                  preferences.unit === 'mmol/L' && styles.selectedUnit,
                ]}
                onPress={() => changeUnit('mmol/L')}
              >
                <Text
                  style={[
                    styles.unitOptionText,
                    preferences.unit === 'mmol/L' && styles.selectedUnitText,
                  ]}
                >
                  mmol/L
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Bell size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Switch
              value={preferences.notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.backgroundLight, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Clock size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingLabel}>Mode sombre</Text>
            <Switch
              value={preferences.darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.backgroundLight, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Support</Text>
        
        <View style={styles.card}>
          <TouchableOpacity style={styles.supportRow}>
            <View style={styles.supportIconContainer}>
              <LifeBuoy size={20} color={colors.primary} />
            </View>
            <Text style={styles.supportLabel}>Aide et documentation</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.supportRow}>
            <View style={styles.supportIconContainer}>
              <Sliders size={20} color={colors.primary} />
            </View>
            <Text style={styles.supportLabel}>Options avancées</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.appInfoContainer}>
          <Text style={styles.appVersion}>GlucoTrack v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2025 GlucoTrack</Text>
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