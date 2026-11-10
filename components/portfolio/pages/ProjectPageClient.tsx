'use client'

import React from 'react'
import Link from 'next/link'
import { socialLink } from '../socialLinks'
import { Navbar } from '../shared/Navbar'
import { Footer } from '../shared/Footer'
import { MediaImage } from '../shared/MediaImage'
import type { Profile, Project } from '@/lib/data/types'

interface ProjectPageClientProps {
  projects: Project[]
  slug: string
  profile?: Profile
}

export function ProjectPageClient({ projects, slug, profile }: ProjectPageClientProps) {
  const project = projects.find((x) => x.slug === slug) || projects[0]
  const others = projects.filter((x) => x.slug !== project.slug).slice(0, 3)

  const email = profile?.email || 'contact@umarshoaib.com'
  const whatsapp = profile?.whatsapp || 'https://wa.me/923030890952'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Navbar
        name={profile?.name}
        timezone={profile?.timezone}
        ianaTimezone={profile?.ianaTimezone}
      />

      <article id="main-content" style={{ boxSizing: 'border-box' }}>
        <header
          style={{
            padding: '150px 40px 0',
            maxWidth: '1300px',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '20px',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '13px',
              letterSpacing: '0.08em',
              marginBottom: '28px',
            }}
          >
            <span style={{ color: 'var(--accent)' }}>CASE STUDY</span>
            <span style={{ color: 'var(--ink-55)', textTransform: 'uppercase' }}>{project.category}</span>
          </div>

          <h1
            className="portfolio-case-title"
            style={{
              margin: 0,
              fontFamily: 'var(--font-display), sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(48px, 7.5vw, 108px)',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              maxWidth: '1100px',
            }}
          >
            {project.title}
            <span style={{ color: 'var(--accent)' }}>.</span>
          </h1>

          {project.context && (
            <div
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '12.5px',
                color: 'var(--ink-55)',
                marginTop: '24px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {project.context}
            </div>
          )}

          {project.tech && project.tech.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '24px' }}>
              {project.tech.map((t, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '7px 16px',
                    border: '1px solid var(--line-25)',
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '12px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </header>

        {project.img && (
          <div
            style={{
              maxWidth: '1300px',
              margin: '56px auto 0',
              padding: '0 40px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                position: 'relative',
                border: '1px solid var(--line-18)',
                width: '100%',
                aspectRatio: '16 / 9',
                maxHeight: '560px',
                overflow: 'hidden',
              }}
            >
              <MediaImage
                src={project.img}
                alt={project.title}
                fill
                sizes="(max-width: 1300px) 100vw, 1300px"
                style={{ objectFit: 'cover', filter: 'grayscale(0.2) contrast(1.05)' }}
                priority
              />
            </div>
          </div>
        )}

        <section
          id="case-body"
          style={{
            maxWidth: '1300px',
            margin: '0 auto',
            padding: '90px 40px 0',
            boxSizing: 'border-box',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '60px',
          }}
          className="case-body-responsive"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
            {project.problem && (
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '13px',
                    color: 'var(--accent)',
                    letterSpacing: '0.1em',
                    marginBottom: '16px',
                  }}
                >
                  (A) THE PROBLEM
                </div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-display), sans-serif',
                    fontWeight: 700,
                    fontSize: '26px',
                    lineHeight: 1.4,
                    color: 'var(--ink)',
                  }}
                >
                  {project.problem}
                </p>
              </div>
            )}

            {project.solution && (
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '13px',
                    color: 'var(--accent)',
                    letterSpacing: '0.1em',
                    marginBottom: '16px',
                  }}
                >
                  (B) THE SOLUTION
                </div>
                <p style={{ margin: 0, fontSize: '18px', lineHeight: 1.75, color: 'var(--ink-80)' }}>
                  {project.solution}
                </p>
              </div>
            )}

            {project.highlights && project.highlights.length > 0 && (
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '13px',
                    color: 'var(--accent)',
                    letterSpacing: '0.1em',
                    marginBottom: '20px',
                  }}
                >
                  (C) KEY HIGHLIGHTS
                </div>
                <div style={{ borderTop: '1px solid var(--line)' }}>
                  {project.highlights.map((h, hIdx) => {
                    const num = hIdx + 1 < 10 ? `0${hIdx + 1}` : `${hIdx + 1}`
                    return (
                      <div
                        key={hIdx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '40px 1fr',
                          gap: '16px',
                          padding: '22px 0',
                          borderBottom: '1px solid var(--line)',
                          alignItems: 'baseline',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-mono), monospace',
                            fontSize: '12px',
                            color: 'var(--accent)',
                          }}
                        >
                          {num}
                        </span>
                        <span style={{ fontSize: '16px', lineHeight: 1.65, color: 'var(--ink-85)' }}>{h}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              alignSelf: 'start',
              position: 'sticky',
              top: '100px',
            }}
          >
            {project.stat && (
              <div
                style={{
                  padding: '36px 28px',
                  border: '1px solid var(--accent)',
                  textAlign: 'center',
                  background: 'var(--card)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display), sans-serif',
                    fontWeight: 800,
                    fontSize: '58px',
                    lineHeight: 1,
                    color: 'var(--accent)',
                  }}
                >
                  {project.stat}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '11.5px',
                    color: 'var(--ink-60)',
                    marginTop: '12px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {project.statLabel || 'KEY METRIC'}
                </div>
              </div>
            )}

            <div
              style={{
                padding: '28px',
                border: '1px solid var(--line-18)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                background: 'var(--card)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '12px',
                  color: 'var(--ink-60)',
                  letterSpacing: '0.08em',
                }}
              >
                WANT SOMETHING LIKE THIS?
              </div>
              <a
                id="email-cta"
                href={`mailto:${email}?subject=${encodeURIComponent(`Inquiry regarding ${project.title}`)}`}
                style={{
                  padding: '13px 20px',
                  background: 'var(--accent)',
                  color: 'var(--accent-ink)',
                  fontWeight: 600,
                  fontSize: '14px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono), monospace',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
              >
                EMAIL ME ↗
              </a>
              {whatsapp && (
                <a
                  id="whatsapp-cta"
                  href={socialLink('whatsapp', whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '13px 20px',
                    border: '1px solid var(--line-30)',
                    fontSize: '14px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono), monospace',
                    color: 'var(--ink)',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                >
                  WHATSAPP ↗
                </a>
              )}
            </div>
          </div>
        </section>

        {others.length > 0 && (
          <section
            style={{
              maxWidth: '1300px',
              margin: '120px auto 0',
              padding: '0 40px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px', marginBottom: '40px' }}>
              <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '13px', color: 'var(--accent)' }}>
                (D)
              </span>
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-display), sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(32px, 4vw, 56px)',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                }}
              >
                More work
              </h2>
            </div>

            <div style={{ borderTop: '1px solid var(--line)' }}>
              {others.map((o, idx) => {
                const num = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`
                return (
                  <Link
                    key={o.slug}
                    href={`/project/${encodeURIComponent(o.slug)}`}
                    data-hover-bg
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '90px 1fr auto auto',
                      alignItems: 'center',
                      gap: '28px',
                      padding: '28px 20px',
                      borderBottom: '1px solid var(--line)',
                      color: 'var(--ink)',
                      textDecoration: 'none',
                      transition: 'background 0.2s, color 0.2s',
                    }}
                    className="project-row-responsive"
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: '13px',
                        color: 'inherit',
                        opacity: 0.6,
                      }}
                    >
                      {num}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-display), sans-serif',
                        fontWeight: 700,
                        fontSize: 'clamp(20px, 2.2vw, 30px)',
                        color: 'inherit',
                      }}
                    >
                      {o.title}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: '12px',
                        color: 'inherit',
                        opacity: 0.65,
                        textTransform: 'uppercase',
                      }}
                    >
                      {o.category}
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
                  </Link>
                )
              })}
            </div>
          </section>
        )}
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
