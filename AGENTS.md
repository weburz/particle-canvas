# AGENTS.md

Nuxt module: auto-imported `<ParticleCanvas />` with a zero-dependency particle engine.

## Commands

```bash
pnpm install --frozen-lockfile   # pnpm 11 only; pnpm-workspace.yaml is authoritative
pnpm lint                        # eslint (flat config, @nuxt/eslint-config)
pnpm test                        # vitest: engine unit tests (happy-dom) + SSR fixture e2e
pnpm test:types                  # vue-tsc --noEmit for module + playground
pnpm dev:prepare                 # regenerate Nuxt/generated type stubs (do not hand-edit output)
pnpm dev                         # run the playground
pnpm prepack                     # nuxt-module-build build -> dist/ (generated, gitignored)
```

## Tracking & conventions

- Issues and PRs are tracked on **GitHub** (`gh`). Plane is no longer used.
- Merge PRs only when the `Code QA Checks` workflow is green. `main` is not
  branch-protected, but never bypass a failed check.
- Commits use conventional-commit style (`feat:`, `fix:`, `refactor:`, `chore:`),
  enforced by pre-commit `crisp`. Releases go through `pnpm release`
  (changelogen -> `CHANGELOG.md`, Keep a Changelog + SemVer). No manual version
  bumps, no AI attribution in commits/PRs.

## Code conventions

- **Arrow functions only** for free functions, composables, and inner helpers;
  class methods stay as methods. No `function name() {}`.
- **Composables are `useAdjectiveX`** (`useActiveParticleSystem`), never
  `useVerbX`. Only the composable stem carries an adjective; face helpers keep
  verb names.
- **No date-handling hot paths** here today; if dates appear, share a single
  `Intl.DateTimeFormat` instance instead of calling `toLocaleDateString()`.
- **Widen contracts, don't coerce** callers — fix the generic at the source in
  its own PR, not sprinkling `String()`/`Number()` at call sites.
- **Engine is SoC.** The particle engine is split into focused modules so the
  simulation stays DOM-free and unit-testable without a canvas:
  - `engine/config.ts` — pure default + type-safe config resolution.
  - `engine/simulation.ts` — pure particle physics (spawn, step, bounds, repulse).
  - `engine/renderer.ts` — canvas drawing only (links, grab lines, particles).
  - `engine/particle-system.ts` — lifecycle facade (canvas/DOM sizing, events,
    rAF loop) that wires the three above.
- **Revisit shape when requirements grow.** If a change implies the design
  wouldn't be chosen from scratch, refactor instead of piling onto the old one.
- `vue: 3.5.38` is pinned via an override in `pnpm-workspace.yaml` — do not
  remove it; duplicate Vue instances break `vue-tsc` on `ParticleCanvas.vue`.

## Tests

- Engine unit tests live in `test/engine/` and run in the `happy-dom` project
  (`test/engine/setup.ts` stubs canvas/dpr/rAF).
- The SSR fixture is `test/fixtures/basic/` and asserts the component renders a
  `<canvas>` during SSR — the engine must short-circuit without `window`.
- When changing the engine, add/extend unit tests for the pure modules; the
  class-level tests in `test/engine/particle-system.test.ts` are the contract
  for the public `ParticleSystem` facade.
