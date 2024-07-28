import { defineConfig } from 'vite'
import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react'
import https from 'https'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './cert/localhost+3-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './cert/localhost+3.pem'))
    },
    host: true, // This makes the server listen on all addresses, including LAN and VPN
    port: 5173,
    proxy: {
      '/api/': {
        target: 'https://localhost:8443/',
        changeOrigin: true,
        secure: false,  // Set to true if your target uses HTTPS
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws: true,
        agent: new https.Agent({ 
          rejectUnauthorized: false // Ignore self-signed certificate verification
        }),
      },
    },
  }
})
