import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'engine',
          include: ['test/engine/**/*.test.ts'],
          environment: 'happy-dom',
          globals: true,
          setupFiles: ['./test/engine/setup.ts'],
        },
      },
      {
        test: {
          name: 'e2e',
          include: ['test/basic.test.ts'],
          environment: 'node',
          testTimeout: 60_000,
          hookTimeout: 60_000,
        },
      },
    ],
  },
})
