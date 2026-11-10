'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Lock, Mail, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMsg(error.message)
        setLoading(false)
        return
      }

      if (data.session) {
        const check = await fetch('/api/admin/check')
        if (!check.ok) {
          await supabase.auth.signOut()
          setErrorMsg('This account is not authorized for admin access.')
          setLoading(false)
          return
        }

        router.push('/admin')
        router.refresh()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setErrorMsg(message)
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#090908',
      color: '#f5f5f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#121210',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#d4ff3f',
              boxShadow: '0 0 10px #d4ff3f'
            }} />
            <h1 style={{
              margin: 0,
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '26px',
              letterSpacing: '-0.02em'
            }}>
              UMAR<span style={{ color: '#d4ff3f' }}>.</span>
            </h1>
          </div>
          <p style={{
            margin: 0,
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '12.5px',
            color: 'rgba(255, 255, 255, 0.55)',
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <ShieldCheck size={14} color="#d4ff3f" />
            <span>ADMIN AUTHENTICATION</span>
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(255, 80, 80, 0.12)',
            border: '1px solid rgba(255, 80, 80, 0.3)',
            color: '#ff8585',
            padding: '12px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            marginBottom: '20px',
            lineHeight: 1.4,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="admin-email" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11.5px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '8px',
              letterSpacing: '0.05em'
            }}>
              <Mail size={12} />
              <span>EMAIL ADDRESS</span>
            </label>
            <input
              id="admin-email"
              name="email"
              autoComplete="username"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@umarshoaib.com"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: '#090908',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                padding: '12px 14px',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => (e.target.style.borderColor = '#d4ff3f')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
            />
          </div>

          <div>
            <label htmlFor="admin-password" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11.5px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '8px',
              letterSpacing: '0.05em'
            }}>
              <Lock size={12} />
              <span>PASSWORD</span>
            </label>
            <input
              id="admin-password"
              name="password"
              autoComplete="current-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: '#090908',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                padding: '12px 14px',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => (e.target.style.borderColor = '#d4ff3f')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              background: '#d4ff3f',
              color: '#0e0e0c',
              border: 'none',
              padding: '14px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'Syne, sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
              opacity: loading ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.opacity = '0.9'
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.opacity = '1'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.45)',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#d4ff3f')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)')}
          >
            <ArrowLeft size={13} />
            <span>Back to Public Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
