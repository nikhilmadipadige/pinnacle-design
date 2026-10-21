import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    target: "es2022",
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three/")) return "three-vendor";
          if (id.includes("node_modules/gsap/")) return "gsap-vendor";
          if (id.includes("node_modules/lenis/")) return "lenis-vendor";
        },
      },
    },
  },
});
