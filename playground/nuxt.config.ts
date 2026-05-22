export default defineNuxtConfig({
  modules: ['@weburz/particle-canvas'],

  devtools: { enabled: true },

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
  },
  compatibilityDate: 'latest',

  nitro: {
    preset: 'github_pages',
  },
})
