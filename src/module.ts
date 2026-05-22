import {
  addComponent,
  addImportsDir,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import type { ParticleConfig } from './runtime/engine'

export interface ModuleOptions {
  /**
   * Default ParticleConfig applied when a <ParticleCanvas> is rendered
   * without a `config` prop. Per-component config still overrides this.
   */
  defaults?: ParticleConfig

  /**
   * Component name prefix. Set to "" to disable the prefix.
   * @default ""
   */
  prefix?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@weburz/particle-canvas',
    configKey: 'particleCanvas',
    compatibility: {
      nuxt: '>=4.0.0',
    },
  },

  defaults: {
    defaults: {},
    prefix: '',
  },

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.particleCanvas = {
      defaults: options.defaults ?? {},
    }

    addComponent({
      name: `${options.prefix ?? ''}ParticleCanvas`,
      filePath: resolver.resolve('./runtime/components/ParticleCanvas.vue'),
    })

    addImportsDir(resolver.resolve('./runtime/composables'))
  },
})
