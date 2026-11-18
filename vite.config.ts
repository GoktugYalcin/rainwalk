import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// `vite build --mode preview` produces a single self-contained HTML file
// (sample data + procedural scene) for sandboxed previews.
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === "preview" ? [viteSingleFile()] : [])],
  build: mode === "preview" ? { outDir: "dist-preview" } : undefined,
}));
