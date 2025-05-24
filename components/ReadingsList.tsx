import { View, Text, StyleSheet, FlatList } from 'react-native';
import { colors } from '@/constants/colors';
import { EmptyState } from './EmptyState';
import { Droplet } from 'lucide-react-native';

interface ReadingsListProps {
  readings: any[];
  emptyMessage: string;
}

export function ReadingsList({ readings, emptyMessage }: ReadingsListProps) {
  const renderItem = ({ item }: { item: any }) => {
    // Determine status based on value and type
    const getStatus = () => {
      if (item.type === 'blood') {
        if (item.value < 70) return 'low';
        if (item.value > 140) return 'high';
        return 'normal';
      } else {
        if (item.value > 15) return 'high';
        return 'normal';
      }
    };

    const status = getStatus();

    // Get status color
    const getStatusColor = () => {
      switch (status) {
        case 'low':
          return colors.low;
        case 'high':
          return colors.high;
        default:
          return colors.normal;
      }
    };

    // Format date
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    return (
      <View style={styles.readingItem}>
        <View
          style={[
            styles.typeIndicator,
            { backgroundColor: item.type === 'blood' ? colors.error : colors.warning },
          ]}
        />
        <View style={styles.readingDetails}>
          <Text style={styles.readingType}>
            {item.type === 'blood' ? 'Glycémie sanguine' : 'Glucose urinaire'}
          </Text>
          <Text style={styles.readingDate}>{formatDate(item.timestamp)}</Text>
        </View>
        <View style={styles.readingValue}>
          <Text style={[styles.valueText, { color: getStatusColor() }]}>
            {item.value}
            <Text style={styles.unitText}> {item.unit}</Text>
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {readings.length > 0 ? (
        <FlatList
          data={readings}
          renderItem={renderItem}
          keyExtractor={(item, index) => `reading-${index}`}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState
          icon={<Droplet size={40} color={colors.textLight} />}
          title="Aucune mesure"
          message={emptyMessage}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
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