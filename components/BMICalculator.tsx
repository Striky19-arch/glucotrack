import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

interface BMICalculatorProps {
  weight: number;
  height: number;
}

export function BMICalculator({ weight, height }: BMICalculatorProps) {
  // Calculate BMI
  const calculateBMI = () => {
    if (weight <= 0 || height <= 0) return 0;
    
    // BMI formula: weight (kg) / (height (m))²
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const bmi = calculateBMI();
  
  // Determine BMI category
  const getBMICategory = () => {
    if (bmi <= 0) return { label: 'Indéterminé', color: colors.textLight };
    if (bmi < 18.5) return { label: 'Insuffisance pondérale', color: colors.warning };
    if (bmi < 25) return { label: 'Poids normal', color: colors.success };
    if (bmi < 30) return { label: 'Surpoids', color: colors.warning };
    return { label: 'Obésité', color: colors.error };
  };
  
  const bmiCategory = getBMICategory();

  // Calculate position on the BMI scale (0-100%)
  const getBMIPosition = () => {
    if (bmi <= 0) return 0;
    if (bmi >= 40) return 100;
    
    // Scale from 15 to 40
    const position = ((bmi - 15) / 25) * 100;
    return Math.max(0, Math.min(100, position));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Indice de Masse Corporelle (IMC)</Text>
      
      <View style={styles.bmiContainer}>
        <View style={styles.bmiValue}>
          <Text style={styles.bmiNumber}>
            {bmi > 0 ? bmi.toFixed(1) : '--'}
          </Text>
          <Text style={styles.bmiUnit}>kg/m²</Text>
        </View>
        
        <Text style={[styles.bmiCategory, { color: bmiCategory.color }]}>
          {bmiCategory.label}
        </Text>
      </View>
      
      <View style={styles.bmiScale}>
        <View style={styles.bmiScaleBar}>
          <View 
            style={[
              styles.bmiScaleIndicator,
              { left: `${getBMIPosition()}%` },
            ]}
          />
        </View>
        
        <View style={styles.bmiScaleLabels}>
          <Text style={styles.bmiScaleLabel}>15</Text>
          <Text style={styles.bmiScaleLabel}>20</Text>
          <Text style={styles.bmiScaleLabel}>25</Text>
          <Text style={styles.bmiScaleLabel}>30</Text>
          <Text style={styles.bmiScaleLabel}>35</Text>
          <Text style={styles.bmiScaleLabel}>40</Text>
        </View>
        
        <View style={styles.bmiScaleCategories}>
          <View style={[styles.bmiScaleCategory, { backgroundColor: colors.warning, flex: 1 }]} />
          <View style={[styles.bmiScaleCategory, { backgroundColor: colors.success, flex: 1.5 }]} />
          <View style={[styles.bmiScaleCategory, { backgroundColor: colors.warning, flex: 1 }]} />
          <View style={[styles.bmiScaleCategory, { backgroundColor: colors.error, flex: 2.5 }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 10,
    padding: 16,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  bmiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bmiValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bmiNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  bmiUnit: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  bmiCategory: {
    fontSize: 16,
    fontWeight: '600',
  },
  bmiScale: {
    marginTop: 8,
  },
  bmiScaleBar: {
    height: 8,
    backgroundColor: colors.white,
    borderRadius: 4,
    position: 'relative',
    marginBottom: 8,
  },
  bmiScaleIndicator: {
    position: 'absolute',
    top: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
    marginLeft: -10,
  },
  bmiScaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bmiScaleLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bmiScaleCategories: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  bmiScaleCategory: {
    height: '100%',
  },
});