import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Platform, Linking, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Bluetooth, Plus, Info, RefreshCw } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { BluetoothManager } from '@/services/BluetoothManager';
import { EmptyState } from '@/components/EmptyState';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Device = {
  id: string;
  name: string;
  connected: boolean;
  serviceUUID?: string;
  characteristicUUID?: string;
};

export default function DevicesScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [pairedDevices, setPairedDevices] = useState<Device[]>([]);
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);

  const startScan = async () => {
    try {
      // Vérifier les permissions Bluetooth
      const hasPermissions = await BluetoothManager.checkPermissions();
      if (!hasPermissions) {
        Alert.alert(
          'Permission Bluetooth requise',
          'L\'application a besoin d\'accéder au Bluetooth pour scanner les appareils. Veuillez activer le Bluetooth dans les paramètres de votre appareil.',
          [
            {
              text: 'Annuler',
              style: 'cancel',
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

      setIsScanning(true);
      await BluetoothManager.startScan();
    } catch (error) {
      console.error('Erreur lors du scan:', error);
      Alert.alert('Erreur', 'Impossible de scanner les appareils Bluetooth. Veuillez vérifier que le Bluetooth est activé.');
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (device: Device) => {
    try {
      // Connexion à l'appareil via le BluetoothManager
      await BluetoothManager.connectToDevice({
        id: device.id,
        name: device.name,
        serviceUUID: device.serviceUUID,
        characteristicUUID: device.characteristicUUID
      });

      // Mise à jour de la liste des appareils
      const updatedDevice = { ...device, connected: true };
      setPairedDevices([...pairedDevices, updatedDevice]);
      setAvailableDevices(availableDevices.filter((d) => d.id !== device.id));
      
      Alert.alert('Connecté', `${device.name} connecté avec succès.`);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      Alert.alert('Erreur', 'Impossible de se connecter à l\'appareil.');
    }
  };

  const disconnectDevice = async (device: Device) => {
    Alert.alert(
      'Déconnecter',
      `Voulez-vous déconnecter ${device.name} ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            try {
              await BluetoothManager.disconnectDevice();
              
              // Mise à jour de la liste des appareils
              setPairedDevices(pairedDevices.filter((d) => d.id !== device.id));
              const updatedDevice = { ...device, connected: false };
              setAvailableDevices([...availableDevices, updatedDevice]);
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
              Alert.alert('Erreur', 'Impossible de déconnecter l\'appareil.');
            }
          },
        },
      ]
    );
  };

  const renderDeviceItem = ({ item, connected }: { item: Device; connected: boolean }) => (
    <TouchableOpacity
      style={[
        styles.deviceItem,
        item.connected && styles.connectedDevice,
      ]}
      onPress={() => {
        if (connected) {
          disconnectDevice(item);
        } else {
          connectToDevice(item);
        }
      }}
    >
      <View style={styles.deviceIcon}>
        <Bluetooth size={24} color={connected ? colors.primary : colors.textSecondary} />
      </View>
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.deviceStatus}>
          {connected ? 'Connecté' : 'Disponible'}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.infoButton}
        onPress={() => Alert.alert('Informations', 
          `Appareil: ${item.name}\n` +
          `ID: ${item.id}\n` +
          `Service UUID: ${item.serviceUUID || 'Non disponible'}\n` +
          `Caractéristique UUID: ${item.characteristicUUID || 'Non disponible'}\n` +
          `Statut: ${connected ? 'Connecté' : 'Non connecté'}`
        )}
      >
        <Info size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Mes appareils',
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

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Appareils connectés</Text>
        
        {pairedDevices.length > 0 ? (
          <FlatList
            data={pairedDevices}
            renderItem={({ item }) => renderDeviceItem({ item, connected: true })}
            keyExtractor={(item) => item.id}
            style={styles.deviceList}
            contentContainerStyle={styles.deviceListContent}
          />
        ) : (
          <EmptyState
            icon={<Bluetooth size={40} color={colors.textLight} />}
            title="Aucun appareil connecté"
            message="Connectez-vous à un appareil pour commencer à mesurer votre taux de sucre."
          />
        )}

        <View style={styles.scanSection}>
          <Text style={styles.sectionTitle}>Appareils disponibles</Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={startScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <RefreshCw size={20} color={colors.white} />
            ) : (
              <Plus size={20} color={colors.white} />
            )}
            <Text style={styles.scanButtonText}>
              {isScanning ? 'Recherche...' : 'Rechercher'}
            </Text>
          </TouchableOpacity>
        </View>

        {availableDevices.length > 0 ? (
          <FlatList
            data={availableDevices}
            renderItem={({ item }) => renderDeviceItem({ item, connected: false })}
            keyExtractor={(item) => item.id}
            style={styles.deviceList}
            contentContainerStyle={styles.deviceListContent}
          />
        ) : (
          <EmptyState
            icon={<Bluetooth size={40} color={colors.textLight} />}
            title="Aucun appareil détecté"
            message={isScanning ? "Recherche d'appareils en cours..." : "Appuyez sur 'Rechercher' pour scanner les appareils disponibles."}
          />
        )}
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
    padding: Math.min(screenWidth * 0.05, 20),
  },
  sectionTitle: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontWeight: 'bold',
    marginBottom: Math.min(screenHeight * 0.02, 16),
    color: colors.text,
  },
  scanSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Math.min(screenHeight * 0.025, 20),
    marginBottom: Math.min(screenHeight * 0.02, 16),
    paddingHorizontal: Math.min(screenWidth * 0.02, 10),
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: Math.min(screenHeight * 0.01, 8),
    paddingHorizontal: Math.min(screenWidth * 0.04, 16),
    borderRadius: Math.min(screenWidth * 0.02, 8),
  },
  scanButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: Math.min(screenWidth * 0.02, 8),
    fontSize: Math.min(screenWidth * 0.035, 14),
  },
  deviceList: {
    flex: 1,
  },
  deviceListContent: {
    paddingBottom: Math.min(screenHeight * 0.025, 20),
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: Math.min(screenWidth * 0.04, 16),
    borderRadius: Math.min(screenWidth * 0.03, 12),
    marginBottom: Math.min(screenHeight * 0.015, 12),
    marginHorizontal: Math.min(screenWidth * 0.02, 10),
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  connectedDevice: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  deviceIcon: {
    width: Math.min(screenWidth * 0.1, 40),
    height: Math.min(screenWidth * 0.1, 40),
    borderRadius: Math.min(screenWidth * 0.05, 20),
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Math.min(screenWidth * 0.03, 12),
  },
  deviceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  deviceName: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontWeight: '600',
    color: colors.text,
    marginBottom: Math.min(screenHeight * 0.005, 4),
  },
  deviceStatus: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    color: colors.textSecondary,
  },
  infoButton: {
    padding: Math.min(screenWidth * 0.02, 8),
    marginLeft: Math.min(screenWidth * 0.02, 8),
  },
});