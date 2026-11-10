'use client'

import React from 'react'
import { HeroOrb } from './HeroOrb'
import { socialLink } from '../socialLinks'

interface HeroProps {
  name?: string
  role?: string
  status?: string
  bio?: string
  email?: string
  github?: string
  linkedin?: string
}

export function Hero({
  name = 'Umar Shoaib',
  role = 'SOFTWARE ENGINEER · FULL-STACK & AI',
  status = 'AVAILABLE FOR FREELANCE',
  bio = 'I build the invisible machinery behind modern products: resilient APIs, full-stack platforms, and AI systems that hold up in production. Currently engineering backend & AI at Aibitsoft, with select freelance capacity for teams that ship.',
  email = 'contact@umarshoaib.com',
  github = 'https://github.com/madebyumar',
  linkedin = 'https://www.linkedin.com/in/umar-shoaib20',
}: HeroProps) {
  const parts = name.trim().split(' ')
  const firstName = parts[0] || 'Umar'
  const lastName = parts.slice(1).join(' ') || 'Shoaib'

  return (
    <header
      id="top"
      data-screen-label="Hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '120px 40px 40px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* 3D Interactive Hero Orb Canvas */}
      <HeroOrb />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1300px' }}>
        {/* Role badge */}
        <div
          data-reveal
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12.5px',
            letterSpacing: '0.1em',
            color: 'var(--ink-65)',
            marginBottom: '28px',
          }}
        >
          <span
            style={{
              width: '9px',
              height: '9px',
              background: 'var(--accent)',
            }}
          />
          <span>
            {role.toUpperCase()} {status ? `· ${status.toUpperCase()}` : ''}
          </span>
        </div>

        {/* Huge Name Headline */}
        <h1
          className="portfolio-hero-title"
          data-reveal
          style={{
            margin: 0,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(80px, 13.5vw, 185px)',
            lineHeight: 0.88,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          }}
        >
          {firstName}
          <br />
          <span
            style={{
              color: 'transparent',
              WebkitTextStroke: '2px var(--ink)',
            }}
          >
            {lastName}
          </span>
          <span style={{ color: 'var(--accent)' }}>.</span>
        </h1>

        {/* Bio paragraph & Quick Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 560px) auto',
            gap: '40px',
            alignItems: 'end',
            marginTop: '44px',
          }}
          className="hero-grid-responsive"
        >
          <p
            data-reveal
            style={{
              margin: 0,
              fontSize: '17px',
              lineHeight: 1.65,
              color: 'var(--ink-72)',
            }}
          >
            {bio}
          </p>

          <div
            data-reveal
            style={{
              display: 'flex',
              gap: '26px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '13px',
            }}
          >
            {email && (
              <a
                href={`mailto:${email}`}
                data-magnetic
                style={{
                  display: 'inline-block',
                  borderBottom: '1px solid var(--accent)',
                  paddingBottom: '4px',
                  color: 'var(--accent)',
                  textDecoration: 'none',
                }}
              >
                EMAIL ↗
              </a>
            )}
            {github && (
              <a
                href={socialLink('github', github)}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
                style={{
                  display: 'inline-block',
                  borderBottom: '1px solid var(--line-40)',
                  paddingBottom: '4px',
                  color: 'var(--ink)',
                  textDecoration: 'none',
                }}
              >
                GITHUB ↗
              </a>
            )}
            {linkedin && (
              <a
                href={socialLink('linkedin', linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
                style={{
                  display: 'inline-block',
                  borderBottom: '1px solid var(--line-40)',
                  paddingBottom: '4px',
                  color: 'var(--ink)',
                  textDecoration: 'none',
                }}
              >
                LINKEDIN ↗
              </a>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        data-magnetic
        className="hero-scroll-btn"
        onClick={() => {
          const target = document.getElementById('about-strip') || document.getElementById('services')
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' })
          } else {
            window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })
          }
        }}
        title="Scroll down to explore"
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '40px',
        }}
      >
        <span>SCROLL</span>
        <span className="scroll-arrow">↓</span>
      </button>
    </header>
  )
}
