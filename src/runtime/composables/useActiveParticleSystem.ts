import type { Ref } from 'vue'
import { ParticleSystem } from '../engine'
import type { ParticleConfig } from '../engine'

export const useActiveParticleSystem = (
  canvasRef: Ref<HTMLCanvasElement | null>,
  config: ParticleConfig = {},
) => {
  let system: ParticleSystem | null = null

  const mount = () => {
    if (typeof window === 'undefined') return
    if (!canvasRef.value) return
    system = new ParticleSystem(canvasRef.value, config)
    system.start()
  }

  const unmount = () => {
    system?.destroy()
    system = null
  }

  return { mount, unmount }
}
