'use client'

import React from 'react'

interface StatItem {
  value: string
  label: string
}

interface StatsStripProps {
  stats?: StatItem[]
}

const DEFAULT_STATS: StatItem[] = [
  { value: '10+', label: 'Projects shipped' },
  { value: '4+', label: 'Years experience' },
  { value: '94%', label: 'ML model accuracy' },
  { value: '60+', label: 'Students mentored' },
]

export function StatsStrip({ stats }: StatsStripProps) {
  const items = stats && stats.length > 0 ? stats : DEFAULT_STATS

  return (
    <section
      id="stats-section"
      data-screen-label="Stats"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        borderBottom: '1px solid var(--line)',
      }}
      className="stats-grid-responsive"
    >
      {items.map((st, i) => (
        <div
          key={i}
          data-reveal
          style={{
            padding: '44px 40px',
            borderRight: i < items.length - 1 ? '1px solid var(--line)' : 'none',
          }}
        >
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: '56px',
              lineHeight: 1,
              color: 'var(--ink)',
            }}
          >
            {st.value}
          </div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px',
              letterSpacing: '0.1em',
              color: 'var(--ink-55)',
              marginTop: '12px',
              textTransform: 'uppercase',
            }}
          >
            {st.label}
          </div>
        </div>
      ))}
    </section>
  )
}
