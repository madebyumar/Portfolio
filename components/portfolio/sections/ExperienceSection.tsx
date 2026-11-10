'use client'

import React from 'react'

export interface ExperienceItem {
  period: string
  role: string
  company: string
  location?: string
  description?: string
  bullets?: string[]
  display_order?: number
}

interface ExperienceSectionProps {
  experiences?: ExperienceItem[]
}

const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  {
    period: 'OCT 2025 → PRESENT',
    role: 'Backend + AI Engineer',
    company: 'Aibitsoft',
    location: 'Gujranwala, PK',
    description:
      'Shipping production APIs in Laravel and Node.js, wiring OpenAI into content pipelines, and building an AI chatbot that learns entire websites. Plus dealer-platform automation with n8n and serious SQL performance work.',
    bullets: ['Laravel', 'Node.js', 'OpenAI API', 'n8n', 'PostgreSQL'],
  },
  {
    period: 'SEP 2024 → OCT 2025',
    role: 'Full Stack Developer',
    company: 'Nexl Tech',
    location: 'Gujranwala, PK',
    description:
      'Owned backends for consumer products: a 25-feature music platform with AI recommendations, a multi-role marine hiring app with live messaging and bookings, and NLP services shipped as Flask APIs.',
    bullets: ['Laravel', 'MySQL', 'REST APIs', 'Flask', 'OpenAI API'],
  },
  {
    period: '2022 → PRESENT',
    role: 'Freelance Full Stack Developer',
    company: 'Self-employed',
    location: 'Worldwide · Remote',
    description:
      'End-to-end delivery for clients across the UK, US, and UAE: from first requirements call to deployed, documented systems. API-first and deadline-honest.',
    bullets: ['MERN', 'Laravel', 'Mobile Backends', 'UK · US · UAE'],
  },
  {
    period: 'MAR 2023 → SEP 2024',
    role: 'Full Stack Instructor',
    company: 'Whiz Institute (TEVTA)',
    location: 'PK',
    description:
      'Taught the MERN stack to 60+ students through real projects rather than slides, and wrote the curriculum they learned from.',
    bullets: ['MERN', 'Curriculum Design', '60+ Students'],
  },
]

/** Big outline label derived from the real period years — never hardcode 2025. */
function getEraTitle(period: string): string {
  const years = period.match(/\b(20\d{2})\b/g) || []
  const start = years[0]
  const endYear = years.length > 1 ? years[years.length - 1] : undefined
  const isPresent = /present/i.test(period)

  if (start && isPresent) return `${start}—NOW`
  if (start && endYear && endYear !== start) return `${start}—${endYear.slice(2)}`
  if (start) return start
  return period.split(/[·→]/)[0]?.trim().toUpperCase() || period
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const items = experiences && experiences.length > 0 ? experiences : DEFAULT_EXPERIENCES

  return (
    <section
      id="experience"
      data-screen-label="Experience"
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
          marginBottom: '60px',
        }}
      >
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '13px',
            color: 'var(--accent)',
          }}
        >
          (04)
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
          Experience
        </h2>
      </div>

      <div id="exp-list" style={{ borderTop: '1px solid var(--line)' }}>
        {items.map((exp, idx) => {
          const eraTitle = getEraTitle(exp.period)

          return (
            <div
              key={idx}
              data-reveal
              data-hover-bg
              style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.4fr)',
                gap: '40px',
                alignItems: 'start',
                minHeight: '280px',
                height: '280px',
                padding: '40px 24px',
                boxSizing: 'border-box',
                borderBottom: '1px solid var(--line)',
                overflow: 'hidden',
                transition: 'background 0.3s, color 0.3s',
              }}
              className="experience-row-responsive"
            >
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  className="exp-era"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(34px, 4.2vw, 68px)',
                    lineHeight: 0.95,
                    letterSpacing: '-0.02em',
                    color: 'transparent',
                    WebkitTextStroke: '1.5px var(--line-40)',
                    overflowWrap: 'anywhere',
                    transition: 'WebkitTextStroke 0.25s ease',
                  }}
                >
                  {eraTitle}
                </div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '12.5px',
                    opacity: 0.6,
                    marginTop: '16px',
                    letterSpacing: '0.08em',
                  }}
                >
                  {exp.period}
                </div>
              </div>

              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0,
                  height: '100%',
                }}
              >
                <div
                  className="exp-role-clamp"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(22px, 2.4vw, 32px)',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.1,
                  }}
                >
                  {exp.role}
                </div>
                <div
                  className="exp-org"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '12.5px',
                    color: 'var(--accent)',
                    margin: '12px 0 14px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    transition: 'color 0.25s ease',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ''}
                </div>
                {exp.description && (
                  <div
                    className="exp-desc-clamp"
                    style={{
                      fontSize: '15px',
                      lineHeight: 1.65,
                      opacity: 0.82,
                      maxWidth: '640px',
                      flex: '1 1 auto',
                    }}
                  >
                    {exp.description}
                  </div>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginTop: 'auto',
                      paddingTop: '16px',
                    }}
                  >
                    {exp.bullets.slice(0, 5).map((b, bIdx) => (
                      <span
                        key={bIdx}
                        style={{
                          padding: '5px 12px',
                          border: '1px solid currentColor',
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '11px',
                          letterSpacing: '0.08em',
                          opacity: 0.75,
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
