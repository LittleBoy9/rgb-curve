<div align="center">

# 🎨 RGB Curve

### A fast, lightweight RGB curve editor for React

Professional color grading curves like Adobe Lightroom, Premiere Pro, and Photoshop

[![npm version](https://img.shields.io/npm/v/rgb-curve?style=flat-square&color=blue)](https://www.npmjs.com/package/rgb-curve)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/rgb-curve?style=flat-square)](https://bundlephobia.com/package/rgb-curve)
[![npm downloads](https://img.shields.io/npm/dm/rgb-curve?style=flat-square&color=brightgreen)](https://www.npmjs.com/package/rgb-curve)
[![license](https://img.shields.io/npm/l/rgb-curve?style=flat-square&color=orange)](https://github.com/LittleBoy9/rgb-curve/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

<br />

![Demo](./assets/curve.gif)

![Demo](./assets/values.gif)

### [🚀 **Live Demo**](https://littleboy9.github.io/rgb-curve/) • [📖 **Full Docs**](#documentation) • [🌐 **Website**](https://littleboy9.github.io/rgb-curve/)

</div>

<br />

---

<br />

## ✨ Features

<table>
<tr>
<td width="50%">

**🎛️ Professional Grade**
- 4 channels: **Master** (RGB), **Red**, **Green**, **Blue**
- Smooth cubic spline interpolation
- Returns **control points** + **256-value LUT** for pixel processing

</td>
<td width="50%">

**🎨 Beautiful UI**
- Dark theme by default (Lightroom/Premiere Pro inspired)
- Fully customizable via JSON style props
- Smooth animations and interactions

</td>
</tr>
<tr>
<td width="50%">

**⚡ Fast & Lightweight**
- Zero dependencies (only React as peer dep)
- ~6KB gzipped
- Optimized canvas rendering

</td>
<td width="50%">

**🔧 Developer Friendly**
- Full TypeScript support
- Comprehensive API
- Extensive documentation

</td>
</tr>
</table>

<br />

---

<br />

## 📦 Installation

Choose your preferred package manager:

```bash
# npm
npm install rgb-curve

# yarn
yarn add rgb-curve

# pnpm
pnpm add rgb-curve

# bun
bun add rgb-curve
```

<br />

---

<br />

## � Table of Contents

- [Quick Start](#-quick-start)
- [How to Use](#-how-to-use)
- [Documentation](#-documentation)
  - [Props API](#props-api)
  - [onChange Data Structure](#onchange-data-structure)
  - [Ref Methods](#ref-methods)
- [Styling](#-styling)
  - [Complete Styles Example](#complete-styles-example)
  - [Style Reference](#style-reference)
  - [Theme Examples](#-theme-examples)
- [Applying LUT to Images](#-applying-lut-to-images)
- [Utility Exports](#-utility-exports)
- [TypeScript](#-typescript)
- [Browser Support](#-browser-support)
- [Contributing](#-contributing)
- [License](#-license)

<br />

---

<br />

## �🚀 Quick Start

Get up and running in seconds:

```tsx
import { RGBCurve } from 'rgb-curve';

function App() {
  return (
    <RGBCurve
      onChange={({ points, lut, activeChannel }) => {
        console.log('Control points:', points);
        console.log('LUT:', lut);
        console.log('Active channel:', activeChannel);
      }}
    />
  );
}
```

<br />

---

<br />

## 🎮 How to Use

<table>
<tr>
<th width="30%">Action</th>
<th width="70%">Description</th>
</tr>
<tr>
<td><kbd>Click</kbd> on curve</td>
<td>Add a new control point</td>
</tr>
<tr>
<td><kbd>Drag</kbd> a point</td>
<td>Adjust the curve shape</td>
</tr>
<tr>
<td><kbd>Double-click</kbd> a point</td>
<td>Remove the control point</td>
</tr>
<tr>
<td><kbd>Click</kbd> tabs</td>
<td>Switch between Master/R/G/B channels</td>
</tr>
</table>

<br />

---

<br />

## 📖 Documentation

### Props API

<table>
<tr>
<th width="20%">Prop</th>
<th width="25%">Type</th>
<th width="15%">Default</th>
<th width="40%">Description</th>
</tr>

<tr>
<td><code>width</code></td>
<td><code>number</code></td>
<td><code>300</code></td>
<td>Width of the curve editor in pixels</td>
</tr>

<tr>
<td><code>height</code></td>
<td><code>number</code></td>
<td><code>300</code></td>
<td>Height of the curve editor in pixels</td>
</tr>

<tr>
<td><code>defaultPoints</code></td>
<td><code>Partial&lt;ChannelPoints&gt;</code></td>
<td><code>—</code></td>
<td>Initial control points for each channel</td>
</tr>

<tr>
<td><code>points</code></td>
<td><code>Partial&lt;ChannelPoints&gt;</code></td>
<td><code>—</code></td>
<td>Controlled points (makes component controlled)</td>
</tr>

<tr>
<td><code>defaultChannel</code></td>
<td><code>Channel</code></td>
<td><code>'master'</code></td>
<td>Initial active channel</td>
</tr>

<tr>
<td><code>activeChannel</code></td>
<td><code>Channel</code></td>
<td><code>—</code></td>
<td>Controlled active channel</td>
</tr>

<tr>
<td><code>onChange</code></td>
<td><code>(data: CurveChangeData) =&gt; void</code></td>
<td><code>—</code></td>
<td>Callback when curve changes</td>
</tr>

<tr>
<td><code>onChannelChange</code></td>
<td><code>(channel: Channel) =&gt; void</code></td>
<td><code>—</code></td>
<td>Callback when channel changes</td>
</tr>

<tr>
<td><code>styles</code></td>
<td><code>RGBCurveStyles</code></td>
<td><code>—</code></td>
<td>Custom styles (see <a href="#-styling">Styling section</a>)</td>
</tr>

<tr>
<td><code>showTabs</code></td>
<td><code>boolean</code></td>
<td><code>true</code></td>
<td>Show/hide channel tabs</td>
</tr>

<tr>
<td><code>showHistogram</code></td>
<td><code>boolean</code></td>
<td><code>false</code></td>
<td>Show/hide histogram overlay</td>
</tr>

<tr>
<td><code>histogramData</code></td>
<td><code>Uint8Array</code></td>
<td><code>—</code></td>
<td>Histogram data (256 values)</td>
</tr>

<tr>
<td><code>disabled</code></td>
<td><code>boolean</code></td>
<td><code>false</code></td>
<td>Disable all interactions</td>
</tr>

<tr>
<td><code>className</code></td>
<td><code>string</code></td>
<td><code>—</code></td>
<td>CSS class for container</td>
</tr>

<tr>
<td><code>interpolation</code></td>
<td><code>'monotone' | 'catmullRom'</code></td>
<td><code>'monotone'</code></td>
<td>Curve interpolation algorithm</td>
</tr>

</table>

<br />

### onChange Data Structure

The `onChange` callback receives an object with:

```ts
interface CurveChangeData {
  // Control points for all channels
  points: {
    master: CurvePoint[];
    red: CurvePoint[];
    green: CurvePoint[];
    blue: CurvePoint[];
  };

  // Look-Up Table (256 values per channel) for pixel processing
  lut: {
    master: Uint8Array;
    red: Uint8Array;
    green: Uint8Array;
    blue: Uint8Array;
  };

  // Currently active channel
  activeChannel: 'master' | 'red' | 'green' | 'blue';
}

interface CurvePoint {
  x: number; // Input value: 0-255
  y: number; // Output value: 0-255
}
```

<br />

### Ref Methods

Access component methods using React refs:

```tsx
import { useRef } from 'react';
import { RGBCurve, RGBCurveRef } from 'rgb-curve';

function App() {
  const curveRef = useRef<RGBCurveRef>(null);

  return (
    <>
      <RGBCurve ref={curveRef} />

      <button onClick={() => curveRef.current?.reset()}>
        Reset All Channels
      </button>

      <button onClick={() => curveRef.current?.resetChannel('red')}>
        Reset Red Channel
      </button>

      <button onClick={() => {
        const lut = curveRef.current?.getLUT();
        console.log('Current LUT:', lut);
      }}>
        Get LUT Data
      </button>
    </>
  );
}
```

#### Available Methods

<table>
<tr>
<th width="40%">Method</th>
<th width="60%">Description</th>
</tr>
<tr>
<td><code>reset()</code></td>
<td>Reset all channels to default (diagonal line)</td>
</tr>
<tr>
<td><code>resetChannel(channel)</code></td>
<td>Reset a specific channel</td>
</tr>
<tr>
<td><code>getLUT()</code></td>
<td>Get current LUT data for all channels</td>
</tr>
<tr>
<td><code>getPoints()</code></td>
<td>Get current control points for all channels</td>
</tr>
<tr>
<td><code>setPoints(points)</code></td>
<td>Set control points programmatically</td>
</tr>
</table>

<br />

---

<br />

## 🎨 Styling

The component comes with a beautiful dark theme by default. You can customize every aspect using the `styles` prop.

### Complete Styles Example

```tsx
<RGBCurve
  styles={{
    // Container wrapper
    container: {
      background: '#1a1a1a',
      borderRadius: 12,
      padding: 16,
    },

    // Canvas wrapper
    canvasWrapper: {
      borderRadius: 8,
      overflow: 'hidden',
      background: '#0d0d0d',
    },

    // Grid lines
    grid: {
      color: '#2a2a2a',
      lineWidth: 1,
      subdivisions: 4,
      showDiagonal: true,
      diagonalColor: '#333333',
    },

    // Curve lines (per channel)
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

    // Control points
    controlPoint: {
      radius: 6,
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
      activeFill: '#ffd43b',
      activeStroke: '#000000',
      hoverScale: 1.2,
    },

    // Channel tabs
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

    // Histogram (if enabled)
    histogram: {
      show: true,
      opacity: 0.3,
      fillColor: '#666666',
    },
  }}
/>
```

---

## Style Reference

### Container Style

```ts
container: CSSProperties
```

Standard React CSS properties for the outer container.

```tsx
styles={{
  container: {
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
  }
}}
```

### Canvas Wrapper Style

```ts
canvasWrapper: CSSProperties
```

Standard React CSS properties for the canvas container.

```tsx
styles={{
  canvasWrapper: {
    borderRadius: 12,
    border: '1px solid #333',
    overflow: 'hidden',
  }
}}
```

### Grid Style

```ts
interface GridStyle {
  color?: string;        // Grid line color
  lineWidth?: number;    // Grid line width
  subdivisions?: number; // Number of grid divisions (default: 4)
  showDiagonal?: boolean; // Show diagonal baseline
  diagonalColor?: string; // Diagonal line color
}
```

```tsx
styles={{
  grid: {
    color: '#333333',
    lineWidth: 1,
    subdivisions: 4,
    showDiagonal: true,
    diagonalColor: '#444444',
  }
}}
```

### Curve Style

```ts
interface CurveLineStyle {
  color?: string;       // Curve line color
  width?: number;       // Curve line width
  shadowColor?: string; // Glow effect color
  shadowBlur?: number;  // Glow blur radius
}
```

```tsx
styles={{
  curve: {
    master: { color: '#ffffff', width: 2 },
    red: { color: '#ff0000', width: 2, shadowColor: 'rgba(255,0,0,0.5)', shadowBlur: 8 },
    green: { color: '#00ff00', width: 2 },
    blue: { color: '#0088ff', width: 3 },
  }
}}
```

### Control Point Style

```ts
interface ControlPointStyle {
  radius?: number;       // Point radius
  fill?: string;         // Point fill color
  stroke?: string;       // Point border color
  strokeWidth?: number;  // Point border width
  activeFill?: string;   // Fill when dragging
  activeStroke?: string; // Border when dragging
  hoverScale?: number;   // Scale on hover (1.2 = 120%)
}
```

```tsx
styles={{
  controlPoint: {
    radius: 8,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
    activeFill: '#ffcc00',
    activeStroke: '#000000',
    hoverScale: 1.3,
  }
}}
```

### Tabs Style

```ts
interface TabsStyle {
  background?: string;    // Tabs container background
  borderRadius?: number;  // Tabs container border radius
  gap?: number;           // Gap between tabs
  tab?: {
    padding?: string;
    borderRadius?: number;
    fontSize?: number;
    fontWeight?: number | string;
    color?: string;           // Inactive tab text color
    background?: string;      // Inactive tab background
    hoverBackground?: string; // Hover background
    activeColor?: string;     // Active tab text color
    activeBackground?: string; // Active tab background
  };
}
```

```tsx
styles={{
  tabs: {
    background: '#1a1a1a',
    borderRadius: 10,
    gap: 8,
    tab: {
      padding: '10px 20px',
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 600,
      color: '#666666',
      background: 'transparent',
      hoverBackground: '#2a2a2a',
      activeColor: '#ffffff',
      activeBackground: '#3a3a3a',
    },
  }
}}
```

### Histogram Style

```ts
interface HistogramStyle {
  show?: boolean;     // Show/hide histogram
  opacity?: number;   // Histogram opacity (0-1)
  fillColor?: string; // Histogram bar color
}
```

```tsx
<RGBCurve
  showHistogram={true}
  histogramData={myHistogramData} // Uint8Array of 256 values
  styles={{
    histogram: {
      opacity: 0.4,
      fillColor: '#888888',
    }
  }}
/>
```

<br />

---

<br />

## 🌈 Theme Examples

### Light Theme

```tsx
<RGBCurve
  styles={{
    container: {
      background: '#f5f5f5',
      borderRadius: 12,
      padding: 16,
    },
    canvasWrapper: {
      background: '#ffffff',
      borderRadius: 8,
      border: '1px solid #e0e0e0',
    },
    grid: {
      color: '#e0e0e0',
      diagonalColor: '#d0d0d0',
    },
    curve: {
      master: { color: '#333333', width: 2 },
      red: { color: '#e53935', width: 2 },
      green: { color: '#43a047', width: 2 },
      blue: { color: '#1e88e5', width: 2 },
    },
    controlPoint: {
      fill: '#ffffff',
      stroke: '#333333',
      activeFill: '#ffca28',
    },
    tabs: {
      background: '#e0e0e0',
      tab: {
        color: '#666666',
        activeColor: '#000000',
        activeBackground: '#ffffff',
        hoverBackground: '#eeeeee',
      },
    },
  }}
/>
```

### Neon Theme

```tsx
<RGBCurve
  styles={{
    container: {
      background: '#0a0a0a',
      borderRadius: 16,
      padding: 20,
      border: '1px solid #333',
    },
    canvasWrapper: {
      background: '#000000',
      borderRadius: 12,
    },
    grid: {
      color: '#1a1a1a',
      diagonalColor: '#2a2a2a',
    },
    curve: {
      master: {
        color: '#00ffff',
        width: 2,
        shadowColor: '#00ffff',
        shadowBlur: 10
      },
      red: {
        color: '#ff0066',
        width: 2,
        shadowColor: '#ff0066',
        shadowBlur: 10
      },
      green: {
        color: '#00ff66',
        width: 2,
        shadowColor: '#00ff66',
        shadowBlur: 10
      },
      blue: {
        color: '#0066ff',
        width: 2,
        shadowColor: '#0066ff',
        shadowBlur: 10
      },
    },
    controlPoint: {
      radius: 5,
      fill: '#ffffff',
      stroke: '#00ffff',
      strokeWidth: 2,
      activeFill: '#ff00ff',
      hoverScale: 1.4,
    },
    tabs: {
      background: '#111111',
      tab: {
        color: '#666666',
        activeColor: '#00ffff',
        activeBackground: '#1a1a1a',
        hoverBackground: '#1a1a1a',
      },
    },
  }}
/>
```

### Minimal Theme

```tsx
<RGBCurve
  styles={{
    container: {
      background: 'transparent',
      padding: 0,
    },
    canvasWrapper: {
      background: '#1a1a1a',
      borderRadius: 4,
    },
    grid: {
      color: '#252525',
      showDiagonal: false,
      subdivisions: 2,
    },
    curve: {
      master: { color: '#888', width: 1.5, shadowBlur: 0 },
      red: { color: '#f66', width: 1.5, shadowBlur: 0 },
      green: { color: '#6f6', width: 1.5, shadowBlur: 0 },
      blue: { color: '#66f', width: 1.5, shadowBlur: 0 },
    },
    controlPoint: {
      radius: 4,
      fill: '#fff',
      stroke: 'transparent',
      strokeWidth: 0,
      hoverScale: 1.5,
    },
    tabs: {
      background: 'transparent',
      gap: 8,
      tab: {
        padding: '6px 12px',
        background: 'transparent',
        hoverBackground: '#252525',
        activeBackground: '#333',
      },
    },
  }}
/>
```

<br />

---

<br />

## 🖼️ Applying LUT to Images

The LUT (Look-Up Table) returned by `onChange` enables fast, real-time pixel processing:

```tsx
import { RGBCurve, applyLUT, LUTData } from 'rgb-curve';

function ImageEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageData = useRef<ImageData | null>(null);

  const handleCurveChange = ({ lut }: { lut: LUTData }) => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImageData.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clone original data
    const imageData = new ImageData(
      new Uint8ClampedArray(originalImageData.current.data),
      originalImageData.current.width,
      originalImageData.current.height
    );

    // Apply LUT to each pixel
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b] = applyLUT(data[i], data[i + 1], data[i + 2], lut);
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <div>
      <RGBCurve onChange={handleCurveChange} />
      <canvas ref={canvasRef} />
    </div>
  );
}
```

<br />

---

<br />

## 🔧 Utility Exports

The package exports several utilities for advanced use cases:

```tsx
import {
  // Components
  RGBCurve,
  CurveCanvas,
  ChannelTabs,

  // Hooks
  useCurvePoints,
  useCanvasInteraction,

  // Utilities
  generateLUT,
  generateChannelLUT,
  applyLUT,
  getDefaultPoints,
  getDefaultChannelPoints,
  monotoneCubicInterpolation,
  catmullRomInterpolation,
  sortPoints,
  clamp,

  // Constants
  CHANNELS,
  CHANNEL_INFO,
  CHANNEL_COLORS,
  DEFAULT_STYLES,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,

  // Types
  type CurvePoint,
  type Channel,
  type ChannelPoints,
  type LUTData,
  type CurveChangeData,
  type RGBCurveProps,
  type RGBCurveRef,
  type RGBCurveStyles,
} from 'rgb-curve';
```

<br />

---

<br />

## 📘 TypeScript

Full TypeScript support is included. Import types as needed:

```tsx
import type {
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
} from 'rgb-curve';
```

<br />

---

<br />

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Latest ✅ |
| Firefox | Latest ✅ |
| Safari | Latest ✅ |
| Edge | Latest ✅ |

**Requirements:** Browsers with Canvas 2D support.

<br />

---

<br />

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. 🐛 **Report bugs** - Open an issue with a reproduction
2. 💡 **Suggest features** - Share your ideas for improvements
3. 🔧 **Submit PRs** - Fix bugs or add features
4. 📖 **Improve docs** - Help make the documentation better

### Development Setup

```bash
# Clone the repository
git clone https://github.com/LittleBoy9/rgb-curve.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build the library
npm run build:lib
```

<br />

---

<br />

## 📄 License

MIT © [Sounak Das](https://sounakdas.in)

<br />

---

<div align="center">

### Made with ❤️ by [Sounak Das](https://sounakdas.in)

If you find this project helpful, consider giving it a ⭐️ on [GitHub](https://github.com/LittleBoy9/rgb-curve)!

</div>
