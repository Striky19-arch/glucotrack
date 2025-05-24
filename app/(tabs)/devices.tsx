import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Bluetooth, Plus, Info, RefreshCw } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { BluetoothManager } from '@/services/BluetoothManager';
import { EmptyState } from '@/components/EmptyState';

type Device = {
  id: string;
  name: string;
  connected: boolean;
};

export default function DevicesScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [pairedDevices, setPairedDevices] = useState<Device[]>([]);
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);

  // Simulate Bluetooth scanning
  const startScan = () => {
    setIsScanning(true);
    
    // Simulate finding devices
    setTimeout(() => {
      setAvailableDevices([
        { id: '1', name: 'GlucoSense G6', connected: false },
        { id: '2', name: 'DiabetesMeter Pro', connected: false },
        { id: '3', name: 'UrineScan 3000', connected: false },
      ]);
      setIsScanning(false);
    }, 2000);
  };

  const connectToDevice = (device: Device) => {
    // Simulate connecting to a device
    Alert.alert('Connexion', `Connexion à ${device.name}...`);
    
    setTimeout(() => {
      // Add to paired devices
      const updatedDevice = { ...device, connected: true };
      setPairedDevices([...pairedDevices, updatedDevice]);
      
      // Remove from available devices
      setAvailableDevices(
        availableDevices.filter((d) => d.id !== device.id)
      );
      
      Alert.alert('Connecté', `${device.name} connecté avec succès.`);
    }, 1500);
  };

  const disconnectDevice = (device: Device) => {
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
          onPress: () => {
            // Remove from paired devices
            setPairedDevices(
              pairedDevices.filter((d) => d.id !== device.id)
            );
            
            // Add back to available devices
            const updatedDevice = { ...device, connected: false };
            setAvailableDevices([...availableDevices, updatedDevice]);
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
        onPress={() => Alert.alert('Informations', `Appareil: ${item.name}\nID: ${item.id}\nStatut: ${connected ? 'Connecté' : 'Non connecté'}`)}
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  scanSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  scanButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: 8,
  },
  deviceList: {
    flex: 1,
  },
  deviceListContent: {
    paddingBottom: 20,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoButton: {
    padding: 8,
  },
});