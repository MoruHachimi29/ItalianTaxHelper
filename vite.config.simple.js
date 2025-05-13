/**
 * Configurazione Vite semplificata 
 * Questa configurazione rimuove la distinzione client/server
 * e semplifica il deployment
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
      '@assets': resolve(__dirname, './attached_assets'),
      '@shared': resolve(__dirname, './shared'),
    },
  },
  server: {
    port: 5000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});