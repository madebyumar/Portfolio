'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (pathname?.startsWith('/admin')) return

    // 1. SCROLL REVEAL OBSERVER
    const seen = new WeakSet<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement
            const delay = el.dataset.revealDelay || '0'
            el.style.transitionDelay = `${delay}ms`
            el.classList.add('rv-in')
            io.unobserve(el)
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' }
    )

    const observeReveals = () => {
      const els = document.querySelectorAll('[data-reveal]:not(.rv-in)')
      els.forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el)
          io.observe(el)
        }
      })
    }

    // Reveal elements immediately in initial viewport
    const checkViewport = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight
      const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.rv-in)')
      els.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < vh + 50) {
          el.classList.add('rv-in')
        }
      })
    }

    observeReveals()
    checkViewport()

    const mutObs = new MutationObserver(() => {
      observeReveals()
      checkViewport()
    })
    mutObs.observe(document.body, { childList: true, subtree: true })

    // Also reveal immediately any element on initial load ticks
    setTimeout(() => { observeReveals(); checkViewport(); }, 50)
    setTimeout(() => { observeReveals(); checkViewport(); }, 250)
    setTimeout(() => { observeReveals(); checkViewport(); }, 600)

    // 2. MAGNETIC CURSOR EFFECT (HIGH-PERFORMANCE)
    const R = 100
    const S = 0.38
    let magRaf: number | null = null

    const handlePointerMove = (e: PointerEvent) => {
      if (magRaf) return
      magRaf = requestAnimationFrame(() => {
        magRaf = null
        const magEls = document.querySelectorAll<HTMLElement>('[data-magnetic]')
        magEls.forEach((el) => {
          const r = el.getBoundingClientRect()
          if (!r.width || !r.height) return
          const dx = e.clientX - (r.left + r.width / 2)
          const dy = e.clientY - (r.top + r.height / 2)
          const d = Math.hypot(dx, dy)
          if (d < R) {
            const tx = dx * S
            const ty = dy * S
            el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
            el.style.translate = `${tx}px ${ty}px`
            el.style.transition = 'transform 0.12s ease-out, translate 0.12s ease-out'
          } else {
            el.style.transform = 'translate3d(0, 0, 0)'
            el.style.translate = '0px 0px'
            el.style.transition = 'transform 0.28s ease-out, translate 0.28s ease-out'
          }
        })
      })
    }
    window.addEventListener('pointermove', handlePointerMove)

    // 3. LET'S TALK HEADLINE HOVER EFFECT
    const talk = document.getElementById('lets-talk')
    const handleTalkEnter = () => {
      if (talk) {
        talk.style.color = 'var(--accent)'
        talk.style.webkitTextStrokeColor = 'var(--accent)'
      }
    }
    const handleTalkLeave = () => {
      if (talk) {
        talk.style.color = 'transparent'
        talk.style.webkitTextStrokeColor = 'var(--ink)'
      }
    }
    if (talk) {
      talk.addEventListener('mouseenter', handleTalkEnter)
      talk.addEventListener('mouseleave', handleTalkLeave)
    }

    // 4. BACK TO TOP BUTTON
    const btt = document.getElementById('back-to-top')
    const handleBtt = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    if (btt) {
      btt.addEventListener('click', handleBtt)
    }

    return () => {
      io.disconnect()
      mutObs.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
      if (magRaf) cancelAnimationFrame(magRaf)
      if (talk) {
        talk.removeEventListener('mouseenter', handleTalkEnter)
        talk.removeEventListener('mouseleave', handleTalkLeave)
      }
      if (btt) {
        btt.removeEventListener('click', handleBtt)
      }
    }
  }, [pathname])

  return <>{children}</>
}
