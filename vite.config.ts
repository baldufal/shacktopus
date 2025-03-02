import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  visualizer({
    filename: 'stats.html',
    open: true, // Opens in the browser automatically
  }),
  ],
  assetsInclude: ['**/*.png'],
  server: {
    //host: true, // This makes the server listen on all addresses, including LAN and VPN
    port: 5173,
    proxy: {
      '/api/': {
        target: 'http://localhost:8443/', // This must be the same port as configured in Reef
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws: true,
      },
    },
  }
});
