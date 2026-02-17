import { defineConfig } from "vite"
import { fileURLToPath, URL } from "node:url"
import { reactRouter } from "@react-router/dev/vite"
// https://vite.dev/config/
export default defineConfig({
  plugins: [reactRouter()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  ssr: {
    noExternal: ["react-syntax-highlighter"],
  },
  // Serve static files from public directory
  publicDir: "public",
})
