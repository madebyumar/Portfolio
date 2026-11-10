'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { MessageCircle, Send, X, Bot, Loader2 } from 'lucide-react'
import type { PublicChatbotConfig } from '@/lib/chatbot/types'

interface UiMessage {
  role: 'user' | 'assistant'
  content: string
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'portfolio-chat-session'
  const existing = window.localStorage.getItem(key)
  if (existing) return existing
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  window.localStorage.setItem(key, id)
  return id
}

export function ChatWidget() {
  const pathname = usePathname()
  const [config, setConfig] = useState<PublicChatbotConfig | null>(null)
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<UiMessage[]>([])
  const listRef = useRef<HTMLDivElement>(null)
  const sessionId = useMemo(() => getOrCreateSessionId(), [])

  const hideOnAdmin = pathname?.startsWith('/admin')

  useEffect(() => {
    if (hideOnAdmin) return
    let cancelled = false

    async function loadConfig() {
      try {
        const res = await fetch('/api/chat/config')
        if (!res.ok) return
        const data = (await res.json()) as PublicChatbotConfig
        if (!cancelled) setConfig(data)
      } catch {
        // Widget stays hidden if config fails
      }
    }

    void loadConfig()
    return () => {
      cancelled = true
    }
  }, [hideOnAdmin])

  useEffect(() => {
    if (!config?.welcomeMessage || messages.length > 0) return
    setMessages([{ role: 'assistant', content: config.welcomeMessage }])
  }, [config, messages.length])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, busy, open])

  if (hideOnAdmin || !config?.enabled) return null

  const sendMessage = async (raw: string) => {
    const text = raw.trim()
    if (!text || busy) return

    const nextMessages: UiMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setBusy(true)
    setError(null)

    try {
      const history = nextMessages
        .filter((m) => !(m.role === 'assistant' && m.content === config.welcomeMessage))
        .map((m) => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          sessionId,
          conversationId,
        }),
      })

      const data = (await res.json()) as {
        reply?: string
        conversationId?: string
        error?: string
      }

      if (!res.ok || !data.reply) {
        throw new Error(data.error || 'Chat failed')
      }

      if (data.conversationId) setConversationId(data.conversationId)
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply as string }])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to reply right now.'
      setError(message)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry — I hit a snag. Please try again or use the contact form.',
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={() => setOpen((v) => !v)}
        className="chat-fab"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="chat-panel" role="dialog" aria-label={config.widgetTitle}>
          <div className="chat-panel__header">
            <div className="chat-panel__title">
              <Bot size={16} />
              <span>{config.widgetTitle}</span>
            </div>
            <button type="button" className="chat-panel__close" onClick={() => setOpen(false)} aria-label="Close">
              <X size={16} />
            </button>
          </div>

          <div className="chat-panel__messages" ref={listRef}>
            {messages.map((msg, idx) => (
              <div
                key={`${msg.role}-${idx}`}
                className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble--user' : 'chat-bubble--bot'}`}
              >
                {msg.content}
              </div>
            ))}
            {busy && (
              <div className="chat-bubble chat-bubble--bot chat-bubble--typing">
                <Loader2 size={14} className="chat-spin" />
                Thinking…
              </div>
            )}
          </div>

          {config.suggestedQuestions?.length > 0 && messages.length <= 1 && (
            <div className="chat-suggestions">
              {config.suggestedQuestions.map((q) => (
                <button key={q} type="button" onClick={() => void sendMessage(q)} disabled={busy}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {error && <div className="chat-error">{error}</div>}

          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault()
              void sendMessage(input)
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={config.placeholder}
              maxLength={2000}
              disabled={busy}
              aria-label="Chat message"
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send message">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
