import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Server configuration for development
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true,
  },

  // Build configuration
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
