'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'

import type { Project } from '@/lib/data/types'

export type ProjectItem = Project

interface SelectedWorkProps {
  projects: Project[]
}

export function SelectedWork({ projects }: SelectedWorkProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const previewImgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const sec = sectionRef.current
    const preview = previewRef.current
    const previewImg = previewImgRef.current
    if (!sec || !preview || !previewImg) return

    let lx: number | null = null
    let ly: number | null = null
    let raf: number | null = null

    const handleMouseMove = (e: MouseEvent) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const x = e.clientX
        const y = e.clientY
        const dx = x - (lx ?? x)
        const dy = y - (ly ?? y)
        lx = x
        ly = y

        const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v))
        const ry = clamp(dx * 1.4, 22)
        const rx = clamp(-dy * 1.4, 22)

        preview.style.transform = `translate(${x + 34}px, ${y - 150}px)`
        previewImg.style.transform = `perspective(900px) rotateY(${ry}deg) rotateX(${rx}deg)`
      })
    }

    const handleMouseLeave = () => {
      preview.style.opacity = '0'
      lx = null
      ly = null
    }

    sec.addEventListener('mousemove', handleMouseMove)
    sec.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      sec.removeEventListener('mousemove', handleMouseMove)
      sec.removeEventListener('mouseleave', handleMouseLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="projects"
      data-screen-label="Projects"
      style={{
        padding: '130px 0 0',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '24px',
          margin: '0 40px 60px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px' }}>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '13px',
              color: 'var(--accent)',
            }}
          >
            (02)
          </span>
          <h2
            data-reveal
            style={{
              margin: 0,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(44px, 6vw, 84px)',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            Selected work
          </h2>
        </div>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12.5px',
            color: 'var(--ink-55)',
          }}
        >
          EACH ROW OPENS A CASE STUDY
        </span>
      </div>

      <div id="projects-list" style={{ borderTop: '1px solid var(--line)' }}>
        {projects.map((p, idx) => {
          const num = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`
          return (
            <Link
              key={p.slug}
              href={`/project/${encodeURIComponent(p.slug)}`}
              data-reveal
              data-hover-bg
              onMouseEnter={() => {
                if (previewImgRef.current && p.img) {
                  previewImgRef.current.src = p.img
                }
                if (previewRef.current) {
                  previewRef.current.style.opacity = '1'
                }
              }}
              onMouseLeave={() => {
                if (previewRef.current) {
                  previewRef.current.style.opacity = '0'
                }
              }}
              style={{
                display: 'grid',
                gridTemplateColumns: '90px 1fr auto auto',
                alignItems: 'center',
                gap: '28px',
                padding: '38px 40px',
                borderBottom: '1px solid var(--line)',
                color: 'var(--ink)',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s',
              }}
              className="project-row-responsive"
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '13px',
                  color: 'inherit',
                  opacity: 0.6,
                }}
              >
                {num}
              </span>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(22px, 2.6vw, 36px)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                  color: 'inherit',
                }}
              >
                {p.title}
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '12px',
                  letterSpacing: '0.06em',
                  color: 'inherit',
                  opacity: 0.65,
                  textTransform: 'uppercase',
                }}
              >
                {p.category}
              </span>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '26px',
                  color: 'inherit',
                }}
              >
                ↗
              </span>
            </Link>
          )
        })}
      </div>

      <div
        ref={previewRef}
        id="hover-preview"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 60,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.15s',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={previewImgRef}
          id="hover-preview-img"
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
          alt="Project Preview"
          style={{
            width: '420px',
            height: '270px',
            objectFit: 'cover',
            display: 'block',
            border: '1px solid var(--line-30)',
            boxShadow: '0 50px 90px rgba(0,0,0,0.65)',
            transition: 'transform 0.16s ease-out',
            willChange: 'transform',
          }}
        />
      </div>
    </section>
  )
}
