import {
  useRef,
  useEffect,
  useCallback,
  memo,
  CSSProperties,
} from 'react';
import {
  CurvePoint,
  Channel,
  GridStyle,
  CurveLineStyle,
  ControlPointStyle,
  HistogramStyle,
} from '../types';
import {
  sortPoints,
  monotoneCubicInterpolation,
  catmullRomInterpolation,
} from '../utils/curve';
import { useCanvasInteraction } from '../hooks/useCanvasInteraction';
import { DEFAULT_STYLES } from '../utils/constants';

interface CurveCanvasProps {
  width: number;
  height: number;
  points: CurvePoint[];
  channel: Channel;
  gridStyle?: GridStyle;
  curveStyle?: CurveLineStyle;
  controlPointStyle?: ControlPointStyle;
  histogramStyle?: HistogramStyle;
  histogramData?: Uint8Array;
  wrapperStyle?: CSSProperties;
  disabled?: boolean;
  interpolation?: 'monotone' | 'catmullRom';
  onAddPoint: (channel: Channel, point: CurvePoint) => void;
  onRemovePoint: (channel: Channel, index: number) => void;
  onUpdatePoint: (channel: Channel, index: number, point: CurvePoint) => void;
}

export const CurveCanvas = memo(function CurveCanvas({
  width,
  height,
  points,
  channel,
  gridStyle = DEFAULT_STYLES.grid,
  curveStyle,
  controlPointStyle = DEFAULT_STYLES.controlPoint,
  histogramStyle = DEFAULT_STYLES.histogram,
  histogramData,
  wrapperStyle = DEFAULT_STYLES.canvasWrapper,
  disabled = false,
  interpolation = 'monotone',
  onAddPoint,
  onRemovePoint,
  onUpdatePoint,
}: CurveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    activePointIndex,
    hoveredPointIndex,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleDoubleClick,
  } = useCanvasInteraction({
    points,
    channel,
    width,
    height,
    disabled,
    onAddPoint,
    onRemovePoint,
    onUpdatePoint,
  });

  // Get device pixel ratio for sharp rendering
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  // Draw the canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width * dpr, height * dpr);

    // Scale for device pixel ratio
    ctx.save();
    ctx.scale(dpr, dpr);

    // Draw histogram if provided
    if (histogramStyle?.show && histogramData) {
      drawHistogram(ctx, histogramData, histogramStyle, width, height);
    }

    // Draw grid
    drawGrid(ctx, gridStyle, width, height);

    // Draw curve
    const interpolateFn =
      interpolation === 'monotone'
        ? monotoneCubicInterpolation
        : catmullRomInterpolation;
    drawCurve(ctx, points, curveStyle, width, height, interpolateFn);

    // Draw control points
    drawControlPoints(
      ctx,
      points,
      controlPointStyle,
      width,
      height,
      activePointIndex,
      hoveredPointIndex
    );

    ctx.restore();
  }, [
    width,
    height,
    dpr,
    points,
    gridStyle,
    curveStyle,
    controlPointStyle,
    histogramStyle,
    histogramData,
    interpolation,
    activePointIndex,
    hoveredPointIndex,
  ]);

  // Redraw on changes
  useEffect(() => {
    draw();
  }, [draw]);

  // Set canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    draw();
  }, [width, height, dpr, draw]);

  return (
    <div style={wrapperStyle}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          cursor: disabled
            ? 'not-allowed'
            : hoveredPointIndex !== null
            ? 'grab'
            : 'crosshair',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleDoubleClick}
      />
    </div>
  );
});

// Helper function to draw the grid
function drawGrid(
  ctx: CanvasRenderingContext2D,
  style: GridStyle,
  width: number,
  height: number
) {
  const { color, lineWidth, subdivisions, showDiagonal, diagonalColor } = {
    ...DEFAULT_STYLES.grid,
    ...style,
  };

  ctx.strokeStyle = color!;
  ctx.lineWidth = lineWidth!;

  // Draw vertical and horizontal lines
  const step = width / subdivisions!;
  for (let i = 1; i < subdivisions!; i++) {
    const pos = i * step;

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, height);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(width, pos);
    ctx.stroke();
  }

  // Draw border
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

  // Draw diagonal (baseline)
  if (showDiagonal) {
    ctx.strokeStyle = diagonalColor!;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, 0);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

// Helper function to draw the histogram
function drawHistogram(
  ctx: CanvasRenderingContext2D,
  data: Uint8Array,
  style: HistogramStyle,
  width: number,
  height: number
) {
  const { opacity, fillColor } = { ...DEFAULT_STYLES.histogram, ...style };

  // Find max value for normalization
  let max = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] > max) max = data[i];
  }

  if (max === 0) return;

  ctx.fillStyle = fillColor!;
  ctx.globalAlpha = opacity!;

  const barWidth = width / 256;

  for (let i = 0; i < 256; i++) {
    const barHeight = (data[i] / max) * height;
    const x = i * barWidth;
    ctx.fillRect(x, height - barHeight, barWidth, barHeight);
  }

  ctx.globalAlpha = 1;
}

// Helper function to draw the curve
function drawCurve(
  ctx: CanvasRenderingContext2D,
  points: CurvePoint[],
  style: CurveLineStyle | undefined,
  width: number,
  height: number,
  interpolate: (points: CurvePoint[], x: number) => number
) {
  const sorted = sortPoints(points);
  if (sorted.length === 0) return;

  const { color, width: lineWidth, shadowColor, shadowBlur } = {
    ...DEFAULT_STYLES.curve.master,
    ...style,
  };

  // Set up shadow
  if (shadowColor && shadowBlur) {
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
  }

  ctx.strokeStyle = color!;
  ctx.lineWidth = lineWidth!;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();

  // Draw curve by interpolating each x position
  for (let px = 0; px <= width; px++) {
    const curveX = (px / width) * 255;
    const curveY = interpolate(sorted, curveX);
    const canvasY = height - (curveY / 255) * height;

    if (px === 0) {
      ctx.moveTo(px, canvasY);
    } else {
      ctx.lineTo(px, canvasY);
    }
  }

  ctx.stroke();

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

// Helper function to draw control points
function drawControlPoints(
  ctx: CanvasRenderingContext2D,
  points: CurvePoint[],
  style: ControlPointStyle,
  width: number,
  height: number,
  activeIndex: number | null,
  hoveredIndex: number | null
) {
  const sorted = sortPoints(points);
  const {
    radius,
    fill,
    stroke,
    strokeWidth,
    activeFill,
    activeStroke,
    hoverScale,
  } = {
    ...DEFAULT_STYLES.controlPoint,
    ...style,
  };

  sorted.forEach((point, index) => {
    const canvasX = (point.x / 255) * width;
    const canvasY = height - (point.y / 255) * height;

    const isActive = index === activeIndex;
    const isHovered = index === hoveredIndex;
    const scale = isHovered || isActive ? hoverScale! : 1;
    const currentRadius = radius! * scale;

    ctx.beginPath();
    ctx.arc(canvasX, canvasY, currentRadius, 0, Math.PI * 2);

    // Fill
    ctx.fillStyle = isActive ? activeFill! : fill!;
    ctx.fill();

    // Stroke
    ctx.strokeStyle = isActive ? activeStroke! : stroke!;
    ctx.lineWidth = strokeWidth!;
    ctx.stroke();
  });
}
