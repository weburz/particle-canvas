import type { Particle, ParticleConfig, RGB } from './types'
import { DIRECTIONS, hexToRgb, rand } from './utils'

type ResolvedConfig = {
  count: number
  color: string | string[]
  size: { min: number, max: number }
  opacity: { min: number, max: number }
  speed: { min: number, max: number }
  direction: NonNullable<ParticleConfig['direction']>
  outMode: NonNullable<ParticleConfig['outMode']>
  linked: {
    enable: boolean
    distance: number
    color: string
    width: number
    opacity: number
  }
  interaction: {
    hover: {
      enable: boolean
      mode: 'grab' | 'repulse' | 'bubble'
      distance: number
    }
    click: {
      enable: boolean
      mode: 'push' | 'repulse'
      count: number
    }
  }
  density: { enable: boolean, area: number }
}

export class ParticleSystem {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private cfg: ResolvedConfig
  private particles: Particle[] = []
  private animId: number | null = null
  private w = 0
  private h = 0
  private mouse: { x: number, y: number } | null = null
  private linkRGB: RGB
  private resizeObserver: ResizeObserver | null = null

  constructor(canvas: HTMLCanvasElement, userCfg: ParticleConfig = {}) {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('@weburz/particle-canvas: 2D canvas context unavailable')
    }
    this.canvas = canvas
    this.ctx = ctx
    this.cfg = this.buildCfg(userCfg)
    this.linkRGB = hexToRgb(this.cfg.linked.color)
  }

  private buildCfg(u: ParticleConfig): ResolvedConfig {
    return {
      count: u.count ?? 100,
      color: u.color ?? '#FFF',
      size: u.size ?? { min: 1, max: 3 },
      opacity: u.opacity ?? { min: 0.3, max: 0.8 },
      speed: u.speed ?? { min: 0.2, max: 0.6 },
      direction: u.direction ?? 'none',
      outMode: u.outMode ?? 'out',

      linked: {
        enable: u.linked?.enable ?? true,
        distance: u.linked?.distance ?? 130,
        color: u.linked?.color ?? '#a3c4e0',
        width: u.linked?.width ?? 1,
        opacity: u.linked?.opacity ?? 0.35,
      },

      interaction: {
        hover: {
          enable: u.interaction?.hover?.enable ?? true,
          mode: u.interaction?.hover?.mode ?? 'repulse',
          distance: u.interaction?.hover?.distance ?? 100,
        },

        click: {
          enable: u.interaction?.click?.enable ?? true,
          mode: u.interaction?.click?.mode ?? 'push',
          count: u.interaction?.click?.count ?? 3,
        },
      },

      density: {
        enable: u.density?.enable ?? true,
        area: u.density?.area ?? 800,
      },
    }
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
      this.particles.push(this.makeParticle())
    }
    if (this.particles.length > target) {
      this.particles.splice(target)
    }
  }

  private spawnAll() {
    this.particles = []
    const target = this.targetCount()
    for (let i = 0; i < target; i++) {
      this.particles.push(this.makeParticle())
    }
  }

  private makeParticle(x?: number, y?: number): Particle {
    const colors = Array.isArray(this.cfg.color)
      ? this.cfg.color
      : [this.cfg.color]

    const dir = (DIRECTIONS[this.cfg.direction] ?? DIRECTIONS.none) as {
      x: number
      y: number
    }
    const spd = rand(this.cfg.speed.min, this.cfg.speed.max)

    return {
      x: x ?? Math.random() * this.w,
      y: y ?? Math.random() * this.h,
      vx: (dir.x + (Math.random() - 0.5)) * spd,
      vy: (dir.y + (Math.random() - 0.5)) * spd,
      fx: 0,
      fy: 0,
      radius: rand(this.cfg.size.min, this.cfg.size.max),
      opacity: rand(this.cfg.opacity.min, this.cfg.opacity.max),
      color: hexToRgb(colors[Math.floor(Math.random() * colors.length)]!),
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
        this.particles.push(this.makeParticle(cx, cy))
      }
    }
    else {
      this.applyRepulse(cx, cy, 160, 9)
    }
  }

  private applyRepulse(
    cx: number,
    cy: number,
    radius: number,
    strength: number,
  ) {
    const rSq = radius * radius
    for (const p of this.particles) {
      const dx = p.x - cx
      const dy = p.y - cy
      const dSq = dx * dx + dy * dy
      if (dSq < rSq && dSq > 0) {
        const d = Math.sqrt(dSq)
        const force = ((radius - d) / radius) * strength
        p.fx += (dx / d) * force
        p.fy += (dy / d) * force
      }
    }
  }

  private update() {
    const hover = this.cfg.interaction.hover

    if (hover.enable && hover.mode === 'repulse' && this.mouse) {
      this.applyRepulse(this.mouse.x, this.mouse.y, hover.distance, 2.5)
    }

    for (const p of this.particles) {
      p.fx *= 0.92
      p.fy *= 0.92

      p.x += p.vx + p.fx
      p.y += p.vy + p.fy

      if (this.cfg.outMode === 'bounce') {
        if (p.x < p.radius) {
          p.x = p.radius
          p.vx = Math.abs(p.vx)
        }
        if (p.x > this.w - p.radius) {
          p.x = this.w - p.radius
          p.vx = -Math.abs(p.vx)
        }
        if (p.y < p.radius) {
          p.y = p.radius
          p.vy = Math.abs(p.vy)
        }
        if (p.y > this.h - p.radius) {
          p.y = this.h - p.radius
          p.vy = -Math.abs(p.vy)
        }
      }
      else {
        if (p.x < -p.radius) p.x = this.w + p.radius
        if (p.x > this.w + p.radius) p.x = -p.radius
        if (p.y < -p.radius) p.y = this.h + p.radius
        if (p.y > this.h + p.radius) p.y = -p.radius
      }
    }
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.w, this.h)
    this.drawLinks()
    this.drawGrabLines()
    this.drawParticles()
  }

  private drawLinks() {
    if (!this.cfg.linked.enable) return
    const { distance, width, opacity } = this.cfg.linked
    const dSqMax = distance * distance
    const { r, g, b } = this.linkRGB

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i]!
        const p2 = this.particles[j]!
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const dSq = dx * dx + dy * dy

        if (dSq < dSqMax) {
          const a = opacity * (1 - Math.sqrt(dSq) / distance)
          this.ctx.strokeStyle = `rgba(${r},${g},${b},${a})`
          this.ctx.lineWidth = width
          this.ctx.beginPath()
          this.ctx.moveTo(p1.x, p1.y)
          this.ctx.lineTo(p2.x, p2.y)
          this.ctx.stroke()
        }
      }
    }
  }

  private drawGrabLines() {
    const hover = this.cfg.interaction.hover
    if (!hover.enable || hover.mode !== 'grab' || !this.mouse) return

    const { r, g, b } = this.linkRGB
    const grabDistSq = hover.distance * hover.distance
    const { x: mx, y: my } = this.mouse

    for (const p of this.particles) {
      const dx = p.x - mx
      const dy = p.y - my
      const dSq = dx * dx + dy * dy

      if (dSq < grabDistSq) {
        const a = 1 - Math.sqrt(dSq) / hover.distance
        this.ctx.strokeStyle = `rgba(${r},${g},${b},${a})`
        this.ctx.lineWidth = 1.5
        this.ctx.beginPath()
        this.ctx.moveTo(p.x, p.y)
        this.ctx.lineTo(mx, my)
        this.ctx.stroke()
      }
    }
  }

  private drawParticles() {
    const hover = this.cfg.interaction.hover
    const mouse = this.mouse
    const bubble = hover.enable && hover.mode === 'bubble' && mouse !== null
    const bDistSq = hover.distance * hover.distance

    for (const p of this.particles) {
      let radius = p.radius
      let opacity = p.opacity

      if (bubble && mouse) {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dSq = dx * dx + dy * dy
        if (dSq < bDistSq) {
          const t = 1 - Math.sqrt(dSq) / hover.distance
          radius = p.radius + t * p.radius * 3
          opacity = Math.min(1, p.opacity + t * 0.5)
        }
      }

      this.ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${opacity})`
      this.ctx.beginPath()
      this.ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
      this.ctx.fill()
    }
  }

  private loop = () => {
    this.update()
    this.draw()
    this.animId = requestAnimationFrame(this.loop)
  }
}
