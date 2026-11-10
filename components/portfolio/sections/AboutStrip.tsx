'use client'

import React from 'react'
import Image from 'next/image'

interface AboutStripProps {
  headline?: string
  bio?: string
  timezone?: string
  location?: string
  status?: string
}

export function AboutStrip({
  headline = 'Software engineer, based in Gujranwala, Pakistan.',
  bio = "I work remotely with clients worldwide — currently engineering backend & AI systems at Aibitsoft, previously Nexl Tech. If it needs an API, a database, or a model in production, it's my kind of problem.",
  timezone = 'GMT+5',
  location = 'Gujranwala, Pakistan',
  status = 'OPEN TO WORK',
}: AboutStripProps) {
  return (
    <section
      id="about-strip"
      data-screen-label="About"
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '90px 40px 0',
        boxSizing: 'border-box',
      }}
    >
      <div
        data-reveal
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(140px, auto) 1fr auto',
          gap: '36px',
          alignItems: 'center',
          border: '1px solid var(--line-18)',
          padding: '30px 34px',
        }}
        className="about-strip-responsive"
      >
        {/* Photo with Offset Accent Frame and Hover Motion */}
        <div style={{ position: 'relative', width: '150px', flexShrink: 0 }}>
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              width: '150px',
              height: '170px',
              border: '1px solid var(--accent)',
            }}
          />
          <Image
            src="/uploads/portrait.jpeg"
            alt="Umar Shoaib"
            width={150}
            height={170}
            priority
            style={{
              position: 'relative',
              width: '150px',
              height: '170px',
              objectFit: 'cover',
              objectPosition: 'top',
              display: 'block',
              border: '1px solid var(--line-25)',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translate(-4px, -4px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none'
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: 0,
              bottom: '-11px',
              padding: '4px 10px',
              background: 'var(--accent)',
              color: 'var(--accent-ink)',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.1em',
              fontWeight: 600,
            }}
          >
            EST. 2022
          </span>
        </div>

        {/* Text */}
        <div>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '22px',
              marginBottom: '10px',
            }}
          >
            {headline}
          </div>
          <p
            style={{
              margin: 0,
              fontSize: '15px',
              lineHeight: 1.7,
              color: 'var(--ink-72)',
              maxWidth: '560px',
            }}
          >
            {bio}
          </p>
        </div>

        {/* Status / Location */}
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11.5px',
            letterSpacing: '0.1em',
            color: 'var(--ink-55)',
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span>
            {timezone} · {location ? location.toUpperCase() : 'REMOTE'}
          </span>
          <span style={{ color: 'var(--accent)' }}>
            ● {status.replace(/^[●•\s]+/, '').toUpperCase()}
          </span>
        </div>
      </div>
    </section>
  )
}
