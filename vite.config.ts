import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use GitHub Pages base path on CI, '/' locally
  base: process.env.GITHUB_ACTIONS === "true"
    ? `/${(process.env.GITHUB_REPOSITORY || "react-based-docx").split("/")[1]}/`
    : "/",
  define: {
    // Provide a polyfill for process.env
    "process.env": {},
  },
});
