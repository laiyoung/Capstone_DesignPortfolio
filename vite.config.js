import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const serverPort = process.env.PORT || 3000;
console.log(`api need to be running on port ${serverPort}`);

export default defineConfig({
  plugins: [react()],
  root: "./client",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": `http://localhost:${serverPort}`,
    },
  },

});
