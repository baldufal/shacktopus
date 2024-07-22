import { defineConfig } from 'vite'
import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './cert/localhost+3-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './cert/localhost+3.pem'))
    },
    host: true, // This makes the server listen on all addresses, including LAN and VPN
    port: 5173
  }
})
