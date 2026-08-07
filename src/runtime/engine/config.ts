import type { ParticleConfig, ResolvedConfig } from './types'

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

export const resolveConfig = (user: ParticleConfig = {}): ResolvedConfig => ({
  count: user.count ?? DEFAULT_CONFIG.count,
  color: user.color ?? DEFAULT_CONFIG.color,
  size: user.size ?? DEFAULT_CONFIG.size,
  opacity: user.opacity ?? DEFAULT_CONFIG.opacity,
  speed: user.speed ?? DEFAULT_CONFIG.speed,
  direction: user.direction ?? DEFAULT_CONFIG.direction,
  outMode: user.outMode ?? DEFAULT_CONFIG.outMode,

  linked: { ...DEFAULT_CONFIG.linked, ...user.linked },

  interaction: {
    hover: { ...DEFAULT_CONFIG.interaction.hover, ...user.interaction?.hover },
    click: { ...DEFAULT_CONFIG.interaction.click, ...user.interaction?.click },
  },

  density: { ...DEFAULT_CONFIG.density, ...user.density },
})
