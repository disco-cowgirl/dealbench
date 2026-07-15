import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Local dev: the backend runs on port 8080 (see backend/src/server.ts).
// In production the Express server serves the built frontend itself, so
// this proxy only matters for `npm run dev`.
const apiProxyTarget = 'http://localhost:8080';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': apiProxyTarget,
    },
  },
});
