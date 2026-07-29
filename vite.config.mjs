import { defineConfig } from "vite";
import { resolveImpressCoordinates } from "./scripts/resolve-impress-coordinates.mjs";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/balisage-2026/" : "/",
  plugins: [
    {
      name: "impress-coordinate-resolver",
      transformIndexHtml(html) {
        return resolveImpressCoordinates(html);
      },
    },
  ],
}));
