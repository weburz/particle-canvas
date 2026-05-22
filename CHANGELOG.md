# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- `<ParticleCanvas />` component, auto-imported in Nuxt 4 apps.
- `useParticleSystem` composable, auto-imported alongside the component.
- Module options `defaults` (global `ParticleConfig`) and `prefix` (component name prefix).
- Zero-dependency particle engine with linked-line constellations, hover modes
  (`grab`, `repulse`, `bubble`), click modes (`push`, `repulse`), and density-aware
  particle scaling.
- Public TypeScript types: `ParticleConfig`, `Particle`, `RGB`.
- 19 engine unit tests + 1 SSR fixture e2e test.
