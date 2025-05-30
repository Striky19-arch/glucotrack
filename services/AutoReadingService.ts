import { DatabaseService } from './DatabaseService';

type ReadingType = 'blood' | 'urine';

class AutoReadingService {
  private static instance: AutoReadingService;
  private isReading: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private currentReadingType: ReadingType = 'blood';

  private constructor() {}

  public static getInstance(): AutoReadingService {
    if (!AutoReadingService.instance) {
      AutoReadingService.instance = new AutoReadingService();
    }
    return AutoReadingService.instance;
  }

  public startAutoReading(readingType: ReadingType): void {
    if (this.isReading) {
      return;
    }

    this.isReading = true;
    this.currentReadingType = readingType;

    // Vérifier la connexion du capteur
    const isDeviceConnected = true; // À remplacer par la vérification réelle du BluetoothManager

    if (!isDeviceConnected) {
      this.isReading = false;
      throw new Error('Aucun appareil connecté');
    }

    // Démarrer la lecture automatique toutes les minutes
    this.intervalId = setInterval(() => {
      this.performReading();
    }, 60000);

    // Effectuer une première lecture immédiatement
    this.performReading();
  }

  public stopAutoReading(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isReading = false;
  }

  public isAutoReadingActive(): boolean {
    return this.isReading;
  }

  private async performReading(): Promise<void> {
    try {
      // Simuler le délai de lecture du capteur
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Générer une valeur aléatoire (à remplacer par la vraie lecture du capteur)
      const min = this.currentReadingType === 'blood' ? 70 : 0;
      const max = this.currentReadingType === 'blood' ? 180 : 50;
      const value = Math.floor(Math.random() * (max - min + 1) + min);

      // Sauvegarder la lecture dans la base de données
      await DatabaseService.saveReading({
        type: this.currentReadingType,
        value,
        unit: 'mg/dL',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Erreur lors de la lecture automatique:', error);
      this.stopAutoReading();
    }
  }
}

export const autoReadingService = AutoReadingService.getInstance(); 