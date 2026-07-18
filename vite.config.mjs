import { defineConfig } from "vite";
import { resolveImpressCoordinates } from "./scripts/resolve-impress-coordinates.mjs";

export default defineConfig({
  plugins: [
    {
      name: "impress-coordinate-resolver",
      transformIndexHtml(html) {
        return resolveImpressCoordinates(html);
      },
    },
  ],
});
