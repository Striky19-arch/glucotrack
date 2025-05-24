import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';

type ReadingType = 'blood' | 'urine';

interface ReadingTypeSelectorProps {
  selectedType: ReadingType;
  onSelectType: (type: ReadingType) => void;
}

export function ReadingTypeSelector({ selectedType, onSelectType }: ReadingTypeSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.option,
          selectedType === 'blood' && styles.selectedOption,
          { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
        ]}
        onPress={() => onSelectType('blood')}
      >
        <View
          style={[
            styles.indicator,
            { backgroundColor: colors.error },
            selectedType === 'blood' && styles.selectedIndicator,
          ]}
        />
        <Text
          style={[
            styles.optionText,
            selectedType === 'blood' && styles.selectedText,
          ]}
        >
          Glycémie sanguine
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.option,
          selectedType === 'urine' && styles.selectedOption,
          { borderTopRightRadius: 12, borderBottomRightRadius: 12 },
        ]}
        onPress={() => onSelectType('urine')}
      >
        <View
          style={[
            styles.indicator,
            { backgroundColor: colors.warning },
            selectedType === 'urine' && styles.selectedIndicator,
          ]}
        />
        <Text
          style={[
            styles.optionText,
            selectedType === 'urine' && styles.selectedText,
          ]}
        >
          Glucose urinaire
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    marginBottom: 16,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  selectedOption: {
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
    opacity: 0.6,
  },
  selectedIndicator: {
    opacity: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  selectedText: {
    color: colors.text,
    fontWeight: '600',
  },
});