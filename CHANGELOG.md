# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## Unreleased

### Changed

- Renamed the auto-imported composable `useParticleSystem` to
  `useActiveParticleSystem` (`useAdjectiveX` naming convention).
- Split the engine into focused, unit-testable modules: `config`
  (pure default resolution), `simulation` (pure physics), `renderer`
  (canvas drawing), and `particle-system` (lifecycle facade).
- Export `resolveConfig`, `DEFAULT_CONFIG`, and the `Range`/`ResolvedConfig`
  types from the engine.

## [0.1.1] - 2026-05-23

### Added

- `<ParticleCanvas />` component, auto-imported in Nuxt 4 apps.
- `useParticleSystem` composable, auto-imported alongside the component.
- Module options `defaults` (global `ParticleConfig`) and `prefix` (component name prefix).
  Per-component `:config` deep-merges over `defaults` for group fields (`linked`,
  `interaction.hover`, `interaction.click`, `density`); range pairs (`size`,
  `opacity`, `speed`) replace atomically.
- Zero-dependency particle engine with linked-line constellations, hover modes
  (`grab`, `repulse`, `bubble`), click modes (`push`, `repulse`), and density-aware
  particle scaling.
- Public TypeScript types: `ParticleConfig`, `Particle`, `RGB`.
- 19 engine unit tests + 1 SSR fixture e2e test.
