import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@app/shared": resolve(__dirname, "../../packages/shared/src/index.ts"),
      "@app/engine": resolve(__dirname, "../../packages/engine/src/index.ts"),
    },
  },
});
