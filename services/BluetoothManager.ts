import { Platform } from 'react-native';
import { BleManager, Device, State } from 'react-native-ble-plx';
import { DatabaseService } from '../services/DatabaseService';

// Définition des types pour l'API Web Bluetooth
declare global {
  interface Navigator {
    bluetooth?: {
      getAvailability(): Promise<boolean>;
    };
  }
}

interface DeviceInfo {
  id: string;
  name: string;
  serviceUUID?: string;
  characteristicUUID?: string;
}

class BluetoothManagerClass {
  private manager: BleManager;
  private connectedDevice: Device | null = null;
  private listeners: Set<(device: Device | null) => void> = new Set();
  private isScanning: boolean = false;

  // UUID standards pour le service de glucose
  private readonly GLUCOSE_SERVICE_UUID = '1808'; // Service de glucose standard
  private readonly GLUCOSE_CHARACTERISTIC_UUID = '2A18'; // Caractéristique de mesure de glucose

  constructor() {
    this.manager = new BleManager();
    
    // Monitor state changes
    this.manager.onStateChange((state) => {
      console.log('Bluetooth state:', state);
    }, true);
  }

  public async checkPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return navigator?.bluetooth?.getAvailability() ?? Promise.resolve(false);
    }

    try {
      const state = await this.manager.state();
      if (state === State.PoweredOff) {
        throw new Error('Bluetooth is turned off');
      }
      
      if (Platform.OS === 'android') {
        // Vérification des permissions Android
        const permissions = await this.manager.state();
        return permissions === State.PoweredOn;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }

  public async startScan(): Promise<void> {
    if (this.isScanning || Platform.OS === 'web') return;

    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        throw new Error('Bluetooth permissions not granted');
      }

      this.isScanning = true;
      
      // Scan pour tous les appareils Bluetooth Low Energy
      await this.manager.startDeviceScan(
        null, // Scanner tous les appareils BLE
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            console.error('Scan error:', error);
            this.stopScan();
            return;
          }

          if (device) {
            // Notify listeners of discovered device
            this.notifyListeners(device);
          }
        }
      );
    } catch (error) {
      console.error('Error starting scan:', error);
      this.isScanning = false;
    }
  }

  public stopScan(): void {
    if (!this.isScanning || Platform.OS === 'web') return;
    
    this.manager.stopDeviceScan();
    this.isScanning = false;
  }

  public async connectToDevice(deviceInfo: DeviceInfo): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      const device = await this.manager.connectToDevice(deviceInfo.id);
      await device.discoverAllServicesAndCharacteristics();
      
      // Vérifier si l'appareil a le service et la caractéristique requis
      const services = await device.services();
      const glucoseService = services.find(s => s.uuid === this.GLUCOSE_SERVICE_UUID);
      
      if (!glucoseService) {
        throw new Error('Service glucose non trouvé');
      }

      const characteristics = await glucoseService.characteristics();
      const glucoseCharacteristic = characteristics.find(c => c.uuid === this.GLUCOSE_CHARACTERISTIC_UUID);
      
      if (!glucoseCharacteristic) {
        throw new Error('Caractéristique glucose non trouvée');
      }

      this.connectedDevice = device;
      this.notifyListeners(device);
      
      // Set up notification listener for glucose readings
      await this.setupGlucoseNotifications(device);
    } catch (error) {
      console.error('Error connecting to device:', error);
      throw error;
    }
  }

  public async disconnectDevice(): Promise<void> {
    if (!this.connectedDevice || Platform.OS === 'web') return;

    try {
      await this.connectedDevice.cancelConnection();
      this.connectedDevice = null;
      this.notifyListeners(null);
    } catch (error) {
      console.error('Error disconnecting device:', error);
      throw error;
    }
  }

  private async setupGlucoseNotifications(device: Device): Promise<void> {
    try {
      // Replace with your characteristic UUID
      const characteristic = await device.monitorCharacteristicForService(
        'YOUR_SERVICE_UUID',
        'YOUR_CHARACTERISTIC_UUID',
        (error, characteristic) => {
          if (error) {
            console.error('Notification error:', error);
            return;
          }

          if (characteristic?.value) {
            const reading = this.parseGlucoseReading(characteristic.value);
            // Handle the glucose reading (e.g., store in database)
            this.handleGlucoseReading(reading);
          }
        }
      );
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  }

  private parseGlucoseReading(value: string): { type: 'blood' | 'urine', value: number, unit: string } {
    try {
      // Format attendu: [ech:sang][valeur:150][unit:mg/dl]
      const matches = value.match(/\[ech:(\w+)\]\[valeur:(\d+)\]\[unit:(\w+\/\w+)\]/);
      
      if (!matches) {
        throw new Error('Format de données invalide');
      }

      const [, type, valueStr, unit] = matches;
      
      // Convertir le type en format interne
      const readingType = type.toLowerCase() === 'sang' ? 'blood' : 'urine';
      
      return {
        type: readingType,
        value: parseInt(valueStr, 10),
        unit: unit.toLowerCase()
      };
    } catch (error) {
      console.error('Erreur lors du parsing des données:', error);
      throw error;
    }
  }

  private async handleGlucoseReading(reading: { type: 'blood' | 'urine', value: number, unit: string }): Promise<void> {
    try {
      // Sauvegarder la lecture dans la base de données
      await DatabaseService.saveReading({
        type: reading.type,
        value: reading.value,
        unit: reading.unit,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la lecture:', error);
      throw error;
    }
  }

  public addListener(listener: (device: Device | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(device: Device | null): void {
    this.listeners.forEach(listener => listener(device));
  }

  public getConnectedDevice(): Device | null {
    return this.connectedDevice;
  }
}

export const BluetoothManager = new BluetoothManagerClass();