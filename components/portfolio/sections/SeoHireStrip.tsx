import Link from 'next/link'

/** Crawlable SEO copy for hire intent — visible, natural, not keyword spam. */
export function SeoHireStrip() {
  return (
    <section
      id="hire-seo"
      aria-label="Hire Umar Shoaib"
      style={{
        padding: '72px 40px 0',
        boxSizing: 'border-box',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      <h2
        style={{
          margin: '0 0 18px',
          fontFamily: 'var(--font-display), sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(28px, 4vw, 44px)',
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
        }}
      >
        Hire a full-stack &amp; AI software engineer
      </h2>
      <p
        style={{
          margin: '0 0 16px',
          fontSize: '16px',
          lineHeight: 1.75,
          color: 'var(--ink-80)',
          maxWidth: '720px',
        }}
      >
        Looking to <strong>hire a developer</strong> for web development, app backends, or AI features?
        I&apos;m <strong>Umar Shoaib</strong> — a freelance <strong>full stack developer</strong> and{' '}
        <strong>AI engineer</strong> available for remote projects worldwide. Stacks I ship with:
        Laravel, MERN, Python, OpenAI, and computer vision.
      </p>
      <p
        style={{
          margin: '0 0 28px',
          fontSize: '15px',
          lineHeight: 1.7,
          color: 'var(--ink-72)',
          maxWidth: '720px',
        }}
      >
        Common searches I serve: hire Laravel developer, hire MERN developer, hire backend developer,
        hire AI engineer Pakistan, freelance software engineer for hire, and hire web / app developer
        for production APIs and platforms.
      </p>
      <Link
        href="/hire"
        style={{
          display: 'inline-block',
          background: 'var(--accent)',
          color: 'var(--accent-ink)',
          padding: '12px 22px',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '13px',
          letterSpacing: '0.06em',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        HIRE ME — VIEW SERVICES ↗
      </Link>
    </section>
  )
}
