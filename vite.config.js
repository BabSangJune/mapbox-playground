import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM 환경에서 __dirname 구하기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // React Compiler (선택사항 - 최신 기능)
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    vanillaExtractPlugin(), // CSS-in-JS 솔루션
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],

  assetsInclude: ['**/*.glsl'],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/widgets': path.resolve(__dirname, './src/widgets'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/entities': path.resolve(__dirname, './src/entities'),
      '@/shared': path.resolve(__dirname, './src/shared'),
    },
  },

  server: {
    port: 3000, // mapbox-playground는 3000 포트 사용
    host: '0.0.0.0',
    open: true, // 자동으로 브라우저 열기
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Vendor chunk 최적화
        manualChunks(id) {
          // React 관련
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/scheduler')
          ) {
            return 'react-vendor';
          }

          // 상태관리 라이브러리
          if (
            id.includes('node_modules/@tanstack/react-query') ||
            id.includes('node_modules/zustand')
          ) {
            return 'state-vendor';
          }

          // 스타일 관련
          if (id.includes('node_modules/@vanilla-extract') || id.includes('node_modules/clsx')) {
            return 'style-vendor';
          }

          // Mapbox 관련 (추가)
          if (id.includes('node_modules/mapbox-gl') || id.includes('node_modules/react-map-gl')) {
            return 'mapbox-vendor';
          }

          // 유틸리티
          if (id.includes('node_modules/axios')) {
            return 'utils-vendor';
          }

          // 기타 node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
