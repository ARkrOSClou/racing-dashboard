export function randomInt(min: number, max: number) {
  let rand = min - 0.5 + Math.random() * (max - min)
  return Math.abs(Math.round(rand))
}

export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  ms?: number
): (...args: Parameters<F>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), ms)
  }
}
