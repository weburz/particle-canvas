export type Range = { min: number, max: number }

export type Direction = 'none' | 'top' | 'bottom' | 'left' | 'right'
export type OutMode = 'out' | 'bounce'
export type HoverMode = 'grab' | 'repulse' | 'bubble'
export type ClickMode = 'push' | 'repulse'

export type Vector = { x: number, y: number }

export type ParticleConfig = {
  count?: number
  color?: string | string[]
  size?: Range
  opacity?: Range
  speed?: Range

  direction?: Direction
  outMode?: OutMode

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
      mode?: HoverMode
      distance?: number
    }

    click?: {
      enable?: boolean
      mode?: ClickMode
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
  direction: Direction
  outMode: OutMode
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
      mode: HoverMode
      distance: number
    }
    click: {
      enable: boolean
      mode: ClickMode
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
