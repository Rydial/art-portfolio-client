import react from "@vitejs/plugin-react";
import path from "path";
import {defineConfig} from "vite";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/abstracts" as *;`
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src")
    }
  },
  server: {
    port: 5173
  }
});
