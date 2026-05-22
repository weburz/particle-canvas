import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ParticleSystem } from '../../src/runtime/engine/particle-system'

describe('ParticleSystem', () => {
  let canvas: HTMLCanvasElement

  beforeEach(() => {
    canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('constructs with default config', () => {
    expect(() => new ParticleSystem(canvas)).not.toThrow()
  })

  it('merges user config over defaults', () => {
    const sys = new ParticleSystem(canvas, {
      count: 42,
      color: '#ff0000',
      linked: {
        enable: false,
        distance: 50,
        color: '#00ff00',
        width: 2,
        opacity: 0.5,
      },
    })
    expect(sys).toBeDefined()
  })

  it('start() then destroy() runs without error', () => {
    const sys = new ParticleSystem(canvas, { count: 10 })
    sys.start()
    sys.destroy()
  })

  it('handles multiple destroy() calls safely', () => {
    const sys = new ParticleSystem(canvas, { count: 5 })
    sys.start()
    sys.destroy()
    expect(() => sys.destroy()).not.toThrow()
  })

  it('throws when canvas has no 2D context', () => {
    const broken = document.createElement('canvas')
    broken.getContext = (() => null) as never
    expect(() => new ParticleSystem(broken)).toThrow(/2D canvas context/)
  })

  it('supports array of colors', () => {
    const sys = new ParticleSystem(canvas, {
      count: 5,
      color: ['#ff0000', '#00ff00', '#0000ff'],
    })
    sys.start()
    sys.destroy()
  })

  it('supports bounce out mode', () => {
    const sys = new ParticleSystem(canvas, {
      count: 5,
      outMode: 'bounce',
    })
    sys.start()
    sys.destroy()
  })

  it('supports each hover mode', () => {
    for (const mode of ['grab', 'repulse', 'bubble'] as const) {
      const sys = new ParticleSystem(canvas, {
        count: 5,
        interaction: {
          hover: { enable: true, mode, distance: 100 },
          click: { enable: true, mode: 'push', count: 3 },
        },
      })
      sys.start()
      sys.destroy()
    }
  })

  it('supports each click mode', () => {
    for (const mode of ['push', 'repulse'] as const) {
      const sys = new ParticleSystem(canvas, {
        count: 5,
        interaction: {
          hover: { enable: true, mode: 'repulse', distance: 100 },
          click: { enable: true, mode, count: 3 },
        },
      })
      sys.start()
      sys.destroy()
    }
  })

  it('supports each direction', () => {
    for (const direction of [
      'none',
      'top',
      'bottom',
      'left',
      'right',
    ] as const) {
      const sys = new ParticleSystem(canvas, { count: 5, direction })
      sys.start()
      sys.destroy()
    }
  })
})
