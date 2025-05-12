// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@nuxt/test-utils',
    '@nuxtjs/mdc'
  ],
  devtools: { enabled: true },

  css: [
    '~/assets/css/main.css'
  ],

  mdc: {
    highlight: {
      theme: 'nord',
      langs: ['js', 'ts', 'html', 'css', 'json', 'yaml', 'bash', 'graphql', 'python'],
      wrapperStyle: true
    }
  },

  runtimeConfig: {
    databaseUrl: '',
    geminiApiKey: ''
  },

  future: {
    compatibilityVersion: 4
  },

  experimental: {
    viewTransition: true
  },

  compatibilityDate: '2024-11-01',

  nitro: {
    experimental: {
      openAPI: true
    }
  },

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
