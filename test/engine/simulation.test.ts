import { describe, expect, it } from 'vitest'
import { resolveConfig } from '../../src/runtime/engine/config'
import {
  DIRECTIONS,
  applyRepulse,
  makeParticle,
  stepParticles,
} from '../../src/runtime/engine/simulation'
import type { Particle } from '../../src/runtime/engine/types'

const cfg = resolveConfig({ count: 10, color: '#ff0000' })

describe('DIRECTIONS', () => {
  it('exposes all four cardinal directions plus none', () => {
    expect(Object.keys(DIRECTIONS).sort()).toEqual([
      'bottom',
      'left',
      'none',
      'right',
      'top',
    ])
  })

  it('none is the zero vector', () => {
    expect(DIRECTIONS.none).toEqual({ x: 0, y: 0 })
  })

  it('cardinals are unit vectors', () => {
    expect(DIRECTIONS.top).toEqual({ x: 0, y: -1 })
    expect(DIRECTIONS.bottom).toEqual({ x: 0, y: 1 })
    expect(DIRECTIONS.left).toEqual({ x: -1, y: 0 })
    expect(DIRECTIONS.right).toEqual({ x: 1, y: 0 })
  })
})

describe('makeParticle', () => {
  it('spawns at random position by default', () => {
    const p = makeParticle(cfg, 800, 600)
    expect(p.x).toBeGreaterThanOrEqual(0)
    expect(p.x).toBeLessThan(800)
    expect(p.y).toBeGreaterThanOrEqual(0)
    expect(p.y).toBeLessThan(600)
  })

  it('uses the given origin when provided', () => {
    const p = makeParticle(cfg, 800, 600, 50, 60)
    expect(p.x).toBe(50)
    expect(p.y).toBe(60)
  })

  it('parses the configured color', () => {
    const p = makeParticle(cfg, 800, 600)
    expect(p.color.r).toBe(255)
    expect(p.color.g).toBe(0)
    expect(p.color.b).toBe(0)
  })

  it('keeps radius and opacity within configured ranges', () => {
    const fixed = resolveConfig({
      color: '#fff',
      size: { min: 2, max: 2 },
      opacity: { min: 0.5, max: 0.5 },
      speed: { min: 0.3, max: 0.3 },
    })
    const p = makeParticle(fixed, 800, 600, 0, 0)
    expect(p.radius).toBe(2)
    expect(p.opacity).toBe(0.5)
  })

  it('pushes velocity along the configured direction', () => {
    const right = resolveConfig({ direction: 'right', speed: { min: 1, max: 1 } })
    const p = makeParticle(right, 800, 600, 100, 100)
    expect(p.vx).toBeGreaterThan(0)
  })
})

describe('stepParticles', () => {
  it('wraps particles around the bounds in out mode', () => {
    const out = resolveConfig({ outMode: 'out' })
    const p: Particle = {
      x: -2, y: 602, vx: 0, vy: 0, fx: 0, fy: 0,
      radius: 1, opacity: 1, color: { r: 255, g: 255, b: 255 },
    }
    stepParticles([p], out, 800, 600)
    expect(p.x).toBe(801)
    expect(p.y).toBe(-1)
  })

  it('bounces off every edge in bounce mode', () => {
    const bounce = resolveConfig({ outMode: 'bounce' })
    const p: Particle = {
      x: -5, y: 605, vx: -2, vy: 2, fx: 0, fy: 0,
      radius: 2, opacity: 1, color: { r: 255, g: 255, b: 255 },
    }
    stepParticles([p], bounce, 800, 600)
    expect(p.x).toBe(2)
    expect(p.vx).toBe(2)
    expect(p.y).toBe(598)
    expect(p.vy).toBe(-2)
  })

  it('decays applied forces each step', () => {
    const out = resolveConfig({ outMode: 'out' })
    const p: Particle = {
      x: 100, y: 100, vx: 0, vy: 0, fx: 10, fy: 10,
      radius: 1, opacity: 1, color: { r: 255, g: 255, b: 255 },
    }
    stepParticles([p], out, 800, 600)
    expect(p.fx).toBeCloseTo(9.2)
    expect(p.fy).toBeCloseTo(9.2)
  })

  it('is deterministic for fixed velocity with no force', () => {
    const out = resolveConfig({ outMode: 'out' })
    const p: Particle = {
      x: 100, y: 100, vx: 5, vy: -3, fx: 0, fy: 0,
      radius: 1, opacity: 1, color: { r: 255, g: 255, b: 255 },
    }
    stepParticles([p], out, 800, 600)
    expect(p.x).toBe(105)
    expect(p.y).toBe(97)
  })
})

describe('applyRepulse', () => {
  it('pushes particles away from the center', () => {
    const particles = [
      {
        x: 10, y: 0, vx: 0, vy: 0, fx: 0, fy: 0,
        radius: 1, opacity: 1, color: { r: 255, g: 255, b: 255 },
      },
    ]
    applyRepulse(particles, 0, 0, 100, 1)
    expect(particles[0]!.fx).toBeGreaterThan(0)
  })

  it('leaves particles outside the radius untouched', () => {
    const particles = [
      {
        x: 200, y: 200, vx: 0, vy: 0, fx: 0, fy: 0,
        radius: 1, opacity: 1, color: { r: 255, g: 255, b: 255 },
      },
    ]
    applyRepulse(particles, 0, 0, 100, 1)
    expect(particles[0]!.fx).toBe(0)
    expect(particles[0]!.fy).toBe(0)
  })
})
