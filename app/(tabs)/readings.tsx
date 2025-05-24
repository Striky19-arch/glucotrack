import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Droplet, Timer, RotateCw } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { DatabaseService } from '@/services/DatabaseService';
import { BluetoothStatus } from '@/components/BluetoothStatus';
import { ReadingTypeSelector } from '@/components/ReadingTypeSelector';
import { MeasurementResult } from '@/components/MeasurementResult';

type ReadingType = 'blood' | 'urine';

export default function ReadingsScreen() {
  const [readingType, setReadingType] = useState<ReadingType>('blood');
  const [measuring, setMeasuring] = useState(false);
  const [readingValue, setReadingValue] = useState<number | null>(null);
  const [unit, setUnit] = useState('mg/dL');

  // Simulate a measurement
  const startMeasurement = () => {
    // Check if there's a connected device
    const isDeviceConnected = true; // This would be checked from the BluetoothManager

    if (!isDeviceConnected) {
      Alert.alert(
        'Aucun appareil connecté',
        'Veuillez connecter un appareil pour effectuer une mesure.',
        [
          {
            text: 'OK',
            onPress: () => console.log('OK Pressed'),
          },
        ]
      );
      return;
    }

    setMeasuring(true);
    setReadingValue(null);

    // Simulate measurement delay
    setTimeout(() => {
      // Generate a random reading value
      const min = readingType === 'blood' ? 70 : 0;
      const max = readingType === 'blood' ? 180 : 50;
      const value = Math.floor(Math.random() * (max - min + 1) + min);
      
      setReadingValue(value);
      setMeasuring(false);
      
      // Save to database
      DatabaseService.saveReading({
        type: readingType,
        value,
        unit,
        timestamp: new Date().toISOString(),
      });
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Nouvelle mesure',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTitleStyle: {
            color: colors.text,
            fontWeight: '600',
          },
          headerRight: () => <BluetoothStatus />,
          headerShadowVisible: false,
        }}
      />

      <View style={styles.content}>
        <ReadingTypeSelector 
          selectedType={readingType} 
          onSelectType={setReadingType} 
        />

        <View style={styles.measurementSection}>
          {measuring ? (
            <View style={styles.measuringContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.measuringText}>Mesure en cours...</Text>
              <Text style={styles.waitText}>Veuillez patienter</Text>
              
              <View style={styles.timerContainer}>
                <Timer size={18} color={colors.textSecondary} />
                <Text style={styles.timerText}>~30 secondes</Text>
              </View>
            </View>
          ) : readingValue !== null ? (
            <MeasurementResult 
              type={readingType}
              value={readingValue}
              unit={unit}
            />
          ) : (
            <View style={styles.instructionsContainer}>
              <View style={styles.iconContainer}>
                <Droplet size={50} color={readingType === 'blood' ? colors.error : colors.warning} />
              </View>
              <Text style={styles.instructionsTitle}>
                {readingType === 'blood' 
                  ? 'Mesure de glycémie sanguine' 
                  : 'Mesure de glucose urinaire'}
              </Text>
              <Text style={styles.instructionsText}>
                {readingType === 'blood'
                  ? 'Préparez votre bandelette et assurez-vous que votre appareil est connecté.'
                  : 'Plongez la bandelette dans l\'échantillon d\'urine et insérez-la dans l\'appareil.'}
              </Text>
              
              <View style={styles.stepsContainer}>
                <Text style={styles.stepText}>1. Préparez la bandelette</Text>
                <Text style={styles.stepText}>2. Récoltez l'échantillon</Text>
                <Text style={styles.stepText}>3. Insérez la bandelette dans l'appareil</Text>
                <Text style={styles.stepText}>4. Appuyez sur "Commencer la mesure"</Text>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          {readingValue !== null ? (
            <TouchableOpacity
              style={[styles.button, styles.newReadingButton]}
              onPress={() => setReadingValue(null)}
            >
              <RotateCw size={20} color={colors.white} />
              <Text style={styles.buttonText}>Nouvelle mesure</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, measuring && styles.disabledButton]}
              onPress={startMeasurement}
              disabled={measuring}
            >
              <Droplet size={20} color={colors.white} />
              <Text style={styles.buttonText}>
                {measuring ? 'Mesure en cours...' : 'Commencer la mesure'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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
  measurementSection: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'center',
  },
  measuringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  measuringText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
  },
  waitText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.backgroundLight,
    borderRadius: 20,
  },
  timerText: {
    marginLeft: 8,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  instructionsContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  stepsContainer: {
    width: '100%',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
  },
  stepText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
    paddingLeft: 16,
    position: 'relative',
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: colors.textLight,
    shadowColor: colors.textLight,
  },
  newReadingButton: {
    backgroundColor: colors.success,
    shadowColor: colors.success,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});