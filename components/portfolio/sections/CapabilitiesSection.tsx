'use client'

import React from 'react'

export interface SkillCategory {
  category: string
  name: string
  display_order?: number
}

interface CapabilitiesSectionProps {
  skills?: SkillCategory[]
}

const DEFAULT_SKILLS: SkillCategory[] = [
  {
    category: 'Frontend',
    name: 'React.js · Vue.js · React Native · Blade · JavaScript · HTML / CSS',
  },
  {
    category: 'Backend',
    name: 'Laravel · Node.js · Express.js · FastAPI · Flask · PHP · RESTful APIs · SOLID',
  },
  {
    category: 'Databases',
    name: 'MySQL · PostgreSQL · MongoDB · Redis · Firebase · Supabase',
  },
  {
    category: 'AI / ML',
    name: 'Python · TensorFlow · Keras · YOLO · OpenAI API · Computer Vision · LLMs',
  },
  {
    category: 'Tools / DevOps',
    name: 'Git · Docker · Linux · n8n · Postman · Vercel',
  },
  {
    category: 'Architecture',
    name: 'MVC · Clean Architecture · Microservices · API-first Design',
  },
]

export function CapabilitiesSection({ skills }: CapabilitiesSectionProps) {
  const items = skills && skills.length > 0 ? skills : DEFAULT_SKILLS

  return (
    <section
      id="skills"
      data-screen-label="Skills"
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
          (03)
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
          Capabilities
        </h2>
      </div>

      <div
        id="skills-grid"
        style={{
          borderTop: '1px solid var(--line)',
          perspective: '1400px',
        }}
      >
        {items.map((s, idx) => {
          const num = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`
          const delay = idx * 70
          return (
            <div
              key={idx}
              data-reveal
              data-reveal-delay={delay}
              style={{
                display: 'grid',
                gridTemplateColumns: '70px minmax(0, 1fr) minmax(0, 1.5fr)',
                gap: '32px',
                padding: '34px 8px',
                borderBottom: '1px solid var(--line)',
                alignItems: 'baseline',
                transformOrigin: '50% 100%',
              }}
              className="skills-row-responsive"
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '13px',
                  color: 'var(--ink-45)',
                }}
              >
                {num}
              </span>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(20px, 2.2vw, 32px)',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  overflowWrap: 'break-word',
                }}
              >
                {s.category}
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '13.5px',
                  lineHeight: 2,
                  color: 'var(--ink-65)',
                }}
              >
                {s.name}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
