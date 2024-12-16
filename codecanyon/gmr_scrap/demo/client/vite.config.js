import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./dashboard/",
  server: {
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
})
