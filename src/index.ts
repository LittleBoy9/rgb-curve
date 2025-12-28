// Main component
export { RGBCurve } from './components/RGBCurve';

// Sub-components (for advanced usage)
export { CurveCanvas } from './components/CurveCanvas';
export { ChannelTabs } from './components/ChannelTabs';

// Hooks
export { useCurvePoints } from './hooks/useCurvePoints';
export { useCanvasInteraction } from './hooks/useCanvasInteraction';

// Utilities
export {
  generateLUT,
  generateChannelLUT,
  applyLUT,
  getDefaultPoints,
  getDefaultChannelPoints,
  monotoneCubicInterpolation,
  catmullRomInterpolation,
  sortPoints,
  clamp,
  CHANNELS,
  CHANNEL_INFO,
} from './utils/curve';

// Constants
export {
  DEFAULT_STYLES,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  CHANNEL_COLORS,
} from './utils/constants';

// Types
export type {
  CurvePoint,
  Channel,
  ChannelPoints,
  LUTData,
  CurveChangeData,
  RGBCurveProps,
  RGBCurveRef,
  RGBCurveStyles,
  CurveLineStyle,
  ControlPointStyle,
  GridStyle,
  TabsStyle,
  HistogramStyle,
} from './types';
