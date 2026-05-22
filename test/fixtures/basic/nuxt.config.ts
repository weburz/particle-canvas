import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [MyModule],
  compatibilityDate: '2025-01-01',
  particleCanvas: {
    defaults: { count: 50 },
  },
})
