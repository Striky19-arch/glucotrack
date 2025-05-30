import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform, Linking } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Droplet, Timer, RotateCw, AlertCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { DatabaseService } from '@/services/DatabaseService';
import { BluetoothStatus } from '@/components/BluetoothStatus';
import { ReadingTypeSelector } from '@/components/ReadingTypeSelector';
import { MeasurementResult } from '@/components/MeasurementResult';
import { autoReadingService } from '@/services/AutoReadingService';
import { BluetoothManager } from '@/services/BluetoothManager';

type ReadingType = 'blood' | 'urine';

export default function ReadingsScreen() {
  const router = useRouter();
  const [readingType, setReadingType] = useState<ReadingType>('blood');
  const [measuring, setMeasuring] = useState(false);
  const [readingValue, setReadingValue] = useState<number | null>(null);
  const [unit, setUnit] = useState('mg/dL');
  const [isAutoReading, setIsAutoReading] = useState(false);
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);

  // Vérifier la connexion du capteur au chargement
  useEffect(() => {
    const checkDeviceConnection = async () => {
      try {
        // Vérifier les permissions Bluetooth
        const hasPermissions = await BluetoothManager.checkPermissions();
        if (!hasPermissions) {
          Alert.alert(
            'Permission Bluetooth requise',
            'L\'application a besoin d\'accéder au Bluetooth pour se connecter au capteur. Veuillez activer le Bluetooth dans les paramètres de votre appareil.',
            [
              {
                text: 'Annuler',
                style: 'cancel',
                onPress: () => router.back(),
              },
              {
                text: 'Paramètres',
                onPress: () => {
                  // Rediriger vers les paramètres de l'appareil
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                  } else {
                    Linking.openSettings();
                  }
                },
              },
            ]
          );
          return;
        }

        const device = BluetoothManager.getConnectedDevice();
        const deviceConnected = !!device;
        setIsDeviceConnected(deviceConnected);

        if (!deviceConnected) {
          Alert.alert(
            'Capteur non connecté',
            'Veuillez connecter un capteur pour effectuer des mesures.',
            [
              {
                text: 'Annuler',
                style: 'cancel',
                onPress: () => router.back(),
              },
              {
                text: 'Connecter',
                onPress: () => router.push('/(tabs)/devices' as any),
              },
            ]
          );
          return;
        }

        // Si le capteur est connecté, démarrer la lecture automatique
        try {
          autoReadingService.startAutoReading(readingType);
          setIsAutoReading(true);
        } catch (error) {
          Alert.alert(
            'Erreur',
            'Impossible de démarrer la lecture automatique. Veuillez vérifier la connexion du capteur.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la connexion:', error);
        setIsDeviceConnected(false);
      }
    };

    checkDeviceConnection();

    // Nettoyer lors du démontage du composant
    return () => {
      autoReadingService.stopAutoReading();
    };
  }, []);

  // Mettre à jour le type de lecture
  useEffect(() => {
    if (isAutoReading) {
      try {
        autoReadingService.startAutoReading(readingType);
      } catch (error) {
        setIsAutoReading(false);
        Alert.alert(
          'Erreur',
          'Impossible de changer le type de lecture. Veuillez vérifier la connexion du capteur.',
          [{ text: 'OK' }]
        );
      }
    }
  }, [readingType]);

  const toggleAutoReading = () => {
    if (isAutoReading) {
      autoReadingService.stopAutoReading();
      setIsAutoReading(false);
      setReadingValue(null);
    } else {
      try {
        autoReadingService.startAutoReading(readingType);
        setIsAutoReading(true);
      } catch (error) {
        Alert.alert(
          'Erreur',
          'Impossible de démarrer la lecture automatique. Veuillez vérifier la connexion du capteur.',
          [{ text: 'OK' }]
        );
      }
    }
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

      {!isDeviceConnected && (
        <View style={styles.warningBanner}>
          <AlertCircle size={20} color={colors.white} />
          <Text style={styles.warningText}>
            Aucun capteur connecté. Veuillez connecter un capteur pour effectuer des mesures.
          </Text>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={() => router.push('/(tabs)/devices' as any)}
          >
            <Text style={styles.connectButtonText}>Connecter</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        <ReadingTypeSelector 
          selectedType={readingType} 
          onSelectType={setReadingType} 
        />

        <View style={styles.measurementSection}>
          {measuring ? (
            <View style={styles.measuringContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.measuringText}>Lecture en cours...</Text>
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
                  ? 'Mesure de glycémie'
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
                <Text style={styles.stepText}>4. La lecture se fera automatiquement</Text>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button, 
              isAutoReading ? styles.activeButton : styles.inactiveButton,
              !isDeviceConnected && styles.disabledButton
            ]}
            onPress={toggleAutoReading}
            disabled={!isDeviceConnected}
          >
            <RotateCw size={20} color={colors.white} />
            <Text style={styles.buttonText}>
              {isAutoReading ? 'Arrêter la lecture' : 'Démarrer la lecture'}
            </Text>
          </TouchableOpacity>
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
  warningBanner: {
    backgroundColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 20,
  },
  warningText: {
    flex: 1,
    color: colors.white,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  connectButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  connectButtonText: {
    color: colors.error,
    fontWeight: '600',
    fontSize: 14,
  },
  measurementSection: {
    marginTop: 20,
  },
  measuringContainer: {
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
  measuringText: {
    fontSize: 18,
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
    paddingVertical: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  activeButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
  },
  inactiveButton: {
    backgroundColor: colors.textLight,
    shadowColor: colors.textLight,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
});