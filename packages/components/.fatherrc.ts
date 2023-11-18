import { defineConfig } from 'father'

export default defineConfig({
  esm: { output: 'dist', ignores: ['src/**/demo/**/*.*'] },
})
