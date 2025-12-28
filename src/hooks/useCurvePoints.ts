import { useState, useCallback, useMemo } from 'react';
import {
  CurvePoint,
  ChannelPoints,
  Channel,
  LUTData,
} from '../types';
import {
  getDefaultChannelPoints,
  sortPoints,
  generateLUT,
  clamp,
} from '../utils/curve';
import { MIN_POINT_DISTANCE } from '../utils/constants';

interface UseCurvePointsOptions {
  defaultPoints?: Partial<ChannelPoints>;
  controlledPoints?: Partial<ChannelPoints>;
  interpolation?: 'monotone' | 'catmullRom';
  onChange?: (points: ChannelPoints, lut: LUTData) => void;
}

interface UseCurvePointsReturn {
  points: ChannelPoints;
  lut: LUTData;
  addPoint: (channel: Channel, point: CurvePoint) => void;
  removePoint: (channel: Channel, index: number) => void;
  updatePoint: (channel: Channel, index: number, point: CurvePoint) => void;
  resetChannel: (channel: Channel) => void;
  resetAll: () => void;
  setChannelPoints: (channel: Channel, points: CurvePoint[]) => void;
  setAllPoints: (points: Partial<ChannelPoints>) => void;
}

export function useCurvePoints(
  options: UseCurvePointsOptions = {}
): UseCurvePointsReturn {
  const {
    defaultPoints,
    controlledPoints,
    interpolation = 'monotone',
    onChange,
  } = options;

  // Merge default points with provided defaults
  const initialPoints = useMemo(() => {
    const defaults = getDefaultChannelPoints();
    if (defaultPoints) {
      return {
        master: defaultPoints.master || defaults.master,
        red: defaultPoints.red || defaults.red,
        green: defaultPoints.green || defaults.green,
        blue: defaultPoints.blue || defaults.blue,
      };
    }
    return defaults;
  }, [defaultPoints]);

  const [internalPoints, setInternalPoints] =
    useState<ChannelPoints>(initialPoints);

  // Use controlled points if provided, otherwise internal state
  const points = useMemo(() => {
    if (controlledPoints) {
      const defaults = getDefaultChannelPoints();
      return {
        master: controlledPoints.master || defaults.master,
        red: controlledPoints.red || defaults.red,
        green: controlledPoints.green || defaults.green,
        blue: controlledPoints.blue || defaults.blue,
      };
    }
    return internalPoints;
  }, [controlledPoints, internalPoints]);

  // Generate LUT from points
  const lut = useMemo(() => {
    return generateLUT(points, interpolation);
  }, [points, interpolation]);

  // Helper to update points and trigger onChange
  const updatePoints = useCallback(
    (newPoints: ChannelPoints) => {
      if (!controlledPoints) {
        setInternalPoints(newPoints);
      }
      if (onChange) {
        const newLut = generateLUT(newPoints, interpolation);
        onChange(newPoints, newLut);
      }
    },
    [controlledPoints, onChange, interpolation]
  );

  // Add a new point to a channel
  const addPoint = useCallback(
    (channel: Channel, point: CurvePoint) => {
      const channelPoints = points[channel];

      // Check if point is too close to existing points
      const sorted = sortPoints(channelPoints);
      for (const p of sorted) {
        if (Math.abs(p.x - point.x) < MIN_POINT_DISTANCE) {
          return; // Don't add if too close
        }
      }

      const newChannelPoints = sortPoints([...channelPoints, point]);
      const newPoints = {
        ...points,
        [channel]: newChannelPoints,
      };

      updatePoints(newPoints);
    },
    [points, updatePoints]
  );

  // Remove a point from a channel (except first and last)
  const removePoint = useCallback(
    (channel: Channel, index: number) => {
      const channelPoints = points[channel];

      // Can't remove if only 2 points left
      if (channelPoints.length <= 2) return;

      // Sort to find actual index
      const sorted = sortPoints(channelPoints);

      // Can't remove first or last point
      if (index === 0 || index === sorted.length - 1) return;

      const newChannelPoints = sorted.filter((_, i) => i !== index);
      const newPoints = {
        ...points,
        [channel]: newChannelPoints,
      };

      updatePoints(newPoints);
    },
    [points, updatePoints]
  );

  // Update a point's position
  const updatePoint = useCallback(
    (channel: Channel, index: number, newPoint: CurvePoint) => {
      const channelPoints = sortPoints(points[channel]);
      const isFirst = index === 0;
      const isLast = index === channelPoints.length - 1;

      // Constrain x position for first and last points
      let x = newPoint.x;
      if (isFirst) {
        x = 0;
      } else if (isLast) {
        x = 255;
      } else {
        // Constrain x between adjacent points
        const prevX = channelPoints[index - 1].x + MIN_POINT_DISTANCE;
        const nextX = channelPoints[index + 1].x - MIN_POINT_DISTANCE;
        x = clamp(x, prevX, nextX);
      }

      // Clamp y to valid range
      const y = clamp(newPoint.y, 0, 255);

      const newChannelPoints = channelPoints.map((p, i) =>
        i === index ? { x, y } : p
      );

      const newPoints = {
        ...points,
        [channel]: newChannelPoints,
      };

      updatePoints(newPoints);
    },
    [points, updatePoints]
  );

  // Reset a single channel
  const resetChannel = useCallback(
    (channel: Channel) => {
      const defaults = getDefaultChannelPoints();
      const newPoints = {
        ...points,
        [channel]: defaults[channel],
      };

      updatePoints(newPoints);
    },
    [points, updatePoints]
  );

  // Reset all channels
  const resetAll = useCallback(() => {
    const defaults = getDefaultChannelPoints();
    updatePoints(defaults);
  }, [updatePoints]);

  // Set points for a specific channel
  const setChannelPoints = useCallback(
    (channel: Channel, newChannelPoints: CurvePoint[]) => {
      const newPoints = {
        ...points,
        [channel]: sortPoints(newChannelPoints),
      };

      updatePoints(newPoints);
    },
    [points, updatePoints]
  );

  // Set all points at once
  const setAllPoints = useCallback(
    (newPoints: Partial<ChannelPoints>) => {
      const defaults = getDefaultChannelPoints();
      const mergedPoints: ChannelPoints = {
        master: sortPoints(newPoints.master || defaults.master),
        red: sortPoints(newPoints.red || defaults.red),
        green: sortPoints(newPoints.green || defaults.green),
        blue: sortPoints(newPoints.blue || defaults.blue),
      };

      updatePoints(mergedPoints);
    },
    [updatePoints]
  );

  return {
    points,
    lut,
    addPoint,
    removePoint,
    updatePoint,
    resetChannel,
    resetAll,
    setChannelPoints,
    setAllPoints,
  };
}
