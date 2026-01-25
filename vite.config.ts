import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.png'],
  server: {
    //host: true, // This makes the server listen on all addresses, including LAN and VPN
    port: 5173,
    proxy: {
      '/api/': {
        //target: 'http://192.168.88.63/api/', // VPN
        target: 'http://localhost:8443/', // This must be the same port as configured in Reef
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws: true,
      },
    },
  }
});
