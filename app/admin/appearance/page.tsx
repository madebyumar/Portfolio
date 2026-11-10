'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { THEME_PALETTES, DEFAULT_PALETTE_ID, getPalette } from '@/lib/theme/palettes'
import { CheckCircle2, AlertCircle, Palette, Save } from 'lucide-react'

export default function AdminAppearancePage() {
  const [paletteId, setPaletteId] = useState(DEFAULT_PALETTE_ID)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const supabase = useMemo(() => createClient(), [])

  const fetchTheme = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'theme').single()
    const value = data?.value as { paletteId?: string } | null
    setPaletteId(value?.paletteId && getPalette(value.paletteId).id === value.paletteId ? value.paletteId : DEFAULT_PALETTE_ID)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    const t = setTimeout(() => {
      void fetchTheme()
    }, 0)
    return () => clearTimeout(t)
  }, [fetchTheme])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    const { error } = await supabase.from('site_settings').upsert(
      {
        key: 'theme',
        value: { paletteId },
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )

    if (error) {
      setMessage({ text: error.message, type: 'error' })
      setSaving(false)
      return
    }

    try {
      await fetch('/api/admin/revalidate', { method: 'POST' })
    } catch {
      // Save succeeded even if cache bust fails
    }

    setMessage({
      text: `Palette saved: ${getPalette(paletteId).name}. Public site will use this color scheme.`,
      type: 'success',
    })
    setSaving(false)
  }

  const active = getPalette(paletteId)

  return (
    <div suppressHydrationWarning style={{ maxWidth: '980px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', margin: '0 0 6px 0' }}>
          Appearance
        </h1>
        <p style={{ margin: 0, fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
          Choose the site color palette. Visitors no longer see a palette picker — only your selection.
        </p>
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

      {loading ? (
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.45)' }}>Loading palettes…</p>
      ) : (
        <>
          <div
            style={{
              background: '#121210',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Palette size={18} color="#d4ff3f" />
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px' }}>Active palette</div>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                  {active.name}
                </div>
              </div>
              <span
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: active.dot,
                  boxShadow: `0 0 12px ${active.dot}`,
                  display: 'inline-block',
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              style={{
                background: '#d4ff3f',
                color: '#0e0e0c',
                border: 'none',
                padding: '11px 20px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '13.5px',
                fontFamily: 'Syne, sans-serif',
                cursor: saving ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                opacity: saving ? 0.7 : 1,
              }}
            >
              <Save size={15} />
              {saving ? 'Saving…' : 'Save palette'}
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: '10px',
            }}
          >
            {THEME_PALETTES.map((pal) => {
              const selected = pal.id === paletteId
              return (
                <button
                  key={pal.id}
                  type="button"
                  onClick={() => setPaletteId(pal.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    textAlign: 'left',
                    background: selected ? 'rgba(212,255,63,0.08)' : '#121210',
                    border: selected ? '1px solid #d4ff3f' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '12px',
                  }}
                >
                  <span
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: pal.dot,
                      flexShrink: 0,
                      boxShadow: `0 0 8px ${pal.dot}`,
                    }}
                  />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {pal.name}
                  </span>
                  {pal.badge ? (
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        background: '#d4ff3f',
                        color: '#0e0e0c',
                        padding: '2px 5px',
                        borderRadius: '3px',
                      }}
                    >
                      {pal.badge}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
