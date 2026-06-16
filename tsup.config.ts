import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  // Bundle the component's CSS into the JS so consumers get styles automatically
  // by just importing the component — no separate CSS import required.
  injectStyle: true,
  // React is a peer dependency; never bundle it into the package.
  external: ['react', 'react-dom'],
});
