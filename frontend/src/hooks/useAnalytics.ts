import { useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'

declare global {
  interface Window {
    gtag: (command: string, target: string | Date, params?: Record<string, unknown>) => void
    dataLayer: unknown[]
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

function initGA() {
  if (typeof window.gtag !== 'undefined') return

  window.dataLayer = window.dataLayer || []
  window.gtag = function () { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID)

  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  script.async = true
  document.head.appendChild(script)
}

export function trackEvent(action: string, params?: Record<string, unknown>) {
  if (typeof window.gtag !== 'function') return
  if (localStorage.getItem('ga-consent') !== 'full') return
  window.gtag('event', action, params)
}

export function useAnalytics() {
  const location = useLocation()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return
    const consent = localStorage.getItem('ga-consent')
    if (consent === 'refused' || !consent) return

    initGA()
  }, [])

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
      })
    }
  }, [location.pathname])
}
