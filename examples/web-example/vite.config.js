import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      turfetch: path.resolve(__dirname, "../../dist/esm"),
    },
  },
});
