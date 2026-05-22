import { vi } from 'vitest'

const noop = () => {}

const ctxStub: Partial<CanvasRenderingContext2D> = {
  clearRect: noop,
  beginPath: noop,
  moveTo: noop,
  lineTo: noop,
  stroke: noop,
  fill: noop,
  arc: noop,
  setTransform: noop,
  strokeStyle: '',
  fillStyle: '',
  lineWidth: 1,
}

HTMLCanvasElement.prototype.getContext = vi.fn(
  () => ctxStub as CanvasRenderingContext2D,
) as unknown as HTMLCanvasElement['getContext']

Object.defineProperty(HTMLCanvasElement.prototype, 'offsetWidth', {
  configurable: true,
  get: () => 800,
})

Object.defineProperty(HTMLCanvasElement.prototype, 'offsetHeight', {
  configurable: true,
  get: () => 600,
})

HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn(
  () =>
    ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      bottom: 600,
      right: 800,
      width: 800,
      height: 600,
      toJSON: () => ({}),
    }) as DOMRect,
)

if (typeof window.requestAnimationFrame === 'undefined') {
  window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
    return setTimeout(() => cb(performance.now()), 16) as unknown as number
  }) as typeof window.requestAnimationFrame
  window.cancelAnimationFrame = ((id: number) =>
    clearTimeout(id)) as typeof window.cancelAnimationFrame
}
