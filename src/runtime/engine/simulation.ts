import type { Particle, ResolvedConfig } from './types'
import { hexToRgb, rand } from './utils'

export const DIRECTIONS: Record<string, { x: number, y: number }> = {
  none: { x: 0, y: 0 },
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

export const makeParticle = (
  cfg: ResolvedConfig,
  width: number,
  height: number,
  x?: number,
  y?: number,
): Particle => {
  const colors = Array.isArray(cfg.color) ? cfg.color : [cfg.color]
  const dir = DIRECTIONS[cfg.direction] ?? DIRECTIONS.none!
  const spd = rand(cfg.speed.min, cfg.speed.max)

  return {
    x: x ?? Math.random() * width,
    y: y ?? Math.random() * height,
    vx: (dir.x + (Math.random() - 0.5)) * spd,
    vy: (dir.y + (Math.random() - 0.5)) * spd,
    fx: 0,
    fy: 0,
    radius: rand(cfg.size.min, cfg.size.max),
    opacity: rand(cfg.opacity.min, cfg.opacity.max),
    color: hexToRgb(colors[Math.floor(Math.random() * colors.length)]!),
  }
}

export const applyRepulse = (
  particles: Particle[],
  cx: number,
  cy: number,
  radius: number,
  strength: number,
) => {
  const rSq = radius * radius
  for (const p of particles) {
    const dx = p.x - cx
    const dy = p.y - cy
    const dSq = dx * dx + dy * dy
    if (dSq < rSq && dSq > 0) {
      const d = Math.sqrt(dSq)
      const force = ((radius - d) / radius) * strength
      p.fx += (dx / d) * force
      p.fy += (dy / d) * force
    }
  }
}

export const stepParticles = (
  particles: Particle[],
  cfg: ResolvedConfig,
  width: number,
  height: number,
) => {
  for (const p of particles) {
    p.fx *= 0.92
    p.fy *= 0.92

    p.x += p.vx + p.fx
    p.y += p.vy + p.fy

    if (cfg.outMode === 'bounce') {
      if (p.x < p.radius) {
        p.x = p.radius
        p.vx = Math.abs(p.vx)
      }
      if (p.x > width - p.radius) {
        p.x = width - p.radius
        p.vx = -Math.abs(p.vx)
      }
      if (p.y < p.radius) {
        p.y = p.radius
        p.vy = Math.abs(p.vy)
      }
      if (p.y > height - p.radius) {
        p.y = height - p.radius
        p.vy = -Math.abs(p.vy)
      }
    }
    else {
      if (p.x < -p.radius) p.x = width + p.radius
      if (p.x > width + p.radius) p.x = -p.radius
      if (p.y < -p.radius) p.y = height + p.radius
      if (p.y > height + p.radius) p.y = -p.radius
    }
  }
}
