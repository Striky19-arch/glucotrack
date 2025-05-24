import { Platform } from 'react-native';
import { BleManager, Device, State } from 'react-native-ble-plx';

class BluetoothManagerClass {
  private manager: BleManager;
  private connectedDevice: Device | null = null;
  private listeners: Set<(device: Device | null) => void> = new Set();
  private isScanning: boolean = false;

  constructor() {
    this.manager = new BleManager();
    
    // Monitor state changes
    this.manager.onStateChange((state) => {
      console.log('Bluetooth state:', state);
    }, true);
  }

  public async checkPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return navigator?.bluetooth !== undefined;
    }

    try {
      const state = await this.manager.state();
      if (state === State.PoweredOff) {
        throw new Error('Bluetooth is turned off');
      }
      
      if (Platform.OS === 'android') {
        const granted = await this.manager.requestPermissions();
        return granted || false;
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
      
      // Scan for devices with specific service UUID
      await this.manager.startDeviceScan(
        ['YOUR_SERVICE_UUID'], // Replace with your device's service UUID
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

  public async connectToDevice(device: Device): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      const connectedDevice = await device.connect();
      await connectedDevice.discoverAllServicesAndCharacteristics();
      
      this.connectedDevice = connectedDevice;
      this.notifyListeners(connectedDevice);
      
      // Set up notification listener for glucose readings
      await this.setupGlucoseNotifications(connectedDevice);
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

  private parseGlucoseReading(value: string): number {
    // Implement parsing logic based on your device's data format
    // This is just an example
    const buffer = Buffer.from(value, 'base64');
    return buffer.readUInt16LE(0);
  }

  private async handleGlucoseReading(reading: number): Promise<void> {
    // Implement handling logic (e.g., store in database)
    console.log('Received glucose reading:', reading);
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