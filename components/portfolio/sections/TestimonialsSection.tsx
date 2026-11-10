'use client'

import React from 'react'

export interface TestimonialItem {
  id?: string
  quote: string
  author: string
  role_title: string
  company?: string
  initials?: string
  is_featured?: boolean
}

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[]
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    is_featured: true,
    quote:
      'We came to Umar with a half-finished Laravel backend and a hard deadline. He refactored the mess instead of rewriting it, got the API stable, and flagged two security issues we had not noticed. Not the cheapest quote we got — worth it.',
    author: 'S. Mitchell',
    role_title: 'E-commerce',
    company: 'London',
    initials: 'SM',
  },
  {
    is_featured: false,
    quote:
      'Second project with Umar. Async communication was the selling point for us — clear written updates, honest about what would slip and why. The dashboard itself just works.',
    author: 'J. Torres',
    role_title: 'SaaS',
    company: 'Austin, TX',
    initials: 'JT',
  },
  {
    is_featured: false,
    quote:
      'He pushed back on our original chatbot spec and scoped it to what the content could support — the result is better for it.',
    author: 'A. Al-Rashid',
    role_title: 'Services firm',
    company: 'Dubai',
    initials: 'AR',
  },
]

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const items = testimonials && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS
  const feat = items.find((t) => t.is_featured) || items[0]
  const rest = items.filter((t) => t !== feat).slice(0, 2)

  return (
    <section
      id="testimonials"
      data-screen-label="Testimonials"
      style={{
        padding: '130px 40px 0',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '24px',
          marginBottom: '16px',
        }}
      >
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '13px',
            color: 'var(--accent)',
          }}
        >
          (05)
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
          Client words
        </h2>
      </div>
      <p
        style={{
          margin: '0 0 60px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '12.5px',
          color: 'var(--ink-55)',
          letterSpacing: '0.06em',
        }}
      >
        FREELANCE PROJECTS · DELIVERED INDEPENDENTLY, WORLDWIDE
      </p>

      <div
        id="quotes-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          borderTop: '1px solid var(--line)',
          borderLeft: '1px solid var(--line)',
        }}
        className="quotes-grid-responsive"
      >
        {/* Featured Review */}
        <div
          data-reveal
          style={{
            gridRow: 'span 2',
            padding: '56px 48px',
            borderRight: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            background: 'var(--card)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: '96px',
                lineHeight: 0.4,
                color: 'var(--accent)',
              }}
            >
              &ldquo;
            </span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: 'var(--ink-45)',
              }}
            >
              FEATURED
            </span>
          </div>

          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(20px, 2vw, 27px)',
              lineHeight: 1.45,
              flex: 1,
              color: 'var(--ink)',
            }}
          >
            {feat.quote}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span
              style={{
                width: '52px',
                height: '52px',
                background: 'var(--accent)',
                color: 'var(--accent-ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: '18px',
              }}
            >
              {feat.initials || 'CL'}
            </span>
            <span>
              <span
                style={{
                  display: 'block',
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '17px',
                  color: 'var(--ink)',
                }}
              >
                {feat.author}
              </span>
              <span
                style={{
                  display: 'block',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11.5px',
                  color: 'var(--ink-55)',
                  marginTop: '5px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {feat.role_title} {feat.company ? `· ${feat.company}` : ''}
              </span>
            </span>
          </div>
        </div>

        {/* Secondary Reviews */}
        {rest.map((item, idx) => (
          <div
            key={idx}
            data-reveal
            data-hover-bg
            style={{
              padding: '36px 34px',
              borderRight: '1px solid var(--line)',
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              cursor: 'default',
            }}
          >
            <div
              style={{
                fontSize: '14.5px',
                lineHeight: 1.7,
                opacity: 0.82,
                flex: 1,
              }}
            >
              &ldquo;{item.quote}&rdquo;
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
              <span
                style={{
                  width: '40px',
                  height: '40px',
                  border: '1px solid currentColor',
                  opacity: 0.72,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: '14px',
                }}
              >
                {item.initials || 'CL'}
              </span>
              <span>
                <span
                  style={{
                    display: 'block',
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: '15px',
                  }}
                >
                  {item.author}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '11px',
                    opacity: 0.6,
                    marginTop: '4px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.role_title} {item.company ? `· ${item.company}` : ''}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
