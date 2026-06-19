import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuration Vite : port 5173 par défaut (déjà autorisé dans le CORS backend)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
