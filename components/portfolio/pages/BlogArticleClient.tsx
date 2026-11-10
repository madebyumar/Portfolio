'use client'

import React from 'react'
import Link from 'next/link'
import { Navbar } from '../shared/Navbar'
import { Footer } from '../shared/Footer'
import { MediaImage } from '../shared/MediaImage'
import { renderMarkdown } from '@/lib/markdown'
import type { BlogPost, Profile } from '@/lib/data/types'

interface BlogArticleClientProps {
  post: BlogPost
  profile?: Profile
}

export function BlogArticleClient({ post, profile }: BlogArticleClientProps) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Navbar
        name={profile?.name}
        timezone={profile?.timezone}
        ianaTimezone={profile?.ianaTimezone}
      />

      <article
        id="main-content"
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '150px 40px 120px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ marginBottom: '36px' }}>
          <Link
            href="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '12px',
              letterSpacing: '0.08em',
              color: 'var(--accent)',
              borderBottom: '1px solid var(--accent)',
              paddingBottom: '4px',
              textDecoration: 'none',
            }}
          >
            ← ALL ARTICLES
          </Link>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            gap: '16px',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '12px',
            letterSpacing: '0.1em',
            color: 'var(--ink-50)',
            marginBottom: '20px',
          }}
        >
          <span>{post.date || ''}</span>
          <span>·</span>
          <span style={{ color: 'var(--accent)' }}>{post.read_time || '5 MIN READ'}</span>
          <span>·</span>
          <span style={{ textTransform: 'uppercase' }}>{post.tag || 'ENGINEERING'}</span>
        </div>

        <h1
          className="portfolio-article-title"
          style={{
            margin: '0 0 24px 0',
            fontFamily: 'var(--font-display), sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(36px, 5vw, 64px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {post.title}
        </h1>

        {post.excerpt && (
          <div
            style={{
              fontSize: '18px',
              lineHeight: 1.7,
              color: 'var(--ink-85)',
              borderLeft: '3px solid var(--accent)',
              paddingLeft: '20px',
              marginBottom: '40px',
              fontStyle: 'italic',
            }}
          >
            {post.excerpt}
          </div>
        )}

        {post.img && (
          <div
            style={{
              position: 'relative',
              marginBottom: '48px',
              border: '1px solid var(--line-20)',
              width: '100%',
              aspectRatio: '16 / 9',
              maxHeight: '480px',
              overflow: 'hidden',
            }}
          >
            <MediaImage
              src={post.img}
              alt={post.title}
              fill
              sizes="(max-width: 860px) 100vw, 860px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}

        <div
          className="article-body"
          style={{
            fontSize: '16.5px',
            lineHeight: 1.8,
            color: 'var(--ink-80)',
          }}
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(post.content || post.excerpt || ''),
          }}
        />

        <div
          style={{
            marginTop: '80px',
            paddingTop: '40px',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <Link
            href="/blog"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '13px',
              color: 'var(--accent)',
              borderBottom: '1px solid var(--accent)',
              paddingBottom: '4px',
              textDecoration: 'none',
            }}
          >
            ← BACK TO ALL ARTICLES
          </Link>
          <Link
            href="/#contact"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '13px',
              color: 'var(--ink-60)',
              textDecoration: 'none',
            }}
          >
            HAVE A QUESTION? GET IN TOUCH ↗
          </Link>
        </div>
      </article>

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
