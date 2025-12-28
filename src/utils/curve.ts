import { CurvePoint, LUTData, ChannelPoints, Channel } from '../types';

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Default points for a curve (diagonal line from 0,0 to 255,255)
 */
export function getDefaultPoints(): CurvePoint[] {
  return [
    { x: 0, y: 0 },
    { x: 255, y: 255 },
  ];
}

/**
 * Get default points for all channels
 */
export function getDefaultChannelPoints(): ChannelPoints {
  return {
    master: getDefaultPoints(),
    red: getDefaultPoints(),
    green: getDefaultPoints(),
    blue: getDefaultPoints(),
  };
}

/**
 * Sort points by x coordinate
 */
export function sortPoints(points: CurvePoint[]): CurvePoint[] {
  return [...points].sort((a, b) => a.x - b.x);
}

/**
 * Monotone cubic spline interpolation
 * This ensures the curve doesn't overshoot between control points
 * Based on Fritsch-Carlson method
 */
export function monotoneCubicInterpolation(
  points: CurvePoint[],
  x: number
): number {
  const sorted = sortPoints(points);
  const n = sorted.length;

  if (n === 0) return x;
  if (n === 1) return sorted[0].y;

  // Handle edge cases
  if (x <= sorted[0].x) return sorted[0].y;
  if (x >= sorted[n - 1].x) return sorted[n - 1].y;

  // Find the segment containing x
  let i = 0;
  while (i < n - 1 && sorted[i + 1].x < x) {
    i++;
  }

  const x0 = sorted[i].x;
  const x1 = sorted[i + 1].x;
  const y0 = sorted[i].y;
  const y1 = sorted[i + 1].y;

  // Calculate slopes
  const dx = x1 - x0;
  const dy = y1 - y0;

  if (dx === 0) return y0;

  // Calculate tangents using finite differences
  let m0: number, m1: number;

  if (i === 0) {
    m0 = dy / dx;
  } else {
    const prevDx = x0 - sorted[i - 1].x;
    const prevDy = y0 - sorted[i - 1].y;
    m0 = prevDx === 0 ? 0 : (dy / dx + prevDy / prevDx) / 2;
  }

  if (i === n - 2) {
    m1 = dy / dx;
  } else {
    const nextDx = sorted[i + 2].x - x1;
    const nextDy = sorted[i + 2].y - y1;
    m1 = nextDx === 0 ? 0 : (dy / dx + nextDy / nextDx) / 2;
  }

  // Ensure monotonicity
  const slope = dy / dx;
  if (slope === 0) {
    m0 = 0;
    m1 = 0;
  } else {
    const alpha = m0 / slope;
    const beta = m1 / slope;

    // Fritsch-Carlson condition for monotonicity
    if (alpha < 0) m0 = 0;
    if (beta < 0) m1 = 0;

    const sum = alpha * alpha + beta * beta;
    if (sum > 9) {
      const tau = 3 / Math.sqrt(sum);
      m0 = tau * alpha * slope;
      m1 = tau * beta * slope;
    }
  }

  // Hermite interpolation
  const t = (x - x0) / dx;
  const t2 = t * t;
  const t3 = t2 * t;

  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;

  const result = h00 * y0 + h10 * dx * m0 + h01 * y1 + h11 * dx * m1;

  return clamp(Math.round(result), 0, 255);
}

/**
 * Catmull-Rom spline interpolation
 * Smoother curves but may overshoot
 */
export function catmullRomInterpolation(
  points: CurvePoint[],
  x: number
): number {
  const sorted = sortPoints(points);
  const n = sorted.length;

  if (n === 0) return x;
  if (n === 1) return sorted[0].y;

  // Handle edge cases
  if (x <= sorted[0].x) return sorted[0].y;
  if (x >= sorted[n - 1].x) return sorted[n - 1].y;

  // Find the segment containing x
  let i = 0;
  while (i < n - 1 && sorted[i + 1].x < x) {
    i++;
  }

  // Get 4 points for Catmull-Rom (p0, p1, p2, p3)
  const p0 = sorted[Math.max(0, i - 1)];
  const p1 = sorted[i];
  const p2 = sorted[Math.min(n - 1, i + 1)];
  const p3 = sorted[Math.min(n - 1, i + 2)];

  const dx = p2.x - p1.x;
  if (dx === 0) return p1.y;

  const t = (x - p1.x) / dx;
  const t2 = t * t;
  const t3 = t2 * t;

  // Catmull-Rom matrix multiplication
  const result =
    0.5 *
    (2 * p1.y +
      (-p0.y + p2.y) * t +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

  return clamp(Math.round(result), 0, 255);
}

/**
 * Generate LUT for a single channel
 */
export function generateChannelLUT(
  points: CurvePoint[],
  interpolation: 'monotone' | 'catmullRom' = 'monotone'
): Uint8Array {
  const lut = new Uint8Array(256);
  const interpolate =
    interpolation === 'monotone'
      ? monotoneCubicInterpolation
      : catmullRomInterpolation;

  for (let i = 0; i < 256; i++) {
    lut[i] = interpolate(points, i);
  }

  return lut;
}

/**
 * Generate LUT for all channels
 */
export function generateLUT(
  channelPoints: ChannelPoints,
  interpolation: 'monotone' | 'catmullRom' = 'monotone'
): LUTData {
  return {
    master: generateChannelLUT(channelPoints.master, interpolation),
    red: generateChannelLUT(channelPoints.red, interpolation),
    green: generateChannelLUT(channelPoints.green, interpolation),
    blue: generateChannelLUT(channelPoints.blue, interpolation),
  };
}

/**
 * Apply LUT to RGB values
 */
export function applyLUT(
  r: number,
  g: number,
  b: number,
  lut: LUTData
): [number, number, number] {
  // Apply individual channel LUTs first
  let newR = lut.red[clamp(r, 0, 255)];
  let newG = lut.green[clamp(g, 0, 255)];
  let newB = lut.blue[clamp(b, 0, 255)];

  // Then apply master LUT to all
  newR = lut.master[newR];
  newG = lut.master[newG];
  newB = lut.master[newB];

  return [newR, newG, newB];
}

/**
 * Find the index where a new point should be inserted
 */
export function findInsertIndex(points: CurvePoint[], x: number): number {
  const sorted = sortPoints(points);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].x > x) return i;
  }
  return sorted.length;
}

/**
 * Check if a point is near another point (for hit testing)
 */
export function isPointNear(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  threshold: number
): boolean {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy) <= threshold;
}

/**
 * Get all channels as an array
 */
export const CHANNELS: Channel[] = ['master', 'red', 'green', 'blue'];

/**
 * Channel display info
 */
export const CHANNEL_INFO: Record<Channel, { label: string; shortLabel: string }> = {
  master: { label: 'Master', shortLabel: 'RGB' },
  red: { label: 'Red', shortLabel: 'R' },
  green: { label: 'Green', shortLabel: 'G' },
  blue: { label: 'Blue', shortLabel: 'B' },
};
