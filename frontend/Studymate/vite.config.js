import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    // This removes ALL console statements in production
    drop: ['console', 'debugger'], 
  },
});