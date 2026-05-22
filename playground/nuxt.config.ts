export default defineNuxtConfig({
  modules: ['@weburz/particle-canvas'],

  devtools: { enabled: true },
  compatibilityDate: 'latest',

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
  },

  nitro: {
    preset: 'github_pages',
  },
})
