import { resolveConfig } from './config'
import type { Particle, ParticleConfig, ResolvedConfig } from './types'
import { hexToRgb } from './utils'
import { CanvasRenderer } from './renderer'
import { applyRepulse, makeParticle, stepParticles } from './simulation'

export class ParticleSystem {
  private readonly ctx: CanvasRenderingContext2D
  private readonly cfg: ResolvedConfig
  private readonly renderer: CanvasRenderer
  private particles: Particle[] = []
  private animId: number | null = null
  private w = 0
  private h = 0
  private mouse: { x: number, y: number } | null = null
  private resizeObserver: ResizeObserver | null = null

  constructor(
    private readonly canvas: HTMLCanvasElement,
    userCfg: ParticleConfig = {},
  ) {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('@weburz/particle-canvas: 2D canvas context unavailable')
    }
    this.ctx = ctx
    this.cfg = resolveConfig(userCfg)
    this.renderer = new CanvasRenderer(ctx, hexToRgb(this.cfg.linked.color))
  }

  start(): void {
    this.onResize()
    this.spawnAll()
    this.attachListeners()
    this.loop()
  }

  destroy(): void {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId)
      this.animId = null
    }
    this.detachListeners()
    this.particles = []
  }

  private attachListeners() {
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mouseleave', this.onMouseLeave)
    this.canvas.addEventListener('click', this.onClick)
    this.resizeObserver = new ResizeObserver(this.onResize)
    this.resizeObserver.observe(this.canvas)
  }

  private detachListeners() {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mouseleave', this.onMouseLeave)
    this.canvas.removeEventListener('click', this.onClick)
    this.resizeObserver?.disconnect()
    this.resizeObserver = null
  }

  private onResize = (): void => {
    const dpr = window.devicePixelRatio || 1
    this.w = this.canvas.offsetWidth
    this.h = this.canvas.offsetHeight
    this.canvas.width = this.w * dpr
    this.canvas.height = this.h * dpr
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    this.adjustCount()
  }

  private targetCount(): number {
    if (!this.cfg.density.enable) {
      return this.cfg.count
    }
    return Math.round(
      (((this.w * this.h) / 1000) * this.cfg.count) / this.cfg.density.area,
    )
  }

  private adjustCount() {
    const target = this.targetCount()
    while (this.particles.length < target) {
      this.particles.push(makeParticle(this.cfg, this.w, this.h))
    }
    if (this.particles.length > target) {
      this.particles.splice(target)
    }
  }

  private spawnAll() {
    this.particles = []
    const target = this.targetCount()
    for (let i = 0; i < target; i++) {
      this.particles.push(makeParticle(this.cfg, this.w, this.h))
    }
  }

  private onMouseMove = (e: MouseEvent): void => {
    const r = this.canvas.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    if (x < 0 || y < 0 || x > r.width || y > r.height) {
      this.mouse = null
      return
    }
    this.mouse = { x, y }
  }

  private onMouseLeave = (): void => {
    this.mouse = null
  }

  private onClick = (e: MouseEvent): void => {
    const click = this.cfg.interaction.click
    if (!click.enable) return

    const r = this.canvas.getBoundingClientRect()
    const cx = e.clientX - r.left
    const cy = e.clientY - r.top

    if (click.mode === 'push') {
      const cap = this.targetCount() * 3
      for (let i = 0; i < click.count; i++) {
        if (this.particles.length >= cap) break
        this.particles.push(makeParticle(this.cfg, this.w, this.h, cx, cy))
      }
    }
    else {
      applyRepulse(this.particles, cx, cy, 160, 9)
    }
  }

  private update() {
    const hover = this.cfg.interaction.hover

    if (hover.enable && hover.mode === 'repulse' && this.mouse) {
      applyRepulse(
        this.particles,
        this.mouse.x,
        this.mouse.y,
        hover.distance,
        2.5,
      )
    }

    stepParticles(this.particles, this.cfg, this.w, this.h)
  }

  private draw() {
    if (this.cfg.linked.enable) {
      this.renderer.drawLinks(this.particles, this.cfg.linked)
    }
    const hover = this.cfg.interaction.hover
    this.renderer.drawGrabLines(this.particles, hover, this.mouse)
    this.renderer.drawParticles(this.particles, hover, this.mouse)
  }

  private loop = () => {
    this.renderer.clear(this.w, this.h)
    this.update()
    this.draw()
    this.animId = requestAnimationFrame(this.loop)
  }
}
