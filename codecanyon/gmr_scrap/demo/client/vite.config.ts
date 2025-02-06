import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4200,
    host: true,
    open: false,
    hmr: {
      protocol: "wss", // Change to "ws" if using HTTP
    },
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
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
});
