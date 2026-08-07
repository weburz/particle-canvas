import { describe, expect, it } from 'vitest'
import {
  hexToRgb,
  mergeConfig,
  pick,
  rand,
} from '../../src/runtime/engine/utils'

describe('hexToRgb', () => {
  it('parses 6-digit hex', () => {
    expect(hexToRgb('#ff8800')).toEqual({ r: 255, g: 136, b: 0 })
  })

  it('parses 3-digit shorthand hex', () => {
    expect(hexToRgb('#f80')).toEqual({ r: 255, g: 136, b: 0 })
  })

  it('accepts hex without leading hash', () => {
    expect(hexToRgb('00ff00')).toEqual({ r: 0, g: 255, b: 0 })
  })

  it('handles black and white', () => {
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
  })
})

describe('rand', () => {
  it('returns a number within [min, max)', () => {
    for (let i = 0; i < 1000; i++) {
      const v = rand(2, 5)
      expect(v).toBeGreaterThanOrEqual(2)
      expect(v).toBeLessThan(5)
    }
  })

  it('returns min when min equals max', () => {
    expect(rand(7, 7)).toBe(7)
  })
})

describe('pick', () => {
  it('always returns a member of the array', () => {
    for (let i = 0; i < 1000; i++) {
      expect(['a', 'b', 'c']).toContain(pick(['a', 'b', 'c']))
    }
  })

  it('returns the only element of a singleton array', () => {
    expect(pick(['only'])).toBe('only')
  })
})

describe('mergeConfig', () => {
  it('returns base values when override is empty', () => {
    const merged = mergeConfig({ count: 50, color: '#abc' }, {})
    expect(merged.count).toBe(50)
    expect(merged.color).toBe('#abc')
  })

  it('top-level scalars in override win', () => {
    const merged = mergeConfig({ count: 50 }, { count: 200 })
    expect(merged.count).toBe(200)
  })

  it('deep-merges linked so partial overrides keep base fields', () => {
    const merged = mergeConfig(
      { linked: { enable: true, distance: 200, color: '#000', width: 2, opacity: 0.5 } },
      { linked: { color: '#f00' } },
    )
    expect(merged.linked).toEqual({
      enable: true,
      distance: 200,
      color: '#f00',
      width: 2,
      opacity: 0.5,
    })
  })

  it('deep-merges interaction.hover and click independently', () => {
    const merged = mergeConfig(
      {
        interaction: {
          hover: { enable: true, mode: 'repulse', distance: 100 },
          click: { enable: true, mode: 'push', count: 3 },
        },
      },
      { interaction: { hover: { mode: 'grab' } } },
    )
    expect(merged.interaction?.hover).toEqual({
      enable: true,
      mode: 'grab',
      distance: 100,
    })
    expect(merged.interaction?.click).toEqual({
      enable: true,
      mode: 'push',
      count: 3,
    })
  })

  it('replaces size atomically (min/max are a coupled pair)', () => {
    const merged = mergeConfig(
      { size: { min: 1, max: 3 } },
      { size: { min: 4, max: 8 } },
    )
    expect(merged.size).toEqual({ min: 4, max: 8 })
  })

  it('does not mutate base or override', () => {
    const base = { linked: { distance: 100 } }
    const over = { linked: { color: '#f00' } }
    mergeConfig(base, over)
    expect(base).toEqual({ linked: { distance: 100 } })
    expect(over).toEqual({ linked: { color: '#f00' } })
  })
})
