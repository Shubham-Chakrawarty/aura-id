import baseConfig from "@aura/eslint-config/base";

export default [
  {
    // Global ignores: ignore packages (linted separately) and build artifacts
    ignores: ["packages/**", "dist/**", "node_modules/**"],
  },
  ...baseConfig,
];