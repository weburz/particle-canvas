# @weburz/particle-canvas

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Status][status-src]][status-href]
[![Nuxt][nuxt-src]][nuxt-href]

Zero-dependency animated particle canvas for Nuxt 4. Drop-in `<ParticleCanvas />`
component, ~10 KB / ~3 KB gzipped, TypeScript-first.

> **Status: experimental.** Pre-1.0 — the API may shift.

- ✨ Auto-imported `<ParticleCanvas />` component
- 🪶 Zero runtime dependencies
- 🎯 SSR-safe — engine runs only in the browser via a `window` guard
- 🎨 Linked-line constellations, hover/click interactions, density-aware scaling
- 🟦 First-class TypeScript types

## Install

```bash
pnpm add @weburz/particle-canvas
# or npm install / yarn add
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@weburz/particle-canvas'],

  particleCanvas: {
    // optional defaults applied to every <ParticleCanvas> with no `config` prop
    defaults: {
      count: 100,
      color: ['#a3c4e0', '#ffd86b'],
    },
  },
})
```

## Usage

Drop the component anywhere — it auto-imports.

```vue
<template>
  <div class="hero">
    <ParticleCanvas
      :config="{
        count: 150,
        linked: { enable: true, distance: 140, color: '#a3c4e0', width: 1, opacity: 0.4 },
      }"
    />
    <h1>Hello</h1>
  </div>
</template>

<style scoped>
.hero { position: relative; height: 100vh; }
.hero > :first-child { position: absolute; inset: 0; }
</style>
```

The composable short-circuits when `window` is undefined, so the engine never
executes during SSR. The `<canvas>` element itself renders identically on server
and client, so there's no hydration mismatch.

## Module options

| Option     | Type             | Default | Description                                                                |
| ---------- | ---------------- | ------- | -------------------------------------------------------------------------- |
| `defaults` | `ParticleConfig` | `{}`    | Config applied when `<ParticleCanvas>` is rendered without a `config` prop |
| `prefix`   | `string`         | `""`    | Component name prefix, e.g. `"Weburz"` → `<WeburzParticleCanvas>`          |

## `ParticleConfig`

All fields are optional and merged shallowly over the defaults below.

| Field               | Default                   | Description                                                |
| ------------------- | ------------------------- | ---------------------------------------------------------- |
| `count`             | `100`                     | Base particle count (scaled by density if enabled)         |
| `color`             | `"#FFF"`                  | Single hex color, or array for randomized colors           |
| `size`              | `{ min: 1, max: 3 }`      | Radius range in px                                         |
| `opacity`           | `{ min: 0.3, max: 0.8 }`  | Per-particle opacity range                                 |
| `speed`             | `{ min: 0.2, max: 0.6 }`  | Velocity magnitude range                                   |
| `direction`         | `"none"`                  | `"none" \| "top" \| "bottom" \| "left" \| "right"`         |
| `outMode`           | `"out"`                   | `"out"` (wrap) or `"bounce"`                               |
| `linked`            | enabled                   | Constellation lines between nearby particles               |
| `interaction.hover` | `repulse`                 | `"grab" \| "repulse" \| "bubble"`                          |
| `interaction.click` | `push`                    | `"push" \| "repulse"`                                      |
| `density`           | enabled                   | Scale particle count to canvas area                        |

## API

- `<ParticleCanvas :config="..." />` — auto-imported component
- `useParticleSystem(canvasRef, config)` — auto-imported composable, returns `{ mount, unmount }`

Both are typed via the exported `ParticleConfig`, `Particle`, and `RGB` types.

## Contribution

<details>
  <summary>Local development</summary>

  ```bash
  pnpm install
  pnpm run dev:prepare   # generate Nuxt type stubs
  pnpm run dev           # run the playground
  pnpm run test
  pnpm run lint
  ```

</details>

<details>
  <summary>Pre-commit hooks</summary>

  This repo uses [pre-commit](https://pre-commit.com/) to enforce formatting,
  lint staged files, and validate commit messages (conventional-commits style,
  required by `changelogen` for the auto-generated [CHANGELOG](./CHANGELOG.md)).

  Install it once per clone:

  ```bash
  # If you don't have pre-commit yet:
  brew install pre-commit          # macOS / Linuxbrew
  # or: pipx install pre-commit
  # or: pip install --user pre-commit

  # Activate the hooks in this repo:
  pnpm setup:hooks
  ```

  What runs on every `git commit`:

  | Hook | Purpose |
  | ------------------------- | ----------------------------------------------------------------- |
  | `trailing-whitespace`     | Strips trailing whitespace from staged lines                      |
  | `end-of-file-fixer`       | Ensures every file ends with one newline                          |
  | `check-yaml`              | Validates YAML syntax                                             |
  | `check-added-large-files` | Rejects staged files larger than 500 KB                           |
  | `no-commit-to-branch`     | Blocks direct commits to `main` — work on a branch and open a PR  |
  | `eslint`                  | Lints staged `.vue` / `.js` / `.ts` files                         |
  | `crisp` (commit-msg)      | Enforces conventional-commit message format (`feat:`, `fix:`, …)  |

  Skip hooks for a single commit with `git commit --no-verify` (use sparingly).

</details>

## Prior art

The `<ParticleCanvas>` API surface — particularly the effect names (`grab`,
`repulse`, `bubble`, `push`) and the linked-constellation rendering — draws on
[particles.js][particles-js] by Vincent Garreau and its modern successor
[tsParticles][tsparticles] by Matteo Bruni. This module is a smaller,
Nuxt-native take focused on a single preset, with no runtime dependencies.

[particles-js]: https://github.com/VincentGarreau/particles.js
[tsparticles]: https://github.com/tsparticles/tsparticles

## License

MIT &copy; [Weburz](https://github.com/Weburz)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@weburz/particle-canvas/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@weburz/particle-canvas

[npm-downloads-src]: https://img.shields.io/npm/dm/@weburz/particle-canvas.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@weburz/particle-canvas

[license-src]: https://img.shields.io/npm/l/@weburz/particle-canvas.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@weburz/particle-canvas

[status-src]: https://img.shields.io/badge/status-experimental-orange?style=flat&colorA=020420&colorB=f59e0b
[status-href]: https://github.com/Weburz/particle-canvas

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
