import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import path from "path";
import { fileURLToPath } from "url";

// ESM replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: path.resolve(__dirname, "client"),

  plugins: [
    react(),
    tailwindcss(),
    jsxLocPlugin(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@assets": path.resolve(__dirname, "client", "public"),
    },
  },

  publicDir: path.resolve(__dirname, "client", "public"),

  build: {
    outDir: path.resolve(__dirname, "client", "dist"), // ✅ fix here
    emptyOutDir: true,
  },

  server: {
    host: true,
    port: 5173,
  },
});
