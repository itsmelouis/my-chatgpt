// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@nuxt/test-utils'
  ],
  devtools: { enabled: true },

  css: [
    '~/assets/css/main.css'
  ],

  runtimeConfig: {
    databaseUrl: '',
    geminiApiKey: ''
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-11-01',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  fonts: {
    priority: ['google', 'local'],
    provider: 'google'
  }
})
