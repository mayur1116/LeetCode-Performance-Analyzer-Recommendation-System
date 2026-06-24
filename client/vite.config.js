import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import os from "os";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy API calls to the backend during development
    // So we can call /api/... from the frontend without CORS issues
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
