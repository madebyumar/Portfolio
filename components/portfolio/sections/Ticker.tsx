'use client'

import React, { useEffect, useRef, useState } from 'react'

const SKILLS_TICKER = [
  'Laravel',
  'MERN Stack',
  'Python',
  'AI Engineering',
  'REST APIs',
  'Computer Vision',
  'OpenAI API',
  'FastAPI',
  'PostgreSQL',
  'Next.js',
]

export function Ticker() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const setRef = useRef<HTMLDivElement>(null)

  const posRef = useRef(0)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const lastXRef = useRef(0)
  const velocityRef = useRef(0)
  const hasMovedRef = useRef(false)
  const isHoveredRef = useRef(false)
  const [isGrabbing, setIsGrabbing] = useState(false)

  useEffect(() => {
    const track = trackRef.current
    const setEl = setRef.current
    const container = containerRef.current
    if (!track || !setEl || !container) return

    let rafId: number
    const baseSpeed = -1.0 // Smooth, well-balanced auto-scroll speed

    const tick = () => {
      const setWidth = setEl.offsetWidth
      if (setWidth > 0) {
        if (!isDraggingRef.current) {
          // Apply residual inertia momentum from drag or wheel flick
          if (Math.abs(velocityRef.current) > 0.04) {
            posRef.current += velocityRef.current
            velocityRef.current *= 0.94 // Smooth kinetic friction decay
          } else {
            // Auto glide smoothly in default direction when not dragging
            if (!isHoveredRef.current) {
              posRef.current += baseSpeed
            }
          }
        }

        // Mathematically flawless infinite loop in both scroll directions: ZERO JERK!
        while (posRef.current <= -setWidth) {
          posRef.current += setWidth
        }
        while (posRef.current > 0) {
          posRef.current -= setWidth
        }

        track.style.transform = `translate3d(${posRef.current}px, 0, 0)`
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    // --- MOUSE WHEEL & TRACKPAD INTERACTIVE SCROLL ---
    const handleWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (delta !== 0) {
        e.preventDefault()
        const moveAmount = delta * -0.85
        posRef.current += moveAmount
        velocityRef.current = moveAmount * 0.4
      }
    }

    // --- DRAG / TOUCH INTERACTION (ANY DIRECTION) ---
    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true
      hasMovedRef.current = false
      startXRef.current = e.clientX
      lastXRef.current = e.clientX
      velocityRef.current = 0
      setIsGrabbing(true)
      container.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return
      const dx = e.clientX - lastXRef.current
      if (Math.abs(e.clientX - startXRef.current) > 5) {
        hasMovedRef.current = true
      }
      lastXRef.current = e.clientX
      posRef.current += dx
      velocityRef.current = dx * 0.75
    }

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      setIsGrabbing(false)
      try {
        container.releasePointerCapture(e.pointerId)
      } catch { }
    }

    const handlePointerCancel = (e: PointerEvent) => {
      isDraggingRef.current = false
      setIsGrabbing(false)
      try {
        container.releasePointerCapture(e.pointerId)
      } catch { }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('pointerdown', handlePointerDown)
    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerup', handlePointerUp)
    container.addEventListener('pointercancel', handlePointerCancel)

    return () => {
      cancelAnimationFrame(rafId)
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('pointerdown', handlePointerDown)
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerup', handlePointerUp)
      container.removeEventListener('pointercancel', handlePointerCancel)
    }
  }, [])

  const renderSet = (prefix: string, isRef = false) => (
    <div
      ref={isRef ? setRef : undefined}
      aria-hidden={!isRef}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '40px',
        paddingRight: '40px',
        flexShrink: 0,
      }}
    >
      {SKILLS_TICKER.map((skill, idx) => (
        <React.Fragment key={`${prefix}-${idx}`}>
          <span className="ticker-item">{skill}</span>
          <span className="ticker-star">✦</span>
        </React.Fragment>
      ))}
    </div>
  )

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        isHoveredRef.current = true
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false
      }}
      style={{
        overflow: 'hidden',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        padding: '16px 0',
        background: 'var(--accent)',
        color: 'var(--accent-ink)',
        userSelect: 'none',
        cursor: isGrabbing ? 'grabbing' : 'grab',
        touchAction: 'pan-y',
      }}
    >
      <div
        ref={trackRef}
        className="ticker-track"
        style={{
          display: 'flex',
          width: 'max-content',
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: '20px',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          alignItems: 'center',
        }}
      >
        {renderSet('set1', true)}
        {renderSet('set2')}
        {renderSet('set3')}
      </div>
    </div>
  )
}
