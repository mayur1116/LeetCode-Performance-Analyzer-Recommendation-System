import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import os from "os";

export default defineConfig({
  plugins: [react()],
  // Move Vite's cache outside OneDrive to avoid EPERM permission errors.
  // OneDrive locks files while syncing, which conflicts with Vite's cache cleanup.
  cacheDir: path.join(os.tmpdir(), "vite-leetcode-analyzer"),
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
