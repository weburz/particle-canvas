import type { Particle, RGB, ResolvedConfig } from './types'

export class CanvasRenderer {
  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    private readonly linkColor: RGB,
  ) {}

  clear(width: number, height: number): void {
    this.ctx.clearRect(0, 0, width, height)
  }

  private rgba(alpha: number): string {
    const { r, g, b } = this.linkColor
    return `rgba(${r},${g},${b},${alpha})`
  }

  drawLinks(particles: Particle[], linked: ResolvedConfig['linked']): void {
    const { distance, width, opacity } = linked
    const dSqMax = distance * distance

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i]!
        const p2 = particles[j]!
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const dSq = dx * dx + dy * dy

        if (dSq < dSqMax) {
          const a = opacity * (1 - Math.sqrt(dSq) / distance)
          this.ctx.strokeStyle = this.rgba(a)
          this.ctx.lineWidth = width
          this.ctx.beginPath()
          this.ctx.moveTo(p1.x, p1.y)
          this.ctx.lineTo(p2.x, p2.y)
          this.ctx.stroke()
        }
      }
    }
  }

  drawGrabLines(
    particles: Particle[],
    hover: ResolvedConfig['interaction']['hover'],
    mouse: { x: number, y: number } | null,
  ): void {
    if (!hover.enable || hover.mode !== 'grab' || !mouse) return

    const grabDistSq = hover.distance * hover.distance

    for (const p of particles) {
      const dx = p.x - mouse.x
      const dy = p.y - mouse.y
      const dSq = dx * dx + dy * dy

      if (dSq < grabDistSq) {
        const a = 1 - Math.sqrt(dSq) / hover.distance
        this.ctx.strokeStyle = this.rgba(a)
        this.ctx.lineWidth = 1.5
        this.ctx.beginPath()
        this.ctx.moveTo(p.x, p.y)
        this.ctx.lineTo(mouse.x, mouse.y)
        this.ctx.stroke()
      }
    }
  }

  drawParticles(
    particles: Particle[],
    hover: ResolvedConfig['interaction']['hover'],
    mouse: { x: number, y: number } | null,
  ): void {
    const bubble = hover.enable && hover.mode === 'bubble' && mouse !== null
    const bDistSq = hover.distance * hover.distance

    for (const p of particles) {
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
}
