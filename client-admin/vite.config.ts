import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@shared": path.resolve(import.meta.dirname, "..", "shared"),
      "@assets": path.resolve(import.meta.dirname, "..", "attached_assets"),
    },
  },
  build: {
    outDir: path.resolve(import.meta.dirname, "..", "dist", "admin"),
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === 'development',
    minify: process.env.NODE_ENV === 'production',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          admin: ['@monaco-editor/react', 'recharts'],
        },
      },
    },
  },
  server: {
    port: 5174,
    // Temporarily disable proxy to test frontend rendering
    // proxy: {
    //   '/api': {
    //     target: process.env.VITE_API_URL || 'http://localhost:3000',
    //     changeOrigin: true,
    //   },
    // },
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3000'),
  },
});
