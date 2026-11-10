'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Inbox,
  Zap,
  Clock,
  MessageSquareQuote,
  Settings,
  ExternalLink,
  LogOut,
  Database,
  Globe2,
  Layers,
  Bot,
  Palette,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analytics', icon: Globe2 },
  { href: '/admin/appearance', label: 'Appearance', icon: Palette },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/services', label: 'Services', icon: Layers },
  { href: '/admin/messages', label: 'Inquiries', icon: Inbox },
  { href: '/admin/chatbot', label: 'Chatbot', icon: Bot },
  { href: '/admin/skills', label: 'Skills', icon: Zap },
  { href: '/admin/experience', label: 'Experience', icon: Clock },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const supabase = createClient()

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) return

    async function checkAuthAndStats() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || 'Admin')
      }

      // Fetch unread messages count
      const { count } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
      
      setUnreadCount(count || 0)
    }

    checkAuthAndStats()
  }, [pathname, isLoginPage, supabase])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div suppressHydrationWarning style={{ minHeight: '100vh', background: '#0a0a08', color: '#f5f5f0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Top Header */}
      <header className="admin-header" suppressHydrationWarning style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(12, 12, 10, 0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff' }}>
            <span style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#d4ff3f',
              boxShadow: '0 0 10px #d4ff3f'
            }} />
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.02em' }}>
              UMAR<span style={{ color: '#d4ff3f' }}>.</span>
            </span>
            <span style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.12em',
              background: 'rgba(212, 255, 63, 0.12)',
              color: '#d4ff3f',
              padding: '2px 8px',
              borderRadius: '4px',
              marginLeft: '4px'
            }}>
              ADMIN
            </span>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link 
            href="/" 
            target="_blank"
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.65)',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'
            }}
          >
            <span>Live Site</span>
            <ExternalLink size={13} />
          </Link>

          {userEmail && (
            <span style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              paddingLeft: '16px'
            }}>
              {userEmail}
            </span>
          )}

          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 80, 80, 0.3)',
              color: '#ff6b6b',
              padding: '6px 14px',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'IBM Plex Mono, monospace',
              cursor: isSigningOut ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 80, 80, 0.1)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <LogOut size={13} />
            <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="admin-shell" suppressHydrationWarning style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 61px)' }}>
        {/* Sidebar Nav */}
        <aside className="admin-sidebar" suppressHydrationWarning style={{
          background: '#0d0d0b',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '10.5px',
            color: 'rgba(255, 255, 255, 0.35)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '0 12px 10px',
            marginBottom: '4px'
          }}>
            Navigation
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            const isMessages = item.href === '/admin/messages'
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#0e0e0c' : 'rgba(255, 255, 255, 0.72)',
                  background: isActive ? '#d4ff3f' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.color = '#fff'
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'
                  }
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span>{item.label}</span>
                </span>
                {isMessages && unreadCount > 0 && (
                  <span style={{
                    background: isActive ? '#0e0e0c' : '#d4ff3f',
                    color: isActive ? '#d4ff3f' : '#0e0e0c',
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'IBM Plex Mono, monospace',
                    padding: '2px 7px',
                    borderRadius: '10px'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </Link>
            )
          })}

          <div style={{ marginTop: 'auto', padding: '16px 12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)' }}>
              <Database size={12} />
              <span>Connected to:</span>
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#d4ff3f', marginTop: '4px', wordBreak: 'break-all' }}>
              Supabase Postgres
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="admin-content" suppressHydrationWarning style={{ padding: '36px 44px', background: '#0a0a08', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
