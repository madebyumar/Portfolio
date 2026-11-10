'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main
      id="main-content"
      style={{
        minHeight: '70vh',
        display: 'grid',
        placeItems: 'center',
        padding: '40px',
        textAlign: 'center',
        background: 'var(--bg)',
        color: 'var(--ink)',
      }}
    >
      <div>
        <p
          style={{
            fontFamily: 'var(--font-mono), monospace',
            color: 'var(--accent)',
            letterSpacing: '0.1em',
            fontSize: '13px',
          }}
        >
          SOMETHING WENT WRONG
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display), sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(32px, 6vw, 56px)',
            margin: '16px 0',
          }}
        >
          Temporary glitch
        </h1>
        <p style={{ color: 'var(--ink-65)', marginBottom: '24px' }}>
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            border: 'none',
            padding: '12px 22px',
            fontFamily: 'var(--font-mono), monospace',
            cursor: 'pointer',
          }}
        >
          TRY AGAIN
        </button>
      </div>
    </main>
  )
}
