import { describe, expect, it } from 'vitest'
import { DEFAULT_CONFIG, resolveConfig } from '../../src/runtime/engine/config'

describe('resolveConfig', () => {
  it('returns defaults when no user config is given', () => {
    expect(resolveConfig()).toEqual(DEFAULT_CONFIG)
    expect(resolveConfig(undefined)).toEqual(DEFAULT_CONFIG)
  })

  it('resolves top-level scalars with defaults', () => {
    const resolved = resolveConfig({ count: 42, color: '#ff0000' })
    expect(resolved.count).toBe(42)
    expect(resolved.color).toBe('#ff0000')
    expect(resolved.direction).toBe('none')
    expect(resolved.outMode).toBe('out')
  })

  it('defaults a partial range but keeps the given one', () => {
    const resolved = resolveConfig({ size: { min: 4, max: 8 } })
    expect(resolved.size).toEqual({ min: 4, max: 8 })
    expect(resolved.opacity).toEqual(DEFAULT_CONFIG.opacity)
    expect(resolved.speed).toEqual(DEFAULT_CONFIG.speed)
  })

  it('deep-merges linked so partial overrides keep defaults', () => {
    const resolved = resolveConfig({ linked: { color: '#00ff00' } })
    expect(resolved.linked).toEqual({
      enable: true,
      distance: 130,
      color: '#00ff00',
      width: 1,
      opacity: 0.35,
    })
  })

  it('deep-merges hover and click independently', () => {
    const resolved = resolveConfig({
      interaction: { hover: { mode: 'grab' } },
    })
    expect(resolved.interaction.hover).toEqual({
      enable: true,
      mode: 'grab',
      distance: 100,
    })
    expect(resolved.interaction.click).toEqual(DEFAULT_CONFIG.interaction.click)
  })

  it('does not mutate the user config', () => {
    const user = { linked: { distance: 50 } }
    resolveConfig(user)
    expect(user).toEqual({ linked: { distance: 50 } })
  })
})
