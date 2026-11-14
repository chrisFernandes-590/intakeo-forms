import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@app/shared": resolve(__dirname, "../../packages/shared/src/index.ts"),
    },
  },
});
