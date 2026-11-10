'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '../shared/Navbar'
import { Footer } from '../shared/Footer'
import type { BlogPost, Profile } from '@/lib/data/types'

interface BlogPageClientProps {
  blogs: BlogPost[]
  profile?: Profile
}

export function BlogPageClient({ blogs, profile }: BlogPageClientProps) {
  const [selectedTag, setSelectedTag] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const tags = ['All', ...Array.from(new Set(blogs.map((b) => b.tag || 'Tech').filter(Boolean)))]

  const filteredBlogs = blogs.filter((b) => {
    const matchesTag = selectedTag === 'All' || b.tag === selectedTag
    const matchesQuery =
      searchQuery === '' ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.excerpt && b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesTag && matchesQuery
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Navbar
        name={profile?.name}
        timezone={profile?.timezone}
        ianaTimezone={profile?.ianaTimezone}
      />

      <main
        id="main-content"
        className="portfolio-blog-list"
        style={{ maxWidth: '1300px', margin: '0 auto', padding: '150px 40px 120px', boxSizing: 'border-box' }}
      >
        <div style={{ marginBottom: '60px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '12.5px',
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              marginBottom: '24px',
            }}
          >
            <span>(06)</span>
            <span>TECHNICAL WRITING</span>
          </div>
          <h1
            className="portfolio-blog-title"
            style={{
              margin: 0,
              fontFamily: 'var(--font-display), sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(52px, 8vw, 110px)',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
            }}
          >
            Articles &amp;
            <br />
            <span
              style={{
                color: 'transparent',
                WebkitTextStroke: '2px var(--ink)',
              }}
            >
              Engineering Notes
            </span>
            <span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p
            style={{
              margin: '28px 0 0',
              maxWidth: '620px',
              fontSize: '16.5px',
              lineHeight: 1.65,
              color: 'var(--ink-72)',
            }}
          >
            Practical guides, architecture breakdowns, and production lessons across Laravel, Python, AI models, and
            databases.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginTop: '40px',
              paddingTop: '24px',
              borderTop: '1px solid var(--line)',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }} role="group" aria-label="Filter by tag">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag(t)}
                  aria-pressed={selectedTag === t}
                  style={{
                    background: selectedTag === t ? 'var(--accent)' : 'transparent',
                    color: selectedTag === t ? 'var(--accent-ink)' : 'var(--ink)',
                    border: `1px solid ${selectedTag === t ? 'var(--accent)' : 'var(--line-30)'}`,
                    padding: '6px 14px',
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '11.5px',
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            <label style={{ display: 'block' }}>
              <span className="sr-only">Search articles</span>
              <input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--line-30)',
                  color: 'var(--ink)',
                  padding: '8px 14px',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '12px',
                  outline: 'none',
                  minWidth: '220px',
                }}
              />
            </label>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--line)' }}>
          {filteredBlogs.length === 0 ? (
            <div
              style={{
                padding: '60px 0',
                textAlign: 'center',
                fontFamily: 'var(--font-mono), monospace',
                color: 'var(--ink-50)',
              }}
            >
              No articles found matching your criteria.
            </div>
          ) : (
            filteredBlogs.map((post, i) => {
              const num = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${encodeURIComponent(post.slug)}`}
                  data-hover-bg
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 140px 1fr auto',
                    alignItems: 'baseline',
                    gap: '28px',
                    padding: '34px 28px',
                    borderBottom: '1px solid var(--line)',
                    color: 'var(--ink)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                  className="blog-card-responsive"
                >
                  <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '13px', opacity: 0.55 }}>
                    {num}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '12px',
                      opacity: 0.65,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {post.date || ''}
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display), sans-serif',
                        fontWeight: 700,
                        fontSize: 'clamp(20px, 2.2vw, 28px)',
                        lineHeight: 1.15,
                        marginBottom: '10px',
                        color: 'inherit',
                      }}
                    >
                      {post.title}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        lineHeight: 1.6,
                        opacity: 0.72,
                        maxWidth: '680px',
                        color: 'inherit',
                      }}
                    >
                      {post.excerpt || ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: '11px',
                        letterSpacing: '0.08em',
                        padding: '5px 10px',
                        border: '1px solid currentColor',
                        opacity: 0.75,
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {post.tag || 'DEV'}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-display), sans-serif',
                        fontWeight: 700,
                        fontSize: '24px',
                        color: 'inherit',
                      }}
                    >
                      ↗
                    </span>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </main>

      <Footer
        name={profile?.name}
        bio={profile?.bio}
        status={profile?.status}
        email={profile?.email}
        github={profile?.github}
        linkedin={profile?.linkedin}
        whatsapp={profile?.whatsapp}
        location={profile?.location}
        timezone={profile?.timezone}
        ianaTimezone={profile?.ianaTimezone}
      />
    </div>
  )
}
