// This is a simplified mock of a database service
// In a real app, you would use SQLite or another database

import AsyncStorage from '@react-native-async-storage/async-storage';

type Reading = {
  id?: string;
  type: 'blood' | 'urine';
  value: number;
  unit: string;
  timestamp: string;
};

class DatabaseServiceClass {
  private STORAGE_KEY = 'glucose_readings';

  constructor() {
    console.log('Database service initialized');
  }

  // Save a new reading
  public async saveReading(reading: Reading): Promise<Reading> {
    try {
      // Get existing readings
      const readings = await this.getReadings();
      
      // Add ID and save
      const newReading = {
        ...reading,
        id: Date.now().toString(),
      };
      
      // Add to the beginning of the array
      readings.unshift(newReading);
      
      // Save back to storage
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(readings));
      
      return newReading;
    } catch (error) {
      console.error('Error saving reading:', error);
      throw error;
    }
  }

  // Get all readings
  public async getReadings(
    type: string = 'all',
    startDate?: Date,
    endDate?: Date
  ): Promise<Reading[]> {
    try {
      const json = await AsyncStorage.getItem(this.STORAGE_KEY);
      let readings: Reading[] = json ? JSON.parse(json) : [];
      
      // Filter by type if specified
      if (type !== 'all') {
        readings = readings.filter(reading => reading.type === type);
      }
      
      // Filter by date range if specified
      if (startDate && endDate) {
        const startTime = startDate.getTime();
        const endTime = endDate.getTime();
        
        readings = readings.filter(reading => {
          const readingTime = new Date(reading.timestamp).getTime();
          return readingTime >= startTime && readingTime <= endTime;
        });
      }
      
      return readings;
    } catch (error) {
      console.error('Error getting readings:', error);
      return [];
    }
  }

  // Get a single reading by ID
  public async getReadingById(id: string): Promise<Reading | null> {
    try {
      const readings = await this.getReadings();
      return readings.find(reading => reading.id === id) || null;
    } catch (error) {
      console.error('Error getting reading by ID:', error);
      return null;
    }
  }

  // Delete a reading
  public async deleteReading(id: string): Promise<boolean> {
    try {
      const readings = await this.getReadings();
      const filteredReadings = readings.filter(reading => reading.id !== id);
      
      // Save back to storage
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredReadings));
      
      return true;
    } catch (error) {
      console.error('Error deleting reading:', error);
      return false;
    }
  }

  // Delete all readings
  public async clearAllReadings(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing readings:', error);
      return false;
    }
  }

  // Get readings statistics
  public async getStatistics(
    type: string = 'all',
    startDate?: Date,
    endDate?: Date
  ): Promise<{ avg: number; min: number; max: number; count: number }> {
    try {
      const readings = await this.getReadings(type, startDate, endDate);
      
      if (readings.length === 0) {
        return { avg: 0, min: 0, max: 0, count: 0 };
      }
      
      const values = readings.map(reading => reading.value);
      const sum = values.reduce((a, b) => a + b, 0);
      
      return {
        avg: sum / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: readings.length,
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return { avg: 0, min: 0, max: 0, count: 0 };
    }
  }
}

// Export a singleton instance
export const DatabaseService = new DatabaseServiceClass();