import { CSSProperties } from 'react';

/**
 * A point on the curve
 */
export interface CurvePoint {
  x: number; // 0-255
  y: number; // 0-255
}

/**
 * Available curve channels
 */
export type Channel = 'master' | 'red' | 'green' | 'blue';

/**
 * Points for all channels
 */
export type ChannelPoints = Record<Channel, CurvePoint[]>;

/**
 * LUT (Look Up Table) for all channels - 256 values each
 */
export interface LUTData {
  master: Uint8Array;
  red: Uint8Array;
  green: Uint8Array;
  blue: Uint8Array;
}

/**
 * Data returned on onChange
 */
export interface CurveChangeData {
  /** Current control points for all channels */
  points: ChannelPoints;
  /** Generated LUT for pixel processing */
  lut: LUTData;
  /** Currently active channel */
  activeChannel: Channel;
}

/**
 * Style configuration for curve lines
 */
export interface CurveLineStyle {
  color?: string;
  width?: number;
  shadowColor?: string;
  shadowBlur?: number;
}

/**
 * Style configuration for control points
 */
export interface ControlPointStyle {
  radius?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  activeFill?: string;
  activeStroke?: string;
  hoverScale?: number;
}

/**
 * Style configuration for the grid
 */
export interface GridStyle {
  color?: string;
  lineWidth?: number;
  subdivisions?: number;
  showDiagonal?: boolean;
  diagonalColor?: string;
}

/**
 * Style configuration for channel tabs
 */
export interface TabsStyle {
  background?: string;
  borderRadius?: number;
  gap?: number;
  tab?: {
    padding?: string;
    borderRadius?: number;
    fontSize?: number;
    fontWeight?: number | string;
    color?: string;
    background?: string;
    hoverBackground?: string;
    activeColor?: string;
    activeBackground?: string;
  };
}

/**
 * Style configuration for histogram
 */
export interface HistogramStyle {
  show?: boolean;
  opacity?: number;
  fillColor?: string;
}

/**
 * Complete style configuration
 */
export interface RGBCurveStyles {
  /** Container styles */
  container?: CSSProperties;
  /** Canvas wrapper styles */
  canvasWrapper?: CSSProperties;
  /** Grid appearance */
  grid?: GridStyle;
  /** Curve line styles per channel */
  curve?: {
    master?: CurveLineStyle;
    red?: CurveLineStyle;
    green?: CurveLineStyle;
    blue?: CurveLineStyle;
  };
  /** Control point appearance */
  controlPoint?: ControlPointStyle;
  /** Channel tabs appearance */
  tabs?: TabsStyle;
  /** Histogram appearance */
  histogram?: HistogramStyle;
}

/**
 * Props for the RGBCurve component
 */
export interface RGBCurveProps {
  /** Width of the curve editor */
  width?: number;
  /** Height of the curve editor */
  height?: number;
  /** Initial points for all channels */
  defaultPoints?: Partial<ChannelPoints>;
  /** Controlled points (makes component controlled) */
  points?: Partial<ChannelPoints>;
  /** Default active channel */
  defaultChannel?: Channel;
  /** Controlled active channel */
  activeChannel?: Channel;
  /** Callback when curve changes */
  onChange?: (data: CurveChangeData) => void;
  /** Callback when active channel changes */
  onChannelChange?: (channel: Channel) => void;
  /** Custom styles */
  styles?: RGBCurveStyles;
  /** Show/hide channel tabs */
  showTabs?: boolean;
  /** Show/hide histogram */
  showHistogram?: boolean;
  /** Histogram data (256 values) */
  histogramData?: Uint8Array;
  /** Disable interaction */
  disabled?: boolean;
  /** Class name for container */
  className?: string;
  /** Interpolation type */
  interpolation?: 'monotone' | 'catmullRom';
}

/**
 * Ref methods exposed by RGBCurve
 */
export interface RGBCurveRef {
  /** Reset all curves to default (diagonal) */
  reset: () => void;
  /** Reset a specific channel */
  resetChannel: (channel: Channel) => void;
  /** Get current LUT data */
  getLUT: () => LUTData;
  /** Get current points */
  getPoints: () => ChannelPoints;
  /** Set points programmatically */
  setPoints: (points: Partial<ChannelPoints>) => void;
}
