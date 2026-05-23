import type { ParticleConfig, RGB } from './types'

export const hexToRgb = (hex: string): RGB => {
  let h = hex.replace(/^#/, '')
  if (h.length === 3) {
    h = h
      .split('')
      .map(c => c + c)
      .join('')
  }
  const n = Number.parseInt(h, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

export const rand = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

export const DIRECTIONS: Record<string, { x: number, y: number }> = {
  none: { x: 0, y: 0 },
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

export const mergeConfig = (
  base: ParticleConfig,
  over: ParticleConfig,
): ParticleConfig => ({
  ...base,
  ...over,
  linked: { ...base.linked, ...over.linked },
  interaction: {
    hover: { ...base.interaction?.hover, ...over.interaction?.hover },
    click: { ...base.interaction?.click, ...over.interaction?.click },
  },
  density: { ...base.density, ...over.density },
})
