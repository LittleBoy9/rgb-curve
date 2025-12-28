import { useState, useCallback, useRef, useEffect, MouseEvent } from 'react';
import { CurvePoint, Channel } from '../types';
import { sortPoints, isPointNear } from '../utils/curve';
import { POINT_HIT_THRESHOLD } from '../utils/constants';

interface UseCanvasInteractionOptions {
  points: CurvePoint[];
  channel: Channel;
  width: number;
  height: number;
  disabled?: boolean;
  onAddPoint: (channel: Channel, point: CurvePoint) => void;
  onRemovePoint: (channel: Channel, index: number) => void;
  onUpdatePoint: (channel: Channel, index: number, point: CurvePoint) => void;
}

interface UseCanvasInteractionReturn {
  activePointIndex: number | null;
  hoveredPointIndex: number | null;
  handleMouseDown: (e: MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: () => void;
  handleMouseLeave: () => void;
  handleDoubleClick: (e: MouseEvent<HTMLCanvasElement>) => void;
}

export function useCanvasInteraction(
  options: UseCanvasInteractionOptions
): UseCanvasInteractionReturn {
  const {
    points,
    channel,
    width,
    height,
    disabled = false,
    onAddPoint,
    onRemovePoint,
    onUpdatePoint,
  } = options;

  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(
    null
  );
  const isDragging = useRef(false);

  // Convert canvas coordinates to curve coordinates (0-255)
  const canvasToCurve = useCallback(
    (canvasX: number, canvasY: number): CurvePoint => {
      return {
        x: Math.round((canvasX / width) * 255),
        y: Math.round((1 - canvasY / height) * 255), // Flip Y axis
      };
    },
    [width, height]
  );

  // Convert curve coordinates to canvas coordinates
  const curveToCanvas = useCallback(
    (curveX: number, curveY: number): { x: number; y: number } => {
      return {
        x: (curveX / 255) * width,
        y: (1 - curveY / 255) * height, // Flip Y axis
      };
    },
    [width, height]
  );

  // Find point at given canvas position
  const findPointAtPosition = useCallback(
    (canvasX: number, canvasY: number): number | null => {
      const sorted = sortPoints(points);

      for (let i = 0; i < sorted.length; i++) {
        const canvasPoint = curveToCanvas(sorted[i].x, sorted[i].y);
        if (
          isPointNear(
            { x: canvasX, y: canvasY },
            canvasPoint,
            POINT_HIT_THRESHOLD
          )
        ) {
          return i;
        }
      }

      return null;
    },
    [points, curveToCanvas]
  );

  // Get canvas position from mouse event
  const getCanvasPosition = useCallback(
    (e: MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
      const rect = e.currentTarget.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (disabled) return;

      const pos = getCanvasPosition(e);
      const pointIndex = findPointAtPosition(pos.x, pos.y);

      if (pointIndex !== null) {
        // Start dragging existing point
        setActivePointIndex(pointIndex);
        isDragging.current = true;
      } else {
        // Add new point
        const curvePoint = canvasToCurve(pos.x, pos.y);
        onAddPoint(channel, curvePoint);
      }
    },
    [
      disabled,
      getCanvasPosition,
      findPointAtPosition,
      canvasToCurve,
      channel,
      onAddPoint,
    ]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (disabled) return;

      const pos = getCanvasPosition(e);

      if (isDragging.current && activePointIndex !== null) {
        // Dragging a point
        const curvePoint = canvasToCurve(pos.x, pos.y);
        onUpdatePoint(channel, activePointIndex, curvePoint);
      } else {
        // Check for hover
        const pointIndex = findPointAtPosition(pos.x, pos.y);
        setHoveredPointIndex(pointIndex);
      }
    },
    [
      disabled,
      getCanvasPosition,
      activePointIndex,
      canvasToCurve,
      channel,
      onUpdatePoint,
      findPointAtPosition,
    ]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    setActivePointIndex(null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    isDragging.current = false;
    setActivePointIndex(null);
    setHoveredPointIndex(null);
  }, []);

  const handleDoubleClick = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (disabled) return;

      const pos = getCanvasPosition(e);
      const pointIndex = findPointAtPosition(pos.x, pos.y);

      if (pointIndex !== null) {
        onRemovePoint(channel, pointIndex);
      }
    },
    [disabled, getCanvasPosition, findPointAtPosition, channel, onRemovePoint]
  );

  // Handle global mouse up (in case mouse leaves canvas while dragging)
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
      setActivePointIndex(null);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return {
    activePointIndex,
    hoveredPointIndex,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleDoubleClick,
  };
}
