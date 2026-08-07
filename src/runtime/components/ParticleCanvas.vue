<template>
  <canvas
    ref="canvasRef"
    style="width: 100%; height: 100%; display: block"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import type { ParticleConfig } from '../engine'
import { resolveConfig } from '../engine'
import { useActiveParticleSystem } from '../composables/useActiveParticleSystem'

const props = defineProps<{
  config?: ParticleConfig
}>()

const runtimeDefaults = useRuntimeConfig().public.particleCanvas?.defaults ?? {}
const merged = resolveConfig(props.config ?? {}, runtimeDefaults)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { mount, unmount } = useActiveParticleSystem(canvasRef, merged)

onMounted(mount)
onUnmounted(unmount)
</script>
