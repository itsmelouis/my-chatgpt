import process from 'node:process'
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  testMatch: '**/tests/e2e/*.spec.ts',

  // Configuration spécifique pour Nuxt
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },

  // Configuration pour démarrer le serveur Nuxt avant les tests
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000 // 120 secondes pour démarrer le serveur
  }
})
