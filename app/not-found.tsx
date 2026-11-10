import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      id="main-content"
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '40px',
        background: 'var(--bg)',
        color: 'var(--ink)',
        textAlign: 'center',
      }}
    >
      <div>
        <p
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '13px',
            letterSpacing: '0.12em',
            color: 'var(--accent)',
            marginBottom: '18px',
          }}
        >
          404 · NOT FOUND
        </p>
        <h1
          style={{
            margin: '0 0 18px',
            fontFamily: 'var(--font-display), sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(40px, 8vw, 72px)',
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
          }}
        >
          Lost the thread
          <span style={{ color: 'var(--accent)' }}>.</span>
        </h1>
        <p style={{ color: 'var(--ink-65)', marginBottom: '32px', maxWidth: '420px' }}>
          That page doesn&apos;t exist — or it moved. Head home or browse the work.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              background: 'var(--accent)',
              color: 'var(--accent-ink)',
              padding: '12px 20px',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '13px',
            }}
          >
            HOME
          </Link>
          <Link
            href="/blog"
            style={{
              border: '1px solid var(--line-30)',
              color: 'var(--ink)',
              padding: '12px 20px',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '13px',
            }}
          >
            BLOG
          </Link>
        </div>
      </div>
    </main>
  )
}
