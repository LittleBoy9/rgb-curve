import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Library build mode
  if (mode === 'lib') {
    return {
      plugins: [
        react(),
        dts({
          include: ['src'],
          outDir: 'dist',
          rollupTypes: true,
        }),
      ],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'RGBCurve',
          fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
          formats: ['es', 'cjs'],
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'jsxRuntime',
            },
          },
        },
        cssCodeSplit: false,
        sourcemap: true,
      },
      resolve: {
        alias: {
          '@': resolve(__dirname, 'src'),
        },
      },
    };
  }

  // Development/demo mode
  return {
    plugins: [react()],
    root: 'demo',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        'rgb-curve': resolve(__dirname, 'src/index.ts'),
      },
    },
    server: {
      port: 3000,
      open: true,
    },
  };
});
