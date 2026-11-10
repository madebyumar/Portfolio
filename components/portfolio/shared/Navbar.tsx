'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface NavbarProps {
  name?: string
  timezone?: string
  ianaTimezone?: string
}

export function Navbar({
  name = 'umar',
  timezone = 'GMT+5',
  ianaTimezone = 'Asia/Karachi',
}: NavbarProps) {
  const [clock, setClock] = useState('--:--')
  const [themeIcon, setThemeIcon] = useState('Light')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function updateClock() {
      try {
        const time = new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: ianaTimezone || 'Asia/Karachi',
        })
        setClock(time)
      } catch {
        const d = new Date()
        setClock(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`)
      }
    }

    updateClock()
    const timer = setInterval(updateClock, 10000)

    // Check theme
    const themeFrame = requestAnimationFrame(() => {
      const win = window as unknown as { umarTheme?: { get: () => string; toggle: () => void } }
      if (win.umarTheme) setThemeIcon(win.umarTheme.get() === 'light' ? 'Dark' : 'Light')
    })

    // Scroll progress bar
    const handleScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      const p = max > 0 ? (h.scrollTop / max) * 100 : 0
      const bar = document.getElementById('scroll-bar')
      if (bar) bar.style.width = p + '%'
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearInterval(timer)
      cancelAnimationFrame(themeFrame)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [ianaTimezone])

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const handleToggleTheme = () => {
    if (typeof window !== 'undefined') {
      const win = window as unknown as { umarTheme?: { get: () => string; toggle: () => void } }
      if (win.umarTheme) {
        win.umarTheme.toggle()
        setThemeIcon(win.umarTheme.get() === 'light' ? 'Dark' : 'Light')
      }
    }
  }

  return (
    <>
      {/* Top progress bar */}
      <div
        id="scroll-bar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '2px',
          background: 'var(--accent)',
          zIndex: 100,
          width: '0%',
          transition: 'width 0.1s ease-out',
        }}
      />

      <nav
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 40px',
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--line)',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '12px',
          letterSpacing: '0.06em',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            color: 'var(--ink)',
            textDecoration: 'none',
          }}
          title={`${name} — home`}
        >
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: '21px',
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
              textTransform: 'lowercase',
            }}
          >
            {name.toLowerCase().split(' ')[0]}
            <span style={{ color: 'var(--accent)' }}>.</span>
          </span>
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
          className="portfolio-nav-links"
        >
          <Link href="/#services" className="nav-link">
            WHAT I DO
          </Link>
          <Link href="/#projects" className="nav-link">
            WORK
          </Link>
          <Link href="/#skills" className="nav-link">
            SKILLS
          </Link>
          <Link href="/#experience" className="nav-link">
            EXPERIENCE
          </Link>
          <Link href="/blog" className="nav-link">
            BLOG
          </Link>
        </div>

        <div className="portfolio-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span
            className="portfolio-nav-clock"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--ink-60)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 6px var(--accent)',
              }}
            />
            <span>
              {clock} {timezone}
            </span>
          </span>

          <button
            id="theme-toggle"
            onClick={handleToggleTheme}
            type="button"
            aria-label={`Switch to ${themeIcon === 'Light' ? 'light' : 'dark'} theme`}
            style={{
              minWidth: '54px',
              height: '34px',
              border: '1px solid var(--line-30)',
              background: 'none',
              color: 'var(--ink)',
              cursor: 'pointer',
              fontSize: '11px',
              letterSpacing: '0.06em',
              fontFamily: 'var(--font-mono), monospace',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 10px',
            }}
          >
            {themeIcon}
          </button>

          <Link href="/hire" className="nav-hire-btn">
            HIRE ME ↗
          </Link>

          <button
            type="button"
            className="portfolio-menu-toggle"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="portfolio-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
        {menuOpen && (
          <div id="portfolio-mobile-menu" className="portfolio-mobile-menu">
            <Link href="/#services" onClick={() => setMenuOpen(false)}>WHAT I DO <span aria-hidden="true">↗</span></Link>
            <Link href="/#projects" onClick={() => setMenuOpen(false)}>WORK <span aria-hidden="true">↗</span></Link>
            <Link href="/#skills" onClick={() => setMenuOpen(false)}>SKILLS <span aria-hidden="true">↗</span></Link>
            <Link href="/#experience" onClick={() => setMenuOpen(false)}>EXPERIENCE <span aria-hidden="true">↗</span></Link>
            <Link href="/blog" onClick={() => setMenuOpen(false)}>BLOG <span aria-hidden="true">↗</span></Link>
            <Link href="/#contact" onClick={() => setMenuOpen(false)}>CONTACT <span aria-hidden="true">↗</span></Link>
          </div>
        )}
      </nav>
    </>
  )
}

