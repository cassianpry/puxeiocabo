import { useEffect, useState } from 'react'

export function usePageTransition() {
  const [entering, setEntering] = useState(true)

  useEffect(() => {
    setEntering(true)
    const timer = setTimeout(() => setEntering(false), 200)
    return () => clearTimeout(timer)
  }, [])

  return entering ? 'page-enter' : ''
}
