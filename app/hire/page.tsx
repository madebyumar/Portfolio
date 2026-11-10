import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/portfolio/shared/Navbar'
import { Footer } from '@/components/portfolio/shared/Footer'
import { getLiveProfile } from '@/lib/data/portfolio'
import { SEO_KEYWORDS } from '@/lib/seo/keywords'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Hire a Full-Stack & AI Developer',
  description:
    'Hire Umar Shoaib for full-stack web development, Laravel/MERN apps, APIs, and AI engineering (OpenAI, computer vision). Freelance software engineer available worldwide.',
  keywords: [
    'hire a developer',
    'hire full stack developer',
    'hire AI engineer',
    'hire Laravel developer',
    'hire MERN developer',
    'hire software engineer Pakistan',
    'hire web developer',
    'hire app developer',
    'freelance developer for hire',
    ...SEO_KEYWORDS.slice(0, 12),
  ],
  alternates: { canonical: '/hire' },
  openGraph: {
    title: 'Hire Umar Shoaib — Full-Stack & AI Software Engineer',
    description:
      'Freelance full-stack and AI engineer for hire. Web apps, APIs, Laravel, MERN, OpenAI.',
    url: '/hire',
  },
}

const SERVICES = [
  {
    title: 'Hire a full-stack developer',
    body: 'End-to-end web apps: database, APIs, and React frontends. Ideal if you need one engineer who owns delivery.',
  },
  {
    title: 'Hire an AI engineer',
    body: 'OpenAI integrations, chatbots, computer vision (YOLO), and production ML features wired into real products.',
  },
  {
    title: 'Hire a Laravel / backend developer',
    body: 'Secure REST APIs, auth, queues, and performance work in Laravel, Node.js, and Python.',
  },
  {
    title: 'Hire for web & app development',
    body: 'SaaS dashboards, dealer platforms, mobile backends, and custom systems for UK, US, UAE, and remote teams.',
  },
]

export default async function HirePage() {
  const profile = await getLiveProfile()
  const email = profile?.email || 'contact@umarshoaib.com'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Navbar name={profile?.name} timezone={profile?.timezone} ianaTimezone={profile?.ianaTimezone} />

      <main id="main-content" style={{ maxWidth: '960px', margin: '0 auto', padding: '140px 40px 80px' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '12px',
            letterSpacing: '0.12em',
            color: 'var(--accent)',
            marginBottom: '20px',
          }}
        >
          HIRE · FREELANCE · REMOTE WORLDWIDE
        </p>

        <h1
          style={{
            margin: '0 0 24px',
            fontFamily: 'var(--font-display), sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(40px, 7vw, 72px)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          }}
        >
          Hire Umar Shoaib
          <span style={{ color: 'var(--accent)' }}>.</span>
        </h1>

        <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'var(--ink-80)', maxWidth: '640px', marginBottom: '40px' }}>
          Need to <strong>hire a software engineer</strong>, <strong>full stack developer</strong>, or{' '}
          <strong>AI engineer</strong>? I help founders and teams ship production web apps, APIs, and AI
          features — Laravel, MERN, Python, OpenAI, and computer vision.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '64px' }}>
          <a
            href={`mailto:${email}?subject=${encodeURIComponent('Hire inquiry — project brief')}`}
            style={{
              background: 'var(--accent)',
              color: 'var(--accent-ink)',
              padding: '14px 22px',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '13px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            EMAIL TO HIRE ↗
          </a>
          <Link
            href="/#contact"
            style={{
              border: '1px solid var(--line-30)',
              color: 'var(--ink)',
              padding: '14px 22px',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '13px',
              textDecoration: 'none',
            }}
          >
            LEAVE A MESSAGE
          </Link>
          <Link
            href="/#projects"
            style={{
              border: '1px solid var(--line-30)',
              color: 'var(--ink)',
              padding: '14px 22px',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '13px',
              textDecoration: 'none',
            }}
          >
            SEE WORK
          </Link>
        </div>

        <div style={{ borderTop: '1px solid var(--line)' }}>
          {SERVICES.map((s) => (
            <article
              key={s.title}
              style={{
                padding: '32px 0',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <h2
                style={{
                  margin: '0 0 12px',
                  fontFamily: 'var(--font-display), sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(22px, 3vw, 30px)',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                }}
              >
                {s.title}
              </h2>
              <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.7, color: 'var(--ink-80)', maxWidth: '680px' }}>
                {s.body}
              </p>
            </article>
          ))}
        </div>

        <section style={{ marginTop: '56px' }}>
          <h2
            style={{
              margin: '0 0 16px',
              fontFamily: 'var(--font-display), sans-serif',
              fontWeight: 800,
              fontSize: '28px',
              textTransform: 'uppercase',
            }}
          >
            Why clients hire me
          </h2>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--ink-80)', lineHeight: 1.8, fontSize: '16px' }}>
            <li>Production focus — APIs and AI that hold up after launch</li>
            <li>Clear async communication for UK, US, UAE, and remote teams</li>
            <li>Stack depth: Laravel, Node, React/MERN, Python, OpenAI, YOLO</li>
            <li>Based in Gujranwala, Pakistan · available for freelance worldwide</li>
          </ul>
        </section>
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
