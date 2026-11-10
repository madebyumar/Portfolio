'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { socialLink } from '../socialLinks'

interface FooterProps {
  name?: string
  bio?: string
  status?: string
  email?: string
  github?: string
  linkedin?: string
  whatsapp?: string
  location?: string
  timezone?: string
  ianaTimezone?: string
}

export function Footer({
  name = 'Umar Shoaib',
  bio = 'Software engineer building APIs, full-stack platforms, and AI systems that hold up in production.',
  status = 'OPEN TO WORK',
  email = 'contact@umarshoaib.com',
  github = 'https://github.com/madebyumar',
  linkedin = 'https://www.linkedin.com/in/umar-shoaib20',
  whatsapp = 'https://wa.me/923030890952',
  location = 'GUJRANWALA, PAKISTAN',
  timezone = 'GMT+5',
  ianaTimezone = 'Asia/Karachi',
}: FooterProps) {
  const [clock, setClock] = useState('--:--')

  useEffect(() => {
    function updateClock() {
      try {
        const time = new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: ianaTimezone || 'Asia/Karachi',
        })
        setClock(time)
      } catch {
        const d = new Date()
        setClock(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`)
      }
    }
    updateClock()
    const t = setInterval(updateClock, 10000)
    return () => clearInterval(t)
  }, [ianaTimezone])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer id="site-footer" style={{ borderTop: '1px solid var(--line)' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
          gap: '40px',
          padding: '64px 40px',
          borderBottom: '1px solid var(--line)',
        }}
        className="footer-grid-responsive"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: '32px',
                letterSpacing: '-0.03em',
                color: 'var(--ink)',
                textTransform: 'lowercase',
              }}
            >
              {name.toLowerCase().split(' ')[0]}
              <span style={{ color: 'var(--accent)' }}>.</span>
            </span>
          </div>
          <p
            id="footer-bio"
            style={{
              margin: 0,
              fontSize: '14px',
              lineHeight: 1.7,
              color: 'var(--ink-60)',
              maxWidth: '300px',
            }}
          >
            {bio}
          </p>
          <span
            id="footer-status"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11.5px',
              letterSpacing: '0.1em',
              color: 'var(--accent)',
            }}
          >
            ● {status.replace(/^[●•\s]+/, '').toUpperCase()} — REMOTE, WORLDWIDE
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '13px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12px',
            letterSpacing: '0.06em',
          }}
        >
          <span style={{ color: 'var(--ink-45)', marginBottom: '6px' }}>SITEMAP</span>
          <Link href="/#services" style={{ color: 'var(--ink-72)', textDecoration: 'none' }}>
            WHAT I DO
          </Link>
          <Link href="/#projects" style={{ color: 'var(--ink-72)', textDecoration: 'none' }}>
            WORK
          </Link>
          <Link href="/#skills" style={{ color: 'var(--ink-72)', textDecoration: 'none' }}>
            SKILLS
          </Link>
          <Link href="/#experience" style={{ color: 'var(--ink-72)', textDecoration: 'none' }}>
            EXPERIENCE
          </Link>
          <Link href="/blog" style={{ color: 'var(--ink-72)', textDecoration: 'none' }}>
            BLOG
          </Link>
          <Link href="/hire" style={{ color: 'var(--ink-72)', textDecoration: 'none' }}>
            HIRE ME
          </Link>
          <Link href="/#contact" style={{ color: 'var(--ink-72)', textDecoration: 'none' }}>
            CONTACT
          </Link>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '13px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12px',
            letterSpacing: '0.06em',
          }}
        >
          <span style={{ color: 'var(--ink-45)', marginBottom: '6px' }}>ELSEWHERE</span>
          {github && (
            <a
              id="footer-github-link"
              href={socialLink('github', github)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ink-72)', textDecoration: 'none' }}
            >
              GITHUB ↗
            </a>
          )}
          {linkedin && (
            <a
              id="footer-linkedin-link"
              href={socialLink('linkedin', linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ink-72)', textDecoration: 'none' }}
            >
              LINKEDIN ↗
            </a>
          )}
          {whatsapp && (
            <a
              id="footer-whatsapp-link"
              href={socialLink('whatsapp', whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ink-72)', textDecoration: 'none' }}
            >
              WHATSAPP ↗
            </a>
          )}
          <Link href="/blog" style={{ color: 'var(--ink-72)', textDecoration: 'none' }}>
            BLOG ↗
          </Link>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '13px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12px',
            letterSpacing: '0.06em',
          }}
        >
          <span style={{ color: 'var(--ink-45)', marginBottom: '6px' }}>CONTACT</span>
          <a
            id="footer-email-link"
            href={`mailto:${email}`}
            style={{ color: 'var(--ink-72)', textDecoration: 'none' }}
          >
            {email.toUpperCase()}
          </a>
          <span id="footer-location" style={{ color: 'var(--ink-60)' }}>
            {location.toUpperCase()}
          </span>
          <span id="footer-clock" style={{ color: 'var(--ink-60)' }}>
            {clock} {timezone}
          </span>
          <span style={{ color: 'var(--ink-60)' }}>REPLIES WITHIN 24H</span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          padding: '22px 40px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11.5px',
          color: 'var(--ink-45)',
          letterSpacing: '0.08em',
        }}
      >
        <span id="footer-copyright">
          © {new Date().getFullYear()} {name.toUpperCase()} · SOFTWARE ENGINEER · FULL-STACK &amp; AI
        </span>
        <button
          id="back-to-top"
          onClick={scrollToTop}
          style={{
            background: 'none',
            border: '1px solid var(--line-25)',
            color: 'var(--ink-60)',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11.5px',
            letterSpacing: '0.08em',
            padding: '9px 18px',
            cursor: 'pointer',
          }}
        >
          BACK TO TOP ↑
        </button>
      </div>
    </footer>
  )
}

