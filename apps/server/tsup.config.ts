import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node22',
  clean: true,
  sourcemap: true,
  minify: true,
  // This is the magic for your monorepo:
  noExternal: ['@aura/shared'],
  // Ensure the output is named index.js to match your start script
  outExtension() {
    return { js: '.js' };
  },
});
