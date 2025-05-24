import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

interface ChartContainerProps {
  data: any[];
  dateRange: { start: Date; end: Date };
  readingType: string;
}

export function ChartContainer({ data, dateRange, readingType }: ChartContainerProps) {
  // This would be a real chart in a production app
  // For now, we'll just render a placeholder
  
  const chartHeight = 200;
  const maxValue = data.length > 0 ? Math.max(...data.map(item => item.value)) : 100;
  
  // Generate some sample points for demo
  const generatePoints = () => {
    if (data.length === 0) return [];
    
    return data.map((item, index) => {
      const x = (index / (data.length - 1)) * (width - 60);
      const y = chartHeight - (item.value / maxValue) * chartHeight;
      return { x, y, value: item.value };
    });
  };
  
  const points = generatePoints();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tendance</Text>
      
      {data.length > 0 ? (
        <View style={styles.chartContent}>
          <View style={styles.chartContainer}>
            {/* Y-axis labels */}
            <View style={styles.yAxis}>
              <Text style={styles.axisLabel}>{maxValue}</Text>
              <Text style={styles.axisLabel}>{Math.round(maxValue / 2)}</Text>
              <Text style={styles.axisLabel}>0</Text>
            </View>
            
            {/* Chart area */}
            <View style={styles.chart}>
              {/* Grid lines */}
              <View style={[styles.gridLine, { top: 0 }]} />
              <View style={[styles.gridLine, { top: chartHeight / 2 }]} />
              <View style={[styles.gridLine, { top: chartHeight }]} />
              
              {/* Render points */}
              {points.map((point, index) => (
                <View
                  key={index}
                  style={[
                    styles.dataPoint,
                    {
                      left: point.x,
                      top: point.y,
                      backgroundColor: 
                        readingType === 'blood' 
                          ? colors.primary 
                          : colors.secondary,
                    },
                  ]}
                />
              ))}
              
              {/* Connect points with lines */}
              <View style={styles.chartLines}>
                {/* This would be SVG lines in a real chart implementation */}
              </View>
            </View>
          </View>
          
          {/* X-axis labels */}
          <View style={styles.xAxis}>
            <Text style={styles.axisLabel}>
              {dateRange.start.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
            </Text>
            <Text style={styles.axisLabel}>
              {new Date(
                (dateRange.start.getTime() + dateRange.end.getTime()) / 2
              ).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
            </Text>
            <Text style={styles.axisLabel}>
              {dateRange.end.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptyChart}>
          <Text style={styles.emptyText}>Aucune donnée disponible pour cette période</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  chartContent: {
    height: 250,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 200,
  },
  yAxis: {
    width: 30,
    height: 200,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 5,
  },
  chart: {
    flex: 1,
    height: 200,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.backgroundLight,
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
    marginTop: -4,
  },
  chartLines: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
    marginTop: 10,
  },
  axisLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyChart: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});