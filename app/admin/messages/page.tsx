'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, MailOpen, Trash2, ExternalLink, Inbox } from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const supabase = useMemo(() => createClient(), [])

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setMessages(data)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    const timer = setTimeout(() => { void fetchMessages() }, 0)
    return () => clearTimeout(timer)
  }, [fetchMessages])

  const markReadStatus = async (msg: ContactMessage, is_read: boolean) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read })
      .eq('id', msg.id)

    if (!error) {
      setMessages(messages.map(m => m.id === msg.id ? { ...m, is_read } : m))
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, is_read })
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return
    const { error } = await supabase.from('contact_messages').delete().eq('id', id)
    if (!error) {
      setMessages(messages.filter(m => m.id !== id))
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
    }
  }

  const openMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg)
    if (!msg.is_read) {
      markReadStatus(msg, true)
    }
  }

  const displayedMessages = filter === 'unread' ? messages.filter(m => !m.is_read) : messages

  return (
    <div suppressHydrationWarning style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Client Inquiries &amp; Messages
          </h1>
          <p style={{ margin: 0, fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
            Real-time messages submitted by visitors and prospective clients.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              background: filter === 'all' ? '#d4ff3f' : 'transparent',
              color: filter === 'all' ? '#0e0e0c' : '#fff',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '6px 14px',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'IBM Plex Mono, monospace',
              cursor: 'pointer'
            }}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            style={{
              background: filter === 'unread' ? '#d4ff3f' : 'transparent',
              color: filter === 'unread' ? '#0e0e0c' : '#fff',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '6px 14px',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'IBM Plex Mono, monospace',
              cursor: 'pointer'
            }}
          >
            Unread ({messages.filter(m => !m.is_read).length})
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: 'IBM Plex Mono, monospace' }}>
          Loading messages from Supabase...
        </div>
      ) : displayedMessages.length === 0 ? (
        <div style={{ background: '#121210', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: 'rgba(255,255,255,0.3)' }}>
            <Inbox size={36} />
          </div>
          <p style={{ margin: 0, fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            {filter === 'unread' ? 'No unread messages.' : 'Your inbox is empty. Inbound messages from the website will appear here.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedMessage ? '1fr 1.2fr' : '1fr', gap: '20px' }}>
          {/* Messages List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {displayedMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id
              return (
                <div
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  style={{
                    background: isSelected ? '#1c1c18' : '#121210',
                    border: `1px solid ${isSelected ? '#d4ff3f' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '8px',
                    padding: '16px 20px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, background 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {msg.is_read ? (
                        <MailOpen size={14} color="rgba(255,255,255,0.35)" />
                      ) : (
                        <Mail size={14} color="#d4ff3f" />
                      )}
                      <strong style={{ fontSize: '14.5px', color: '#fff' }}>{msg.name}</strong>
                    </div>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'IBM Plex Mono, monospace' }}>
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#d4ff3f', fontFamily: 'IBM Plex Mono, monospace', marginBottom: '6px' }}>
                    {msg.email}
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {msg.subject ? `${msg.subject} — ` : ''}{msg.message}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Message Detail View */}
          {selectedMessage && (
            <div style={{ background: '#141412', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '22px', margin: '0 0 6px 0' }}>
                    {selectedMessage.name}
                  </h2>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#d4ff3f' }}>
                    {selectedMessage.email}
                  </div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                    Received on {new Date(selectedMessage.created_at).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => markReadStatus(selectedMessage, !selectedMessage.is_read)}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '11.5px',
                      fontFamily: 'IBM Plex Mono, monospace',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {selectedMessage.is_read ? <Mail size={12} /> : <MailOpen size={12} />}
                    <span>{selectedMessage.is_read ? 'Mark Unread' : 'Mark Read'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,80,80,0.3)',
                      color: '#ff7b7b',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '11.5px',
                      fontFamily: 'IBM Plex Mono, monospace',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {selectedMessage.subject && (
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.4)', display: 'block', textTransform: 'uppercase' }}>
                    Subject
                  </span>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginTop: '4px' }}>
                    {selectedMessage.subject}
                  </div>
                </div>
              )}

              <div style={{ flex: 1, marginBottom: '24px' }}>
                <span style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.4)', display: 'block', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Message Content
                </span>
                <div style={{ fontSize: '14.5px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', background: '#0e0e0c', padding: '18px', borderRadius: '6px', whiteSpace: 'pre-wrap' }}>
                  {selectedMessage.message}
                </div>
              </div>

              <div>
                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(selectedMessage.subject ? `Re: ${selectedMessage.subject}` : 'Re: Inquiring about your software engineering services')}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#d4ff3f',
                    color: '#0e0e0c',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    fontFamily: 'Syne, sans-serif'
                  }}
                >
                  <span>Reply via Email</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
