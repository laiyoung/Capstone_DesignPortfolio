import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const serverPort = process.env.PORT || 3000;
console.log(`api need to be running on port ${serverPort}`);

export default defineConfig({
  plugins: [react()],
  root: './client',  // Set the root to the client folder
  server: {
    proxy: {
      '/api': `http://localhost:${serverPort}`,
    },
  },
});
