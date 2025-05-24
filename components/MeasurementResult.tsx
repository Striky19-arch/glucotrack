import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Share2, Info } from 'lucide-react-native';
import { colors } from '@/constants/colors';

type ReadingType = 'blood' | 'urine';

interface MeasurementResultProps {
  type: ReadingType;
  value: number;
  unit: string;
}

export function MeasurementResult({ type, value, unit }: MeasurementResultProps) {
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

  // Get status text and message
  const getStatusInfo = () => {
    if (type === 'blood') {
      switch (status) {
        case 'low':
          return {
            label: 'Glycémie basse',
            message: 'Votre glycémie est inférieure à la plage normale. Consommez des glucides à action rapide.',
          };
        case 'high':
          return {
            label: 'Glycémie élevée',
            message: 'Votre glycémie est supérieure à la plage normale. Consultez votre médecin si cela persiste.',
          };
        default:
          return {
            label: 'Glycémie normale',
            message: 'Votre glycémie est dans la plage normale. Continuez vos bonnes habitudes.',
          };
      }
    } else {
      switch (status) {
        case 'high':
          return {
            label: 'Glucose urinaire élevé',
            message: 'Le niveau de glucose dans votre urine est élevé. Consultez votre médecin.',
          };
        default:
          return {
            label: 'Glucose urinaire normal',
            message: 'Le niveau de glucose dans votre urine est normal.',
          };
      }
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <View style={styles.container}>
      <View style={[styles.resultHeader, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.typeText}>
          {type === 'blood' ? 'Glycémie sanguine' : 'Glucose urinaire'}
        </Text>
        <Text style={styles.statusLabel}>{statusInfo.label}</Text>
      </View>
      
      <View style={styles.resultContent}>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color: getStatusColor() }]}>{value}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
        
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{statusInfo.message}</Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Info size={20} color={colors.textSecondary} />
            <Text style={styles.actionText}>Détails</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={20} color={colors.textSecondary} />
            <Text style={styles.actionText}>Partager</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.timestamp}>
          {new Date().toLocaleTimeString()} - {new Date().toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultHeader: {
    padding: 20,
    alignItems: 'center',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
    opacity: 0.8,
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  resultContent: {
    padding: 20,
    alignItems: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  value: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 20,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  messageContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 20,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.backgroundLight,
    padding: 12,
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});