'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  asChatbotSettings,
  DEFAULT_CHATBOT_SETTINGS,
  type ChatProvider,
  type ChatbotSettings,
} from '@/lib/chatbot/types'
import {
  Bot,
  Save,
  CheckCircle2,
  AlertCircle,
  MessagesSquare,
  Trash2,
  Power,
  KeyRound,
  RefreshCw,
} from 'lucide-react'

interface ConversationRow {
  id: string
  session_id: string
  visitor_ip: string | null
  message_count: number
  last_provider: string | null
  created_at: string
  updated_at: string
}

interface MessageRow {
  id: string
  role: 'user' | 'assistant'
  content: string
  provider: string | null
  created_at: string
}

type Tab = 'settings' | 'conversations'

interface EditableApiKey {
  id: string
  label: string
  keyInput: string
  keyMasked: string
  hasKey: boolean
  enabled: boolean
  isNew?: boolean
}

interface KeyStatus {
  geminiConfigured: boolean
  groqConfigured: boolean
  geminiCount: number
  groqCount: number
  geminiAdminCount: number
  groqAdminCount: number
  geminiEnvCount: number
  groqEnvCount: number
}

function newEditableKey(labelPrefix: string): EditableApiKey {
  return {
    id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: labelPrefix,
    keyInput: '',
    keyMasked: '',
    hasKey: false,
    enabled: true,
    isNew: true,
  }
}

export default function AdminChatbotPage() {
  const [tab, setTab] = useState<Tab>('settings')
  const [settings, setSettings] = useState<ChatbotSettings>({ ...DEFAULT_CHATBOT_SETTINGS })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingKeys, setSavingKeys] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [keyStatus, setKeyStatus] = useState<KeyStatus | null>(null)
  const [geminiKeys, setGeminiKeys] = useState<EditableApiKey[]>([])
  const [groqKeys, setGroqKeys] = useState<EditableApiKey[]>([])

  const [conversations, setConversations] = useState<ConversationRow[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [loadingChats, setLoadingChats] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  const mapMaskedKeys = (
    list: Array<{ id: string; label: string; keyMasked: string; enabled: boolean; hasKey: boolean }> | undefined,
    fallbackLabel: string
  ): EditableApiKey[] => {
    if (!list || list.length === 0) return []
    return list.map((item, index) => ({
      id: item.id,
      label: item.label || `${fallbackLabel} ${index + 1}`,
      keyInput: '',
      keyMasked: item.keyMasked,
      hasKey: item.hasKey,
      enabled: item.enabled,
    }))
  }

  const loadSettings = useCallback(async () => {
    setLoading(true)
    const [{ data }, statusRes, keysRes] = await Promise.all([
      supabase.from('site_settings').select('value').eq('key', 'chatbot').single(),
      fetch('/api/admin/chatbot/status').then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch('/api/admin/chatbot/keys').then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ])

    if (data?.value) setSettings(asChatbotSettings(data.value))
    if (statusRes) setKeyStatus(statusRes as KeyStatus)
    if (keysRes?.keys) {
      setGeminiKeys(mapMaskedKeys(keysRes.keys.gemini, 'Gemini'))
      setGroqKeys(mapMaskedKeys(keysRes.keys.groq, 'Groq'))
    }
    setLoading(false)
  }, [supabase])

  const loadConversations = useCallback(async () => {
    setLoadingChats(true)
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('id, session_id, visitor_ip, message_count, last_provider, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(100)

    if (!error && data) setConversations(data as ConversationRow[])
    setLoadingChats(false)
  }, [supabase])

  useEffect(() => {
    void loadSettings()
  }, [loadSettings])

  useEffect(() => {
    if (tab === 'conversations') void loadConversations()
  }, [tab, loadConversations])

  const openConversation = async (id: string) => {
    setSelectedId(id)
    const { data } = await supabase
      .from('chat_messages')
      .select('id, role, content, provider, created_at')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })

    setMessages((data as MessageRow[]) || [])
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const cleaned: ChatbotSettings = {
      ...settings,
      suggestedQuestions: settings.suggestedQuestions
        .map((q) => q.trim())
        .filter(Boolean)
        .slice(0, 6),
    }

    const { error } = await supabase.from('site_settings').upsert(
      {
        key: 'chatbot',
        value: cleaned,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )

    if (error) {
      setMessage({ text: error.message, type: 'error' })
    } else {
      setSettings(cleaned)
      setMessage({ text: 'Chatbot settings saved.', type: 'success' })
    }
    setSaving(false)
  }

  const handleDeleteConversation = async (id: string) => {
    if (!confirm('Delete this conversation and all messages?')) return
    const { error } = await supabase.from('chat_conversations').delete().eq('id', id)
    if (!error) {
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (selectedId === id) {
        setSelectedId(null)
        setMessages([])
      }
    }
  }

  const updateSuggested = (index: number, value: string) => {
    const next = [...settings.suggestedQuestions]
    next[index] = value
    setSettings({ ...settings, suggestedQuestions: next })
  }

  const addSuggested = () => {
    if (settings.suggestedQuestions.length >= 6) return
    setSettings({ ...settings, suggestedQuestions: [...settings.suggestedQuestions, ''] })
  }

  const removeSuggested = (index: number) => {
    setSettings({
      ...settings,
      suggestedQuestions: settings.suggestedQuestions.filter((_, i) => i !== index),
    })
  }

  const setProvider = (primaryProvider: ChatProvider) => {
    setSettings({ ...settings, primaryProvider })
  }

  const updateKeyRow = (
    provider: 'gemini' | 'groq',
    id: string,
    patch: Partial<EditableApiKey>
  ) => {
    const setter = provider === 'gemini' ? setGeminiKeys : setGroqKeys
    setter((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)))
  }

  const removeKeyRow = (provider: 'gemini' | 'groq', id: string) => {
    const setter = provider === 'gemini' ? setGeminiKeys : setGroqKeys
    setter((prev) => prev.filter((row) => row.id !== id))
  }

  const addKeyRow = (provider: 'gemini' | 'groq') => {
    const setter = provider === 'gemini' ? setGeminiKeys : setGroqKeys
    const label = provider === 'gemini' ? 'Gemini' : 'Groq'
    setter((prev) => {
      if (prev.length >= 20) return prev
      return [...prev, newEditableKey(`${label} ${prev.length + 1}`)]
    })
  }

  const handleSaveKeys = async () => {
    setSavingKeys(true)
    setMessage(null)

    const serialize = (rows: EditableApiKey[]) =>
      rows.map((row) => ({
        id: row.isNew ? undefined : row.id,
        label: row.label,
        enabled: row.enabled,
        key: row.keyInput.trim() || undefined,
        clear: row.isNew ? true : undefined,
      }))

    try {
      const res = await fetch('/api/admin/chatbot/keys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gemini: serialize(geminiKeys),
          groq: serialize(groqKeys),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage({ text: data.error || 'Unable to save API keys', type: 'error' })
      } else {
        setGeminiKeys(mapMaskedKeys(data.keys?.gemini, 'Gemini'))
        setGroqKeys(mapMaskedKeys(data.keys?.groq, 'Groq'))
        const statusRes = await fetch('/api/admin/chatbot/status').then((r) => (r.ok ? r.json() : null))
        if (statusRes) setKeyStatus(statusRes as KeyStatus)
        setMessage({
          text: 'API keys saved. Chatbot will rotate through them automatically on failures.',
          type: 'success',
        })
      }
    } catch {
      setMessage({ text: 'Unable to save API keys', type: 'error' })
    }
    setSavingKeys(false)
  }

  return (
    <div suppressHydrationWarning style={{ maxWidth: '980px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          Chatbot
        </h1>
        <p style={{ margin: 0, fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
          Control the public assistant, providers, prompts, and review conversations.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(
          [
            { id: 'settings' as const, label: 'Settings', icon: Bot },
            { id: 'conversations' as const, label: 'Conversations', icon: MessagesSquare },
          ] as const
        ).map((item) => {
          const active = tab === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              style={{
                background: active ? '#d4ff3f' : 'transparent',
                color: active ? '#0e0e0c' : 'rgba(255,255,255,0.7)',
                border: active ? 'none' : '1px solid rgba(255,255,255,0.12)',
                padding: '8px 14px',
                borderRadius: '6px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: active ? 700 : 400,
              }}
            >
              <Icon size={14} />
              {item.label}
            </button>
          )
        })}
      </div>

      {message && (
        <div
          style={{
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 80, 80, 0.12)',
            border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 80, 80, 0.3)'}`,
            color: message.type === 'success' ? '#4ade80' : '#ff7b7b',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '13.5px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      {tab === 'settings' && (
        loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: 'IBM Plex Mono, monospace' }}>
            Loading chatbot settings…
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <section style={cardStyle}>
              <div style={sectionHead}>
                <Power size={16} color="#d4ff3f" />
                <h2 style={sectionTitle}>Availability</h2>
              </div>
              <label style={toggleRow}>
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                />
                <span>Show chatbot widget on the public site</span>
              </label>
            </section>

            <section style={cardStyle}>
              <div style={sectionHead}>
                <KeyRound size={16} color="#d4ff3f" />
                <h2 style={sectionTitle}>API keys (multi-key fallback)</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <StatusPill
                  label="Gemini"
                  ok={Boolean(keyStatus?.geminiConfigured)}
                  hint={`${keyStatus?.geminiCount ?? 0} active · admin ${keyStatus?.geminiAdminCount ?? 0} · env ${keyStatus?.geminiEnvCount ?? 0}`}
                />
                <StatusPill
                  label="Groq"
                  ok={Boolean(keyStatus?.groqConfigured)}
                  hint={`${keyStatus?.groqCount ?? 0} active · admin ${keyStatus?.groqAdminCount ?? 0} · env ${keyStatus?.groqEnvCount ?? 0}`}
                />
              </div>
              <p style={{ margin: '0 0 16px', fontSize: '12.5px', color: 'rgba(255,255,255,0.45)', fontFamily: 'IBM Plex Mono, monospace', lineHeight: 1.5 }}>
                Add up to 20 Gemini and 20 Groq keys here. If one key hits a rate limit or fails, the next key is tried, then the other provider.
                Keys are encrypted at rest. Leave a key field blank to keep the existing secret.
                Google AI Studio keys are supported in both formats: legacy AIza… and new AQ.… authorization keys.
                If an AQ. key is rejected by Google (invalid / not provisioned), create a fresh key in AI Studio or add a free Groq key from console.groq.com as backup.
              </p>

              <KeyListEditor
                title="Gemini API keys"
                rows={geminiKeys}
                onChange={(id, patch) => updateKeyRow('gemini', id, patch)}
                onRemove={(id) => removeKeyRow('gemini', id)}
                onAdd={() => addKeyRow('gemini')}
                placeholder="AIza… or AQ.…"
              />
              <div style={{ height: '16px' }} />
              <KeyListEditor
                title="Groq API keys"
                rows={groqKeys}
                onChange={(id, patch) => updateKeyRow('groq', id, patch)}
                onRemove={(id) => removeKeyRow('groq', id)}
                onAdd={() => addKeyRow('groq')}
                placeholder="gsk_..."
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" onClick={() => void handleSaveKeys()} disabled={savingKeys} style={primaryBtn}>
                  <Save size={16} />
                  <span>{savingKeys ? 'Saving keys…' : 'Save API keys'}</span>
                </button>
              </div>
            </section>

            <section style={cardStyle}>
              <div style={sectionHead}>
                <Bot size={16} color="#d4ff3f" />
                <h2 style={sectionTitle}>Provider routing</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>PRIMARY PROVIDER</label>
                  <select
                    value={settings.primaryProvider}
                    onChange={(e) => setProvider(e.target.value as ChatProvider)}
                    style={inputStyle}
                  >
                    <option value="gemini">Gemini (recommended)</option>
                    <option value="groq">Groq</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>PROVIDER FALLBACK</label>
                  <label style={{ ...toggleRow, marginTop: '10px' }}>
                    <input
                      type="checkbox"
                      checked={settings.fallbackEnabled}
                      onChange={(e) => setSettings({ ...settings, fallbackEnabled: e.target.checked })}
                    />
                    <span>Switch provider after all its keys fail</span>
                  </label>
                </div>
                <div>
                  <label style={labelStyle}>GEMINI MODEL</label>
                  <input
                    value={settings.geminiModel}
                    onChange={(e) => setSettings({ ...settings, geminiModel: e.target.value })}
                    style={inputStyle}
                    placeholder="gemini-3.6-flash"
                  />
                </div>
                <div>
                  <label style={labelStyle}>GROQ MODEL</label>
                  <input
                    value={settings.groqModel}
                    onChange={(e) => setSettings({ ...settings, groqModel: e.target.value })}
                    style={inputStyle}
                    placeholder="llama-3.3-70b-versatile"
                  />
                </div>
                <div>
                  <label style={labelStyle}>MAX HISTORY MESSAGES</label>
                  <input
                    type="number"
                    min={4}
                    max={24}
                    value={settings.maxHistoryMessages}
                    onChange={(e) =>
                      setSettings({ ...settings, maxHistoryMessages: Number(e.target.value) || 12 })
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>RATE LIMIT / MINUTE / IP</label>
                  <input
                    type="number"
                    min={3}
                    max={60}
                    value={settings.rateLimitPerMinute}
                    onChange={(e) =>
                      setSettings({ ...settings, rateLimitPerMinute: Number(e.target.value) || 10 })
                    }
                    style={inputStyle}
                  />
                </div>
              </div>
            </section>

            <section style={cardStyle}>
              <div style={sectionHead}>
                <Bot size={16} color="#d4ff3f" />
                <h2 style={sectionTitle}>Widget copy</h2>
              </div>
              <div style={{ display: 'grid', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>WIDGET TITLE</label>
                  <input
                    value={settings.widgetTitle}
                    onChange={(e) => setSettings({ ...settings, widgetTitle: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>WELCOME MESSAGE</label>
                  <textarea
                    rows={3}
                    value={settings.welcomeMessage}
                    onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>INPUT PLACEHOLDER</label>
                  <input
                    value={settings.placeholder}
                    onChange={(e) => setSettings({ ...settings, placeholder: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>SUGGESTED QUESTIONS</label>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {settings.suggestedQuestions.map((q, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                        <input
                          value={q}
                          onChange={(e) => updateSuggested(idx, e.target.value)}
                          style={inputStyle}
                        />
                        <button type="button" onClick={() => removeSuggested(idx)} style={ghostBtn}>
                          Remove
                        </button>
                      </div>
                    ))}
                    {settings.suggestedQuestions.length < 6 && (
                      <button type="button" onClick={addSuggested} style={ghostBtn}>
                        + Add suggestion
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section style={cardStyle}>
              <div style={sectionHead}>
                <MessagesSquare size={16} color="#d4ff3f" />
                <h2 style={sectionTitle}>System prompt</h2>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: '12.5px', color: 'rgba(255,255,255,0.45)' }}>
                Live portfolio data (profile, projects, skills, services, experience) is appended automatically on every reply.
              </p>
              <textarea
                rows={8}
                value={settings.systemPrompt}
                onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
                style={inputStyle}
              />
            </section>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={saving} style={primaryBtn}>
                <Save size={16} />
                <span>{saving ? 'Saving…' : 'Save chatbot settings'}</span>
              </button>
            </div>
          </form>
        )
      )}

      {tab === 'conversations' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '16px', minHeight: '520px' }}>
          <div style={{ ...cardStyle, padding: '12px', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
                RECENT CHATS
              </span>
              <button type="button" onClick={() => void loadConversations()} style={{ ...ghostBtn, padding: '4px 8px' }}>
                <RefreshCw size={12} />
              </button>
            </div>
            {loadingChats ? (
              <div style={{ padding: '20px', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Loading…</div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: '20px', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>No conversations yet.</div>
            ) : (
              conversations.map((c) => {
                const active = selectedId === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => void openConversation(c.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: active ? 'rgba(212,255,63,0.12)' : 'transparent',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      padding: '10px',
                      marginBottom: '8px',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', color: '#d4ff3f' }}>
                      {c.last_provider || 'unknown'} · {c.message_count} msgs
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                      {new Date(c.updated_at).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                      {c.visitor_ip || 'ip hidden'}
                    </div>
                  </button>
                )
              })
            )}
          </div>

          <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', minHeight: '520px' }}>
            {!selectedId ? (
              <div style={{ margin: 'auto', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                Select a conversation to inspect messages.
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>
                    Conversation {selectedId.slice(0, 8)}…
                  </div>
                  <button type="button" onClick={() => void handleDeleteConversation(selectedId)} style={{ ...ghostBtn, color: '#ff7b7b', borderColor: 'rgba(255,80,80,0.3)' }}>
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
                <div style={{ overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        background: m.role === 'user' ? 'rgba(212,255,63,0.15)' : '#0a0a08',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        fontSize: '13.5px',
                        lineHeight: 1.45,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>
                        {m.role.toUpperCase()}
                        {m.provider ? ` · ${m.provider}` : ''}
                      </div>
                      {m.content}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StatusPill({ label, ok, hint }: { label: string; ok: boolean; hint: string }) {
  return (
    <div
      style={{
        background: ok ? 'rgba(34,197,94,0.1)' : 'rgba(255,80,80,0.1)',
        border: `1px solid ${ok ? 'rgba(34,197,94,0.3)' : 'rgba(255,80,80,0.3)'}`,
        borderRadius: '6px',
        padding: '12px',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: '13px', color: ok ? '#4ade80' : '#ff7b7b' }}>
        {label}: {ok ? 'Configured' : 'Missing'}
      </div>
      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>
        {hint}
      </div>
    </div>
  )
}

function KeyListEditor({
  title,
  rows,
  onChange,
  onRemove,
  onAdd,
  placeholder,
}: {
  title: string
  rows: EditableApiKey[]
  onChange: (id: string, patch: Partial<EditableApiKey>) => void
  onRemove: (id: string) => void
  onAdd: () => void
  placeholder: string
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>{title.toUpperCase()}</label>
        <button type="button" onClick={onAdd} disabled={rows.length >= 20} style={{ ...ghostBtn, padding: '6px 10px' }}>
          + Add key
        </button>
      </div>
      {rows.length === 0 ? (
        <div style={{ padding: '14px', border: '1px dashed rgba(255,255,255,0.12)', borderRadius: '6px', color: 'rgba(255,255,255,0.4)', fontSize: '12.5px' }}>
          No keys yet. Click “Add key” to paste one from Google AI Studio or Groq.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {rows.map((row, index) => (
            <div
              key={row.id}
              style={{
                background: '#0a0a08',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '12px',
                display: 'grid',
                gap: '8px',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '8px', alignItems: 'center' }}>
                <input
                  value={row.label}
                  onChange={(e) => onChange(row.id, { label: e.target.value })}
                  style={inputStyle}
                  placeholder={`Key ${index + 1}`}
                />
                <label style={{ ...toggleRow, margin: 0, fontSize: '12px' }}>
                  <input
                    type="checkbox"
                    checked={row.enabled}
                    onChange={(e) => onChange(row.id, { enabled: e.target.checked })}
                  />
                  On
                </label>
                <button type="button" onClick={() => onRemove(row.id)} style={{ ...ghostBtn, padding: '8px 10px', color: '#ff8f8f' }}>
                  <Trash2 size={14} />
                </button>
              </div>
              <input
                type="password"
                value={row.keyInput}
                onChange={(e) => onChange(row.id, { keyInput: e.target.value })}
                style={inputStyle}
                placeholder={row.hasKey ? `Saved: ${row.keyMasked} (leave blank to keep)` : placeholder}
                autoComplete="off"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#121210',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  padding: '24px',
}

const sectionHead: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '16px',
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'Syne, sans-serif',
  fontWeight: 700,
  fontSize: '17px',
  margin: 0,
  color: '#fff',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontFamily: 'IBM Plex Mono, monospace',
  color: 'rgba(255,255,255,0.6)',
  marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: '#0a0a08',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff',
  padding: '10px 12px',
  borderRadius: '6px',
  fontSize: '14px',
}

const toggleRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '13.5px',
  color: 'rgba(255,255,255,0.8)',
  cursor: 'pointer',
}

const primaryBtn: React.CSSProperties = {
  background: '#d4ff3f',
  color: '#0e0e0c',
  border: 'none',
  padding: '12px 28px',
  borderRadius: '6px',
  fontWeight: 700,
  fontSize: '14px',
  fontFamily: 'Syne, sans-serif',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
}

const ghostBtn: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.14)',
  color: 'rgba(255,255,255,0.75)',
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  fontFamily: 'IBM Plex Mono, monospace',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
}
