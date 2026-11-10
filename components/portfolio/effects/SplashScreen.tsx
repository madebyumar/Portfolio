'use client'

import React, { useEffect, useState } from 'react'

const LABELS = ['BOOTING PORTFOLIO', 'LOADING PROJECTS', 'CALIBRATING 3D', 'READY']

export function SplashScreen() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [label, setLabel] = useState(LABELS[0])

  useEffect(() => {
    if (sessionStorage.getItem('umar-splash-seen')) return

    const showFrame = requestAnimationFrame(() => setVisible(true))
    const t0 = performance.now()
    const dur = 1400
    let raf: number

    const tick = () => {
      const p = Math.min(100, ((performance.now() - t0) / dur) * 100)
      setProgress(p)
      const idx = Math.min(3, Math.floor(p / 34))
      setLabel(LABELS[idx])

      if (p < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        sessionStorage.setItem('umar-splash-seen', '1')
        setTimeout(() => setVisible(false), 500)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(showFrame)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      id="splash"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'var(--bg, #0e0e0c)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '34px',
        opacity: progress === 100 ? 0 : 1,
        transition: 'opacity 0.6s ease',
        pointerEvents: progress === 100 ? 'none' : 'all',
      }}
    >
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(44px, 8vw, 110px)',
          lineHeight: 0.95,
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          textAlign: 'center',
          color: 'var(--ink, #f2f0e8)',
        }}
      >
        Umar
        <br />
        <span
          style={{
            color: 'transparent',
            WebkitTextStroke: '2px var(--ink, #f2f0e8)',
          }}
        >
          Shoaib
        </span>
        <span style={{ color: 'var(--accent, #d4ff3f)' }}>.</span>
      </div>

      <div
        style={{
          width: 'min(320px, 60vw)',
          height: '2px',
          background: 'rgba(242,240,232,0.15)',
          overflow: 'hidden',
        }}
      >
        <div
          id="splash-bar"
          style={{
            height: '100%',
            background: 'var(--accent, #d4ff3f)',
            width: `${progress}%`,
            transition: 'width 0.05s linear',
          }}
        />
      </div>

      <div
        id="splash-label"
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '12px',
          letterSpacing: '0.14em',
          color: 'var(--ink-55, rgba(242,240,232,0.55))',
        }}
      >
        {label}
      </div>
    </div>
  )
}
