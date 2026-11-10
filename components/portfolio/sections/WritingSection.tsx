'use client'

import React from 'react'
import Link from 'next/link'

export interface BlogItem {
  slug: string
  title: string
  tag?: string
  date?: string
  excerpt?: string
  img?: string
  read_time?: string
  content?: string
}

interface WritingSectionProps {
  blogs: BlogItem[]
}

export function WritingSection({ blogs }: WritingSectionProps) {
  const latestBlogs = blogs.slice(0, 3)

  return (
    <section
      id="blog"
      data-screen-label="Blog"
      style={{
        padding: '130px 40px 0',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '24px',
          marginBottom: '60px',
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
            (06)
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
            Writing
          </h2>
        </div>
        <Link
          href="/blog"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12.5px',
            borderBottom: '1px solid var(--line-40)',
            paddingBottom: '4px',
            color: 'var(--ink)',
            textDecoration: 'none',
          }}
        >
          ALL {blogs.length} POSTS ↗
        </Link>
      </div>

      <div id="home-blogs-list" style={{ borderTop: '1px solid var(--line)' }}>
        {latestBlogs.map((b) => (
          <Link
            key={b.slug}
            href={`/blog/${encodeURIComponent(b.slug)}`}
            data-reveal
            data-hover-bg
            style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr auto',
              gap: '32px',
              alignItems: 'baseline',
              padding: '30px 20px',
              borderBottom: '1px solid var(--line)',
              color: 'var(--ink)',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            className="blog-row-responsive"
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '12px',
                color: 'inherit',
                opacity: 0.6,
              }}
            >
              {b.date ? b.date.toUpperCase() : ''}
            </span>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: '23px',
                color: 'inherit',
              }}
            >
              {b.title}
            </span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11.5px',
                letterSpacing: '0.08em',
                color: 'inherit',
                opacity: 0.6,
                textTransform: 'uppercase',
              }}
            >
              {b.tag || 'AI · BACKEND'}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
