import type { ParticleConfig, ResolvedConfig } from './types'
import { mergeConfig } from './utils'

export const DEFAULT_CONFIG: ResolvedConfig = {
  count: 100,
  color: '#FFF',
  size: { min: 1, max: 3 },
  opacity: { min: 0.3, max: 0.8 },
  speed: { min: 0.2, max: 0.6 },
  direction: 'none',
  outMode: 'out',
  linked: {
    enable: true,
    distance: 130,
    color: '#a3c4e0',
    width: 1,
    opacity: 0.35,
  },
  interaction: {
    hover: {
      enable: true,
      mode: 'repulse',
      distance: 100,
    },
    click: {
      enable: true,
      mode: 'push',
      count: 3,
    },
  },
  density: {
    enable: true,
    area: 800,
  },
}

export const resolveConfig = (
  user: ParticleConfig = {},
  base: ParticleConfig = DEFAULT_CONFIG,
): ResolvedConfig =>
  mergeConfig(mergeConfig(DEFAULT_CONFIG, base), user) as ResolvedConfig
