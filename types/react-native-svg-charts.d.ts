declare module 'react-native-svg-charts' {
  import { ViewStyle } from 'react-native';
  import { ReactNode } from 'react';

  interface ChartProps {
    style?: ViewStyle;
    data: number[];
    contentInset?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    svg?: {
      fill?: string;
      stroke?: string;
      strokeWidth?: number;
      fontSize?: number;
    };
    yMin?: number;
    yMax?: number;
    children?: ReactNode;
  }

  interface AxisProps {
    style?: ViewStyle;
    data: any[];
    contentInset?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    svg?: {
      fill?: string;
      stroke?: string;
      strokeWidth?: number;
      fontSize?: number;
    };
    numberOfTicks?: number;
    formatLabel?: (value: any, index: number) => string;
  }

  export const LineChart: React.FC<ChartProps>;
  export const Grid: React.FC;
  export const YAxis: React.FC<AxisProps>;
  export const XAxis: React.FC<AxisProps>;
} 