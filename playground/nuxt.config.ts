export default defineNuxtConfig({
  modules: ['@weburz/particle-canvas'],

  devtools: { enabled: true },

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
  },

  // Set via NUXT_PUBLIC_UMAMI_WEBSITE_ID at build time (repo Actions variable);
  // empty in dev, so local runs never pollute the stats.
  runtimeConfig: {
    public: {
      umamiWebsiteId: '',
    },
  },
  compatibilityDate: 'latest',

  nitro: {
    preset: 'github_pages',
  },
})
