import React, { useRef } from 'react'

export function useDebouncedCallback<A extends any[]>(
  callback: (...args: A) => void,
  delay: number
) {
  const timeout = useRef<NodeJS.Timeout | null>(null)

  function debouncedCallback(...args: A) {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }

    timeout.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }

  return debouncedCallback
}

export function useWindowDimensions() {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 }
  }

  const [{ width, height }, setDimensions] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const debouncedSetDimensions = useDebouncedCallback(setDimensions, 200)

  const handleResize = () => {
    debouncedSetDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  React.useLayoutEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [debouncedSetDimensions])

  return { width, height }
}
