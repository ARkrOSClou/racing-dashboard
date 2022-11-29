import { useState, useEffect, useRef } from 'react'

export const useInView = () => {
  const supports =
    typeof window !== 'undefined' && typeof window.IntersectionObserver !== 'undefined'
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(!supports)
  const options = {
    root: null,
  }
  const callback: IntersectionObserverCallback = (entries) => {
    const entry = entries[0]
    if (entry) {
      setInView(entry.isIntersecting)
    }
  }
  useEffect(() => {
    if (supports) {
      const el = ref.current
      const observer = new IntersectionObserver(callback, options)
      if (el) {
        observer.observe(el)
      }
      return () => {
        if (el) {
          observer.unobserve(el)
        }
      }
    }
  }, [ref, options, callback])
  return {
    ref,
    inView,
  }
}
