import React from 'react';
import { View, Text, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { LineChart, Grid, YAxis } from 'react-native-svg-charts';
import { colors } from '@/constants/colors';

type ChartContainerProps = {
  data: Array<{
    type: 'blood' | 'urine';
    value: number;
    timestamp: string;
  }>;
  dateRange: {
    start: Date;
    end: Date;
  };
  readingType: 'all' | 'blood' | 'urine';
};

export const ChartContainer: React.FC<ChartContainerProps> = ({
  data,
  dateRange,
  readingType,
}) => {
  // Trier les données par date
  const sortedData = [...data].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Séparer les données par type
  const bloodData = sortedData.filter(item => item.type === 'blood');
  const urineData = sortedData.filter(item => item.type === 'urine');

  // Préparer les données pour le graphique
  const bloodValues = bloodData.map(item => item.value);
  const urineValues = urineData.map(item => item.value);

  // Trouver les valeurs min et max pour l'axe Y
  const allValues = [...bloodValues, ...urineValues];
  const minValue = Math.min(...allValues, 0);
  const maxValue = Math.max(...allValues, 100);

  // Configuration des axes
  const contentInset = { top: 10, bottom: 10, left: 10, right: 10 };

  // Styles combinés pour les graphiques
  const bloodChartStyle: ViewStyle = {
    ...styles.chart,
    zIndex: 2,
  };

  const urineChartStyle: ViewStyle = {
    ...styles.chart,
    zIndex: 1,
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <YAxis
          data={[minValue, maxValue]}
          contentInset={contentInset}
          svg={{ fill: colors.textSecondary, fontSize: 12 }}
          numberOfTicks={5}
          formatLabel={(value: number) => `${value} mg/dL`}
        />
        <View style={styles.chartContent}>
          {readingType === 'all' && (
            <>
              <LineChart
                style={bloodChartStyle}
                data={bloodValues}
                svg={{
                  stroke: colors.error,
                  strokeWidth: 2,
                }}
                contentInset={contentInset}
                yMin={minValue}
                yMax={maxValue}
              >
                <Grid />
              </LineChart>
              <LineChart
                style={urineChartStyle}
                data={urineValues}
                svg={{
                  stroke: colors.warning,
                  strokeWidth: 2,
                }}
                contentInset={contentInset}
                yMin={minValue}
                yMax={maxValue}
              />
            </>
          )}
          {readingType !== 'all' && (
            <LineChart
              style={styles.chart}
              data={readingType === 'urine' ? urineValues : bloodValues}
              svg={{
                stroke: readingType === 'urine' ? colors.warning : colors.error,
                strokeWidth: 2,
              }}
              contentInset={contentInset}
              yMin={minValue}
              yMax={maxValue}
            >
              <Grid />
            </LineChart>
          )}
        </View>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.error }]} />
          <Text style={styles.legendText}>Glycémie</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.warning }]} />
          <Text style={styles.legendText}>Glucose urinaire</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartContainer: {
    height: 220,
    flexDirection: 'row',
  },
  chartContent: {
    flex: 1,
    marginLeft: 10,
  },
  chart: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});