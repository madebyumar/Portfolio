'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

export function PortfolioScripts() {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) return null

  return (
    <>
      <Script src="/scripts/theme.js" strategy="afterInteractive" />
    </>
  )
}
