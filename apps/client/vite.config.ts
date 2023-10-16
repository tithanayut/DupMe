import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: '../server/dist/dist',
    emptyOutDir: true,
  },
  plugins: [react()],
});
