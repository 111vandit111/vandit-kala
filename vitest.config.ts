import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["lib/server/**/*.test.ts", "lib/__tests__/**/*.test.ts"],
    environment: "node",
    env: { NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "demo" },
  },
});
