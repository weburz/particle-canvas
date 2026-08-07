export type Range = { min: number, max: number }

export type ParticleConfig = {
  count?: number
  color?: string | string[]
  size?: Range
  opacity?: Range
  speed?: Range

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

export type ResolvedConfig = {
  count: number
  color: string | string[]
  size: Range
  opacity: Range
  speed: Range
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
      mode: NonNullable<NonNullable<ParticleConfig['interaction']>['hover']>['mode']
      distance: number
    }
    click: {
      enable: boolean
      mode: NonNullable<NonNullable<ParticleConfig['interaction']>['click']>['mode']
      count: number
    }
  }
  density: { enable: boolean, area: number }
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
