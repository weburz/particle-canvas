# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.2.1] - 2026-08-07

### Changed

- `resolveConfig` now composes the shared `mergeConfig` instead of repeating
  the nested group-merge logic; the module-level `defaults` base is applied in
  the same single pass, so config priority is unchanged.
- Internal engine cleanup with no public API changes: named union types
  (`Direction`, `OutMode`, `HoverMode`, `ClickMode`), centralised randomness via
  `rand`/`pick`, named magic values (force decay, jitter, repulse strengths,
  click push cap), and one shared particle fixture across tests.

## [0.2.0] - 2026-08-07

### Changed

- **Breaking:** Renamed the auto-imported composable `useParticleSystem` to
  `useActiveParticleSystem` (`useAdjectiveX` naming convention). Migrate
  imports from the old name.
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
