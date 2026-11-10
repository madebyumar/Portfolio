'use client'

import React, { useState } from 'react'
import { socialLink } from '../socialLinks'

interface ContactSectionProps {
  email?: string
  whatsapp?: string
}

export function ContactSection({
  email = 'contact@umarshoaib.com',
  whatsapp = 'https://wa.me/923030890952',
}: ContactSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    company: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSentSuccess(true)
        setFormData({ name: '', email: '', subject: '', message: '', company: '' })
      } else {
        setErrorMsg(data.error || 'Failed to send message. Please try again.')
      }
    } catch {
      setErrorMsg('Network error. Please try again or use direct email.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      data-screen-label="Contact"
      style={{
        padding: '150px 40px 60px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '13px',
          color: 'var(--accent)',
          marginBottom: '24px',
        }}
      >
        (07) HAVE A PROJECT IN MIND?
      </div>

      <a
        id="lets-talk"
        href={`mailto:${email}`}
        data-reveal
        style={{
          display: 'inline-block',
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(64px, 11vw, 160px)',
          lineHeight: 0.95,
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          color: 'transparent',
          WebkitTextStroke: '2px var(--ink)',
          textDecoration: 'none',
          transition: 'color 0.25s, -webkit-text-stroke-color 0.25s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--accent)'
          e.currentTarget.style.webkitTextStrokeColor = 'var(--accent)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'transparent'
          e.currentTarget.style.webkitTextStrokeColor = 'var(--ink)'
        }}
      >
        Let&apos;s talk ↗
      </a>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          marginTop: '48px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '13px',
        }}
      >
        <a
          id="contact-email-link"
          href={`mailto:${email}`}
          style={{
            borderBottom: '1px solid var(--line-40)',
            paddingBottom: '4px',
            color: 'var(--ink)',
            textDecoration: 'none',
          }}
        >
          {email.toUpperCase()}
        </a>

        {whatsapp && (
          <a
            id="contact-whatsapp-link"
            href={socialLink('whatsapp', whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              borderBottom: '1px solid var(--line-40)',
              paddingBottom: '4px',
              color: 'var(--ink)',
              textDecoration: 'none',
            }}
          >
            WHATSAPP ↗
          </a>
        )}

        <button
          type="button"
          aria-expanded={showForm}
          aria-controls="contact-inquiry-panel"
          onClick={() => setShowForm(!showForm)}
          style={{
            background: showForm ? 'var(--accent)' : 'transparent',
            color: showForm ? 'var(--accent-ink)' : 'var(--accent)',
            border: '1px solid var(--accent)',
            padding: '8px 18px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {showForm ? 'CLOSE INQUIRY FORM ✕' : 'LEAVE A MESSAGE INBOX ✉'}
        </button>
      </div>

      {/* In-Page Quick Contact Form */}
      {showForm && (
        <div
          id="contact-inquiry-panel"
          style={{
            maxWidth: '560px',
            margin: '40px auto 0',
            textAlign: 'left',
            background: 'var(--card)',
            border: '1px solid var(--line-30)',
            padding: '32px',
            borderRadius: '4px',
          }}
        >
          {sentSuccess ? (
            <div role="status" style={{ textAlign: 'center', padding: '24px 0' }}>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: '22px',
                  color: 'var(--accent)',
                  marginBottom: '10px',
                }}
              >
                Message Received!
              </div>
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '13px',
                  color: 'var(--ink-72)',
                  margin: 0,
                }}
              >
                Thank you! Your message has been delivered directly to Umar&apos;s admin dashboard. He will reply shortly.
              </p>
              <button
                onClick={() => setSentSuccess(false)}
                style={{
                  marginTop: '20px',
                  background: 'none',
                  border: '1px solid var(--line-30)',
                  color: 'var(--ink)',
                  padding: '6px 14px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '18px',
                  marginBottom: '4px',
                  color: 'var(--ink)',
                }}
              >
                Direct Client Inquiry
              </div>

              {/* Honeypot — leave empty; hidden from users */}
              <div
                aria-hidden="true"
                style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
              >
                <label htmlFor="contact-company">Company</label>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  style={{
                    background: 'rgba(255, 80, 80, 0.1)',
                    border: '1px solid rgba(255, 80, 80, 0.3)',
                    color: '#ff7b7b',
                    padding: '10px',
                    fontSize: '12px',
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                >
                  {errorMsg}
                </div>
              )}

              <div>
                <label
                  htmlFor="contact-name"
                  style={{
                    display: 'block',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    color: 'var(--ink-55)',
                    marginBottom: '6px',
                  }}
                >
                  YOUR NAME *
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  maxLength={120}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'var(--bg)',
                    border: '1px solid var(--line-30)',
                    color: 'var(--ink)',
                    padding: '10px 14px',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  style={{
                    display: 'block',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    color: 'var(--ink-55)',
                    marginBottom: '6px',
                  }}
                >
                  EMAIL ADDRESS *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'var(--bg)',
                    border: '1px solid var(--line-30)',
                    color: 'var(--ink)',
                    padding: '10px 14px',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  style={{
                    display: 'block',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    color: 'var(--ink-55)',
                    marginBottom: '6px',
                  }}
                >
                  PROJECT / TOPIC
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  maxLength={200}
                  placeholder="e.g. Laravel API, AI integration, full-stack app"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'var(--bg)',
                    border: '1px solid var(--line-30)',
                    color: 'var(--ink)',
                    padding: '10px 14px',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  style={{
                    display: 'block',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    color: 'var(--ink-55)',
                    marginBottom: '6px',
                  }}
                >
                  YOUR MESSAGE *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  maxLength={5000}
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'var(--bg)',
                    border: '1px solid var(--line-30)',
                    color: 'var(--ink)',
                    padding: '10px 14px',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: 'var(--accent)',
                  color: 'var(--accent-ink)',
                  border: 'none',
                  padding: '12px 24px',
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                  marginTop: '8px',
                }}
              >
                {submitting ? 'SENDING INQUIRY...' : 'SEND INQUIRY ↗'}
              </button>
            </form>
          )}
        </div>
      )}

      <div
        style={{
          marginTop: '28px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '12px',
          letterSpacing: '0.1em',
          color: 'var(--ink-55)',
        }}
      >
        USUALLY REPLIES WITHIN 24 HOURS · GMT+5
      </div>
    </section>
  )
}

