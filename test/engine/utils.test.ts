import { describe, expect, it } from 'vitest'
import { DIRECTIONS, hexToRgb, rand } from '../../src/runtime/engine/utils'

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
