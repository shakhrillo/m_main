import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: false,
  },
  envDir: "../",
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        api: "modern",
        silenceDeprecations: [
          "mixed-decls",
          "color-functions",
          "global-builtin",
          "import",
        ],
      },
    },
  },
  build: {
    cssCodeSplit: false,
  },
  optimizeDeps: {
    force: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
});
