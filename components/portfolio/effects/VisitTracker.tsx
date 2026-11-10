'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const SESSION_KEY = 'umar-visit-sid'

function getSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY)
    if (existing) return existing
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`
    sessionStorage.setItem(SESSION_KEY, id)
    return id
  } catch {
    return `s-${Date.now()}`
  }
}

export function VisitTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return

    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      void fetch('/api/analytics/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname,
          referrer: document.referrer || '',
          sessionId: getSessionId(),
          userAgent: navigator.userAgent,
        }),
        signal: controller.signal,
        keepalive: true,
      }).catch(() => {
        // Analytics must never break the site
      })
    }, 400)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [pathname])

  return null
}
