<template>
  <div class="stage">
    <ParticleCanvas
      :config="{
        count: 120,
        linked: {
          enable: true,
          distance: 140,
          color: '#a3c4e0',
          width: 1,
          opacity: 0.4,
        },
      }"
    />
    <h1>@weburz/particle-canvas playground</h1>
  </div>
</template>

<style>
html,
body,
#__nuxt {
  margin: 0;
  height: 100%;
  background: #0a0a0a;
  color: #fff;
  font-family: system-ui, sans-serif;
}
.stage {
  position: relative;
  height: 100vh;
}
.stage > :first-child {
  position: absolute;
  inset: 0;
}
h1 {
  position: relative;
  z-index: 1;
  padding: 2rem;
  pointer-events: none;
}
</style>
