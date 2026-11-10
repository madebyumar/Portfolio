import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  Briefcase,
  FileText,
  Inbox,
  ArrowRight,
  PlusCircle,
  PenSquare,
  UserCog,
  Mail,
  Globe2,
  Layers,
  Bot,
} from 'lucide-react'

interface MessageItem {
  id: string
  name: string
  email: string
  subject: string | null
  created_at: string
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch counts in parallel
  const [
    { count: projectsCount },
    { count: blogsCount },
    { count: messagesCount },
    { count: unreadMessagesCount },
    { count: visitsCount },
    { data: recentMessages },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('blogs').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('page_visits').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('id, name, email, subject, created_at').order('created_at', { ascending: false }).limit(3),
  ])

  return (
    <div suppressHydrationWarning style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '32px', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
          Portfolio Dashboard
        </h1>
        <p style={{ margin: 0, fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
          Manage content, track visitor countries and sources, and update the site in real time.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '36px' }}>
        <div style={{ background: '#121210', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Projects
            </span>
            <Briefcase size={16} color="rgba(255, 255, 255, 0.4)" />
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '36px', margin: '8px 0 10px 0', color: '#fff' }}>
            {projectsCount ?? 0}
          </div>
          <Link href="/admin/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11.5px', color: '#d4ff3f', textDecoration: 'none' }}>
            <span>Manage projects</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div style={{ background: '#121210', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Blog Articles
            </span>
            <FileText size={16} color="rgba(255, 255, 255, 0.4)" />
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '36px', margin: '8px 0 10px 0', color: '#fff' }}>
            {blogsCount ?? 0}
          </div>
          <Link href="/admin/blogs" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11.5px', color: '#d4ff3f', textDecoration: 'none' }}>
            <span>Manage blogs</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div style={{ background: '#121210', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Inquiries
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {(unreadMessagesCount ?? 0) > 0 && (
                <span style={{ background: '#d4ff3f', color: '#0e0e0c', fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>
                  {unreadMessagesCount} NEW
                </span>
              )}
              <Inbox size={16} color="rgba(255, 255, 255, 0.4)" />
            </div>
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '36px', margin: '8px 0 10px 0', color: '#fff' }}>
            {messagesCount ?? 0}
          </div>
          <Link href="/admin/messages" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11.5px', color: '#d4ff3f', textDecoration: 'none' }}>
            <span>View messages</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div style={{ background: '#121210', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Visits
            </span>
            <Globe2 size={16} color="rgba(255, 255, 255, 0.4)" />
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '36px', margin: '8px 0 10px 0', color: '#fff' }}>
            {visitsCount ?? 0}
          </div>
          <Link href="/admin/analytics" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11.5px', color: '#d4ff3f', textDecoration: 'none' }}>
            <span>Countries &amp; sources</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Quick Actions */}
        <div style={{ background: '#121210', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '26px' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '18px', margin: '0 0 18px 0' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Link
              href="/admin/projects"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                borderRadius: '6px',
                background: '#181816',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '13.5px'
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(212, 255, 63, 0.1)', color: '#d4ff3f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PlusCircle size={18} />
              </div>
              <span>
                <strong style={{ display: 'block', fontSize: '14px' }}>New Project</strong>
                <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.45)', fontFamily: 'IBM Plex Mono, monospace' }}>Add case study</span>
              </span>
            </Link>

            <Link
              href="/admin/blogs"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                borderRadius: '6px',
                background: '#181816',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '13.5px'
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(212, 255, 63, 0.1)', color: '#d4ff3f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PenSquare size={18} />
              </div>
              <span>
                <strong style={{ display: 'block', fontSize: '14px' }}>Write Blog</strong>
                <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.45)', fontFamily: 'IBM Plex Mono, monospace' }}>Publish article</span>
              </span>
            </Link>

            <Link
              href="/admin/analytics"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                borderRadius: '6px',
                background: '#181816',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '13.5px'
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(212, 255, 63, 0.1)', color: '#d4ff3f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe2 size={18} />
              </div>
              <span>
                <strong style={{ display: 'block', fontSize: '14px' }}>Analytics</strong>
                <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.45)', fontFamily: 'IBM Plex Mono, monospace' }}>Countries &amp; sources</span>
              </span>
            </Link>

            <Link
              href="/admin/services"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                borderRadius: '6px',
                background: '#181816',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '13.5px'
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(212, 255, 63, 0.1)', color: '#d4ff3f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={18} />
              </div>
              <span>
                <strong style={{ display: 'block', fontSize: '14px' }}>Services</strong>
                <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.45)', fontFamily: 'IBM Plex Mono, monospace' }}>What I do section</span>
              </span>
            </Link>

            <Link
              href="/admin/settings"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                borderRadius: '6px',
                background: '#181816',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '13.5px'
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(212, 255, 63, 0.1)', color: '#d4ff3f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCog size={18} />
              </div>
              <span>
                <strong style={{ display: 'block', fontSize: '14px' }}>Edit Profile</strong>
                <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.45)', fontFamily: 'IBM Plex Mono, monospace' }}>Bio &amp; socials</span>
              </span>
            </Link>

            <Link
              href="/admin/messages"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                borderRadius: '6px',
                background: '#181816',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '13.5px'
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(212, 255, 63, 0.1)', color: '#d4ff3f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={18} />
              </div>
              <span>
                <strong style={{ display: 'block', fontSize: '14px' }}>Inbox</strong>
                <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.45)', fontFamily: 'IBM Plex Mono, monospace' }}>Review inquiries</span>
              </span>
            </Link>

            <Link
              href="/admin/chatbot"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                borderRadius: '6px',
                background: '#181816',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '13.5px'
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(212, 255, 63, 0.1)', color: '#d4ff3f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} />
              </div>
              <span>
                <strong style={{ display: 'block', fontSize: '14px' }}>Chatbot</strong>
                <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.45)', fontFamily: 'IBM Plex Mono, monospace' }}>Gemini + Groq assistant</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div style={{ background: '#121210', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '18px', margin: 0 }}>
              Recent Inquiries
            </h2>
            <Link href="/admin/messages" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11.5px', color: '#d4ff3f', textDecoration: 'none' }}>
              <span>View all</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {(!recentMessages || recentMessages.length === 0) ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontFamily: 'IBM Plex Mono, monospace' }}>
              No messages received yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentMessages.map((msg: MessageItem) => (
                <div key={msg.id} style={{ padding: '12px 14px', borderRadius: '6px', background: '#181816', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <strong style={{ fontSize: '13.5px', color: '#fff' }}>{msg.name}</strong>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'IBM Plex Mono, monospace' }}>
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#d4ff3f', fontFamily: 'IBM Plex Mono, monospace', marginTop: '2px' }}>
                    {msg.email} {msg.subject ? `· ${msg.subject}` : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
