'use client'

import React from 'react'

export interface ServiceItem {
  num: string
  tag: string
  title: string
  desc: string
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    num: '01',
    tag: 'REST APIS',
    title: 'Backend Development',
    desc: 'APIs that stay fast under load. Laravel and Node.js services with clean architecture, strict access control, and the discipline to scale past launch day.',
  },
  {
    num: '02',
    tag: 'MERN · LARAVEL',
    title: 'Full-Stack Web Apps',
    desc: 'From schema to shipped product. I take ideas end-to-end: data models, business logic, and React interfaces that feel effortless to use.',
  },
  {
    num: '03',
    tag: 'OPENAI · YOLO',
    title: 'AI & ML Integration',
    desc: 'Practical AI, not demos. Vision models, LLM pipelines, and OpenAI-powered features wired into real products behind clean, deployable APIs.',
  },
  {
    num: '04',
    tag: 'AUTOMATION',
    title: 'Python Development',
    desc: 'Automation, model training, and Flask services: Python that quietly does the heavy lifting once it reaches production.',
  },
  {
    num: '05',
    tag: 'SQL · NOSQL',
    title: 'Database Design',
    desc: 'Schemas built for the long run. Indexing, query tuning, and data models across MySQL, PostgreSQL, and MongoDB that stay quick at a million rows.',
  },
  {
    num: '06',
    tag: 'REACT NATIVE',
    title: 'Mobile App Backend',
    desc: 'The engine behind the app: authentication, push, real-time sync, and APIs that mobile clients can rely on without workarounds.',
  },
]

interface ServicesSectionProps {
  services?: ServiceItem[]
}

export function ServicesSection({ services }: ServicesSectionProps) {
  const items = services && services.length > 0 ? services : DEFAULT_SERVICES

  return (
    <section
      id="services"
      data-screen-label="What I Do"
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
          (01)
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
          What I do
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderTop: '1px solid var(--line)',
          borderLeft: '1px solid var(--line)',
        }}
        className="services-grid-responsive"
      >
        {items.map((s, idx) => (
          <div
            key={`${s.num}-${s.title}-${idx}`}
            data-reveal
            data-hover-bg
            style={{
              position: 'relative',
              padding: '34px 30px 38px',
              borderBottom: '1px solid var(--line)',
              borderRight: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '250px',
              boxSizing: 'border-box',
              cursor: 'default',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '34px',
              }}
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '13px',
                  opacity: 0.55,
                }}
              >
                {s.num}
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  opacity: 0.55,
                  textTransform: 'uppercase',
                }}
              >
                {s.tag}
              </span>
            </div>
            <h3
              style={{
                margin: '0 0 16px',
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: '24px',
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
              }}
            >
              {s.title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '14.5px',
                lineHeight: 1.7,
                opacity: 0.78,
              }}
            >
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
