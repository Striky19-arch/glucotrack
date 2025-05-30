import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import { Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { DatabaseService } from '@/services/DatabaseService';
import { ChartContainer } from '@/components/ChartContainer';
import { ReadingsList } from '@/components/ReadingsList';
import { DateRangePicker } from '@/components/DateRangePicker';

type FilterPeriod = '7days' | '30days' | '90days' | 'custom';
type ReadingType = 'all' | 'blood' | 'urine';

export default function TrackingScreen() {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('7days');
  const [readingType, setReadingType] = useState<ReadingType>('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date(),
  });
  const [readings, setReadings] = useState<any[]>([]);

  // Load data from database based on filters
  useEffect(() => {
    const loadData = async () => {
      const data = await DatabaseService.getReadings(readingType, dateRange.start, dateRange.end);
      setReadings(data);
    };

    loadData();
  }, [filterPeriod, readingType, dateRange]);

  // Handle filter period change
  const handlePeriodChange = (period: FilterPeriod) => {
    setFilterPeriod(period);
    
    const end = new Date();
    let start = new Date();
    
    switch(period) {
      case '7days':
        start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'custom':
        setShowDatePicker(true);
        return;
    }
    
    setDateRange({ start, end });
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderHeader = () => (
    <>
      <View style={styles.filterSection}>
        <TouchableOpacity
          style={styles.dateRangeButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Calendar size={16} color={colors.textSecondary} />
          <Text style={styles.dateRangeText}>
            {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
          </Text>
          <ChevronRight size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          data={['7days', '30days', '90days', 'custom']}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterPeriod === item && styles.activeFilterButton,
              ]}
              onPress={() => handlePeriodChange(item as FilterPeriod)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterPeriod === item && styles.activeFilterText,
                ]}
              >
                {item === '7days' ? '7 jours' : item === '30days' ? '30 jours' : item === '90days' ? '90 jours' : 'Personnalisé'}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />

        <View style={styles.typeFilter}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              readingType === 'all' && styles.activeTypeButton,
            ]}
            onPress={() => setReadingType('all')}
          >
            <Text
              style={[
                styles.typeButtonText,
                readingType === 'all' && styles.activeTypeText,
              ]}
            >
              Tous
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeButton,
              readingType === 'blood' && styles.activeTypeButton,
            ]}
            onPress={() => setReadingType('blood')}
          >
            <Text
              style={[
                styles.typeButtonText,
                readingType === 'blood' && styles.activeTypeText,
              ]}
            >
              Sang
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeButton,
              readingType === 'urine' && styles.activeTypeButton,
            ]}
            onPress={() => setReadingType('urine')}
          >
            <Text
              style={[
                styles.typeButtonText,
                readingType === 'urine' && styles.activeTypeText,
              ]}
            >
              Urine
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ChartContainer 
        data={readings}
        dateRange={dateRange}
        readingType={readingType}
      />

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {readings.length > 0 
              ? Math.round(readings.reduce((sum, item) => sum + item.value, 0) / readings.length) 
              : '--'}
          </Text>
          <Text style={styles.statLabel}>Moyenne</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {readings.length > 0 
              ? Math.max(...readings.map(item => item.value))
              : '--'}
          </Text>
          <Text style={styles.statLabel}>Maximum</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {readings.length > 0 
              ? Math.min(...readings.map(item => item.value))
              : '--'}
          </Text>
          <Text style={styles.statLabel}>Minimum</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Historique des mesures</Text>
    </>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Suivi des mesures',
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

      <FlatList
        data={readings}
        renderItem={({ item }) => (
          <View style={styles.readingItem}>
            <View style={[styles.typeIndicator, { backgroundColor: item.type === 'blood' ? colors.error : colors.warning }]} />
            <View style={styles.readingDetails}>
              <Text style={styles.readingType}>
                {item.type === 'blood' ? 'Glycémie' : 'Glucose urinaire'}
              </Text>
              <Text style={styles.readingDate}>
                {new Date(item.timestamp).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View style={styles.readingValue}>
              <Text style={styles.valueText}>{item.value}</Text>
              <Text style={styles.unitText}>mg/dL</Text>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => `reading-${index}`}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
      
      {showDatePicker && (
        <DateRangePicker
          initialRange={dateRange}
          onConfirm={(range) => {
            setDateRange(range);
            setFilterPeriod('custom');
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  dateRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  dateRangeText: {
    flex: 1,
    marginLeft: 8,
    color: colors.text,
    fontWeight: '500',
  },
  filterScrollView: {
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeFilterText: {
    color: colors.white,
  },
  typeFilter: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTypeButton: {
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeButtonText: {
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTypeText: {
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
    color: colors.text,
  },
  readingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  readingDetails: {
    flex: 1,
  },
  readingType: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  readingDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  readingValue: {
    alignItems: 'flex-end',
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  unitText: {
    fontSize: 12,
    fontWeight: 'normal',
    color: colors.textSecondary,
  },
});