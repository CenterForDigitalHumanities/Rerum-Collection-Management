// Vite configuration for building the RCM library in library mode
import { defineConfig } from "vite";
import path from "node:path";

import { vitePlus } from "vite-plus";

export default defineConfig({
  plugins: [vitePlus()],
  build: {
    lib: {
      // Entry point of the library
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "RerumCollectionManagement",
      fileName: (format) => `rerum-collection-management.${format}.js`,
    },
    rollupOptions: {
      // Ensure external dependencies are not bundled
      external: [
        "node:fs",
        "node:path",
        // Peer dependencies (none currently but keep placeholder)
      ],
      output: {
        // Provide global variable names for UMD/IIFE builds if needed
        globals: {
          // e.g., "react": "React"
        },
      },
    },
    sourcemap: true,
    minify: false,
    outDir: "dist",
    target: "es2022",
  },
});