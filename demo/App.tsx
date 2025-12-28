import React, { useRef, useState, useCallback } from 'react';
import {
  RGBCurve,
  RGBCurveRef,
  CurveChangeData,
  applyLUT,
  LUTData,
} from 'rgb-curve';

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '8px',
    background: 'linear-gradient(90deg, #ff6b6b, #51cf66, #339af0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    color: '#888',
    fontSize: '1.1rem',
  },
  content: {
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  section: {
    flex: '1 1 300px',
    maxWidth: '400px',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#ccc',
  },
  dataBox: {
    background: '#1a1a1a',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '20px',
  },
  dataTitle: {
    fontSize: '0.9rem',
    color: '#888',
    marginBottom: '8px',
  },
  dataContent: {
    fontFamily: 'monospace',
    fontSize: '0.8rem',
    color: '#51cf66',
    maxHeight: '150px',
    overflow: 'auto',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-all' as const,
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all 0.15s ease',
  },
  primaryButton: {
    background: '#339af0',
    color: '#fff',
  },
  secondaryButton: {
    background: '#333',
    color: '#fff',
  },
  imageSection: {
    marginTop: '40px',
    textAlign: 'center' as const,
  },
  imageContainer: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
    marginTop: '16px',
  },
  imageBox: {
    background: '#1a1a1a',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center' as const,
  },
  imageLabel: {
    fontSize: '0.9rem',
    color: '#888',
    marginBottom: '8px',
  },
  canvas: {
    borderRadius: '8px',
    maxWidth: '100%',
  },
  instructions: {
    marginTop: '40px',
    background: '#1a1a1a',
    borderRadius: '12px',
    padding: '24px',
  },
  instructionTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '12px',
    color: '#ccc',
  },
  instructionList: {
    color: '#888',
    lineHeight: 1.8,
    paddingLeft: '20px',
  },
};

// Sample image data for demo
const SAMPLE_IMAGE_SIZE = 200;

function App() {
  const curveRef = useRef<RGBCurveRef>(null);
  const [curveData, setCurveData] = useState<CurveChangeData | null>(null);
  const [lut, setLut] = useState<LUTData | null>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement>(null);

  // Generate a sample gradient image
  const generateSampleImage = useCallback(() => {
    const canvas = originalCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create a colorful gradient
    for (let y = 0; y < SAMPLE_IMAGE_SIZE; y++) {
      for (let x = 0; x < SAMPLE_IMAGE_SIZE; x++) {
        const r = Math.floor((x / SAMPLE_IMAGE_SIZE) * 255);
        const g = Math.floor((y / SAMPLE_IMAGE_SIZE) * 255);
        const b = Math.floor(
          ((SAMPLE_IMAGE_SIZE - x + y) / (SAMPLE_IMAGE_SIZE * 2)) * 255
        );
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, []);

  // Apply LUT to the sample image
  const applyLUTToImage = useCallback(() => {
    const originalCanvas = originalCanvasRef.current;
    const processedCanvas = processedCanvasRef.current;
    if (!originalCanvas || !processedCanvas || !lut) return;

    const originalCtx = originalCanvas.getContext('2d');
    const processedCtx = processedCanvas.getContext('2d');
    if (!originalCtx || !processedCtx) return;

    const imageData = originalCtx.getImageData(
      0,
      0,
      SAMPLE_IMAGE_SIZE,
      SAMPLE_IMAGE_SIZE
    );
    const data = imageData.data;

    // Apply LUT to each pixel
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b] = applyLUT(data[i], data[i + 1], data[i + 2], lut);
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }

    processedCtx.putImageData(imageData, 0, 0);
  }, [lut]);

  // Initialize sample image on mount
  React.useEffect(() => {
    generateSampleImage();
  }, [generateSampleImage]);

  // Apply LUT whenever it changes
  React.useEffect(() => {
    if (lut) {
      applyLUTToImage();
    }
  }, [lut, applyLUTToImage]);

  const handleChange = useCallback((data: CurveChangeData) => {
    setCurveData(data);
    setLut(data.lut);
  }, []);

  const handleReset = useCallback(() => {
    curveRef.current?.reset();
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>RGB Curve</h1>
        <p style={styles.subtitle}>
          A fast, lightweight RGB curve editor for React
        </p>
      </header>

      <div style={styles.content}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Curve Editor</h2>
          <RGBCurve
            ref={curveRef}
            width={320}
            height={320}
            onChange={handleChange}
            showHistogram={false}
          />

          <div style={styles.buttonGroup}>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={handleReset}
            >
              Reset All
            </button>
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={() => curveRef.current?.resetChannel('master')}
            >
              Reset Master
            </button>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Live Preview</h2>
          <div style={styles.imageContainer}>
            <div style={styles.imageBox}>
              <div style={styles.imageLabel}>Original</div>
              <canvas
                ref={originalCanvasRef}
                width={SAMPLE_IMAGE_SIZE}
                height={SAMPLE_IMAGE_SIZE}
                style={styles.canvas}
              />
            </div>
            <div style={styles.imageBox}>
              <div style={styles.imageLabel}>Processed</div>
              <canvas
                ref={processedCanvasRef}
                width={SAMPLE_IMAGE_SIZE}
                height={SAMPLE_IMAGE_SIZE}
                style={styles.canvas}
              />
            </div>
          </div>

          {curveData && (
            <div style={styles.dataBox}>
              <div style={styles.dataTitle}>
                Control Points ({curveData.activeChannel})
              </div>
              <div style={styles.dataContent}>
                {JSON.stringify(curveData.points[curveData.activeChannel], null, 2)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={styles.instructions}>
        <h3 style={styles.instructionTitle}>How to use</h3>
        <ul style={styles.instructionList}>
          <li>
            <strong>Click</strong> on the curve to add a new control point
          </li>
          <li>
            <strong>Drag</strong> a control point to adjust the curve
          </li>
          <li>
            <strong>Double-click</strong> a control point to remove it
          </li>
          <li>Use the tabs to switch between Master, Red, Green, and Blue channels</li>
          <li>
            The live preview shows how your adjustments affect colors in real-time
          </li>
        </ul>
      </div>

      <div style={{ ...styles.dataBox, marginTop: '20px' }}>
        <div style={styles.dataTitle}>Installation</div>
        <div style={styles.dataContent}>
          {`npm install rgb-curve

// Usage
import { RGBCurve } from 'rgb-curve';

function App() {
  return (
    <RGBCurve
      width={300}
      height={300}
      onChange={({ points, lut }) => {
        console.log('Points:', points);
        console.log('LUT:', lut);
      }}
    />
  );
}`}
        </div>
      </div>
    </div>
  );
}

export default App;
