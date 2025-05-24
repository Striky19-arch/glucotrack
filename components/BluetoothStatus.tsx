import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { Bluetooth, BluetoothOff } from 'lucide-react-native';
import { Device } from 'react-native-ble-plx';
import { colors } from '@/constants/colors';
import { BluetoothManager } from '@/services/BluetoothManager';

export function BluetoothStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [device, setDevice] = useState<Device | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    // Set up Bluetooth device listener
    const unsubscribe = BluetoothManager.addListener((device) => {
      setIsConnected(!!device);
      setDevice(device);
    });

    // Check initial connection state
    const connectedDevice = BluetoothManager.getConnectedDevice();
    if (connectedDevice) {
      setIsConnected(true);
      setDevice(connectedDevice);
    }

    return () => unsubscribe();
  }, []);

  const handlePress = async () => {
    if (Platform.OS === 'web') {
      alert('Bluetooth functionality is not available on web');
      return;
    }

    try {
      if (isConnected && device) {
        await BluetoothManager.disconnectDevice();
      } else {
        await BluetoothManager.startScan();
      }
    } catch (error) {
      console.error('Bluetooth operation failed:', error);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isConnected ? styles.connected : styles.disconnected,
      ]}
      onPress={handlePress}
    >
      {isConnected ? (
        <>
          <Bluetooth size={16} color={colors.white} />
          <Text style={styles.text}>{device?.name || 'Connected'}</Text>
        </>
      ) : (
        <>
          <BluetoothOff size={16} color={colors.white} />
          <Text style={styles.text}>Not Connected</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  connected: {
    backgroundColor: colors.success,
  },
  disconnected: {
    backgroundColor: colors.textLight,
  },
  text: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
});