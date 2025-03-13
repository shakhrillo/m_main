import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3030,
    host: true,
    open: false,
  },
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
});
