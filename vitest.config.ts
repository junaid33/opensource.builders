import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node', // jsdom -> node (Logic only, faster)
  },
})
