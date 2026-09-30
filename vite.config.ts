import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve, isAbsolute } from 'node:path';
import ssl from '@vitejs/plugin-basic-ssl';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isExternal = (id: string) => {
  return !id.startsWith('.') && !isAbsolute(id) && !id.startsWith('~');
};

// vitest automatically sets NODE_ENV to 'test' when running tests
// const isTest = process.env.NODE_ENV === 'test';

const aliasPaths = {
  // Main source files alias
  '>': resolve(__dirname, 'src'),
  // Outer alias
  '<': resolve(__dirname, './'),
};

const isAliasValid = Object.values(aliasPaths).every((p) => !isExternal(p));

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: isAliasValid ? aliasPaths : {},
    tsconfigPaths: true, // Enable tsconfig paths resolution
    dedupe: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
    ],
  },
  optimizeDeps: {
    include: ['@floating-ui/react-dom'],
  },
  plugins: [
    ssl(),
    react(),
    svgr(),
    visualizer({
      filename: 'stats.html', // Where the report will be saved
      open: true, // Opens the report automatically after build
      gzipSize: true,
      brotliSize: true,
    }),
    tailwindcss(),
  ],
  // test: {
  //   globals: true,
  //   environment: 'jsdom',
  //   css: true,
  //   setupFiles: './tests/setup.js',
  // },
  server: {
    host: 'example.com',
    port: 5161,
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
  },
});
