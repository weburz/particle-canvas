export type ParticleConfig = {
  count?: number
  color?: string | string[]
  size?: { min: number, max: number }
  opacity?: { min: number, max: number }

  speed?: {
    min: number
    max: number
  }

  direction?: 'none' | 'top' | 'bottom' | 'left' | 'right'
  outMode?: 'out' | 'bounce'

  linked?: {
    enable?: boolean
    distance?: number
    color?: string
    width?: number
    opacity?: number
  }

  interaction?: {
    hover?: {
      enable?: boolean
      mode?: 'grab' | 'repulse' | 'bubble'
      distance?: number
    }

    click?: {
      enable?: boolean
      mode?: 'push' | 'repulse'
      count?: number
    }
  }

  density?: {
    enable?: boolean
    area?: number
  }
}

export type RGB = { r: number, g: number, b: number }

export type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  fx: number
  fy: number
  radius: number
  opacity: number
  color: RGB
}
