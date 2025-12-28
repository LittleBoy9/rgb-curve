import { RGBCurveStyles } from '../types';

/**
 * Default curve width
 */
export const DEFAULT_WIDTH = 300;

/**
 * Default curve height
 */
export const DEFAULT_HEIGHT = 300;

/**
 * Default styles - Dark theme inspired by Lightroom/Premiere Pro
 */
export const DEFAULT_STYLES: Required<RGBCurveStyles> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  canvasWrapper: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#0d0d0d',
  },
  grid: {
    color: '#2a2a2a',
    lineWidth: 1,
    subdivisions: 4,
    showDiagonal: true,
    diagonalColor: '#333333',
  },
  curve: {
    master: {
      color: '#e0e0e0',
      width: 2,
      shadowColor: 'rgba(255, 255, 255, 0.3)',
      shadowBlur: 4,
    },
    red: {
      color: '#ff6b6b',
      width: 2,
      shadowColor: 'rgba(255, 107, 107, 0.4)',
      shadowBlur: 4,
    },
    green: {
      color: '#51cf66',
      width: 2,
      shadowColor: 'rgba(81, 207, 102, 0.4)',
      shadowBlur: 4,
    },
    blue: {
      color: '#339af0',
      width: 2,
      shadowColor: 'rgba(51, 154, 240, 0.4)',
      shadowBlur: 4,
    },
  },
  controlPoint: {
    radius: 6,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
    activeFill: '#ffd43b',
    activeStroke: '#000000',
    hoverScale: 1.2,
  },
  tabs: {
    background: '#252525',
    borderRadius: 8,
    gap: 4,
    tab: {
      padding: '8px 16px',
      borderRadius: 6,
      fontSize: 13,
      fontWeight: 500,
      color: '#808080',
      background: 'transparent',
      hoverBackground: '#333333',
      activeColor: '#ffffff',
      activeBackground: '#404040',
    },
  },
  histogram: {
    show: false,
    opacity: 0.3,
    fillColor: '#666666',
  },
};

/**
 * Channel colors for easy access
 */
export const CHANNEL_COLORS = {
  master: '#e0e0e0',
  red: '#ff6b6b',
  green: '#51cf66',
  blue: '#339af0',
} as const;

/**
 * Hit test threshold for control points (in pixels)
 */
export const POINT_HIT_THRESHOLD = 12;

/**
 * Minimum distance between points (in x-axis)
 */
export const MIN_POINT_DISTANCE = 5;
