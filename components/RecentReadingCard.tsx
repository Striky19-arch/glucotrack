import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react-native';
import { colors } from '@/constants/colors';

type ReadingType = 'blood' | 'urine';
type TrendType = 'up' | 'down' | 'stable';

interface RecentReadingCardProps {
  type: ReadingType;
  value: number;
  unit: string;
  time: string;
  trend: TrendType;
}

export function RecentReadingCard({ type, value, unit, time, trend }: RecentReadingCardProps) {
  // Determine status based on value and type
  const getStatus = () => {
    if (type === 'blood') {
      if (value < 70) return 'low';
      if (value > 140) return 'high';
      return 'normal';
    } else {
      if (value > 15) return 'high';
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

  // Get status text
  const getStatusText = () => {
    switch (status) {
      case 'low':
        return 'Bas';
      case 'high':
        return 'Élevé';
      default:
        return 'Normal';
    }
  };

  // Get trend icon
  const renderTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={20} color={colors.high} />;
      case 'down':
        return <TrendingDown size={20} color={colors.low} />;
      default:
        return <Minus size={20} color={colors.textSecondary} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <View
            style={[
              styles.typeIndicator,
              { backgroundColor: type === 'blood' ? colors.error : colors.warning },
            ]}
          />
          <Text style={styles.typeText}>
            {type === 'blood' ? 'Glycémie sanguine' : 'Glucose urinaire'}
          </Text>
        </View>
        <TouchableOpacity style={styles.infoButton}>
          <Info size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor() },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
          <View style={styles.trendContainer}>
            {renderTrendIcon()}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  infoButton: {
    padding: 4,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  unit: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  trendContainer: {
    alignItems: 'center',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.backgroundLight,
    paddingTop: 12,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});