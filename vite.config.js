import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
/*
export default {
  server: {
    host: '0.0.0.0', // This allows connections from any network interface
    port: 3000, // Replace with your desired port
  },
};*/

