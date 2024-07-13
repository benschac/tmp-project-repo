import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  noExternal: ['ky'], // Add any other non-native dependencies here
  external: ['fsevents'],
  platform: 'node',
  target: 'node14',
})
