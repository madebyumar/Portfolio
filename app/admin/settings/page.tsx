'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, User, Globe, Mail, BarChart3, CheckCircle2, AlertCircle } from 'lucide-react'

interface ProfileSettings {
  name: string
  role: string
  headline: string
  bio: string
  location: string
  timezone: string
  status: string
  email: string
  whatsapp: string
  github: string
  linkedin: string
  stats: Array<{ label: string; value: string }>
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<ProfileSettings>({
    name: '',
    role: '',
    headline: '',
    bio: '',
    location: '',
    timezone: '',
    status: '',
    email: '',
    whatsapp: '',
    github: '',
    linkedin: '',
    stats: [
      { label: 'Projects shipped', value: '10+' },
      { label: 'Years experience', value: '4+' },
      { label: 'ML model accuracy', value: '94%' },
      { label: 'Students mentored', value: '60+' },
    ]
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    async function loadSettings() {
      setLoading(true)
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'profile')
        .single()

      if (!error && data?.value) {
        setSettings(data.value as ProfileSettings)
      }
      setLoading(false)
    }

    loadSettings()
  }, [supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const { error } = await supabase
      .from('site_settings')
      .upsert({
        key: 'profile',
        value: settings,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' })

    if (error) {
      setMessage({ text: error.message, type: 'error' })
    } else {
      setMessage({ text: 'Settings saved successfully to Supabase!', type: 'success' })
    }
    setSaving(false)
  }

  const handleStatChange = (index: number, field: 'label' | 'value', val: string) => {
    const updated = [...settings.stats]
    updated[index] = { ...updated[index], [field]: val }
    setSettings({ ...settings, stats: updated })
  }

  return (
    <div suppressHydrationWarning style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          Profile &amp; Site Settings
        </h1>
        <p style={{ margin: 0, fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
          Update your public profile, hero status, social links, and key stats.
        </p>
      </div>

      {message && (
        <div style={{
          background: message.type === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 80, 80, 0.12)',
          border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 80, 80, 0.3)'}`,
          color: message.type === 'success' ? '#4ade80' : '#ff7b7b',
          padding: '12px 16px',
          borderRadius: '6px',
          fontSize: '13.5px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: 'IBM Plex Mono, monospace' }}>
          Loading profile configuration from Supabase...
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Identity Box */}
          <div style={{ background: '#121210', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="#d4ff3f" />
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '17px', margin: 0, color: '#fff' }}>
                Personal Identity
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>FULL NAME</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>PRIMARY TITLE / ROLE</label>
                <input
                  type="text"
                  value={settings.role}
                  onChange={(e) => setSettings({ ...settings, role: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>ABOUT STRIP HEADLINE</label>
              <input
                type="text"
                value={settings.headline}
                onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
                style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>BIO DESCRIPTION</label>
              <textarea
                rows={3}
                value={settings.bio}
                onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
              />
            </div>
          </div>

          {/* Status & Availability */}
          <div style={{ background: '#121210', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} color="#d4ff3f" />
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '17px', margin: 0, color: '#fff' }}>
                Status &amp; Location
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>AVAILABILITY STATUS</label>
                <input
                  type="text"
                  value={settings.status}
                  onChange={(e) => setSettings({ ...settings, status: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#d4ff3f', padding: '10px 12px', borderRadius: '6px', fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>LOCATION</label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>TIMEZONE</label>
                <input
                  type="text"
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                />
              </div>
            </div>
          </div>

          {/* Contact & Social Links */}
          <div style={{ background: '#121210', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} color="#d4ff3f" />
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '17px', margin: 0, color: '#fff' }}>
                Contact &amp; Social Links
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>EMAIL</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>WHATSAPP URL</label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>GITHUB URL</label>
                <input
                  type="text"
                  value={settings.github}
                  onChange={(e) => setSettings({ ...settings, github: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>LINKEDIN URL</label>
                <input
                  type="text"
                  value={settings.linkedin}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                />
              </div>
            </div>
          </div>

          {/* Key Metric Numbers */}
          <div style={{ background: '#121210', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={16} color="#d4ff3f" />
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '17px', margin: 0, color: '#fff' }}>
                Key Metric Highlights
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {(settings.stats || []).map((st, idx) => (
                <div key={idx} style={{ background: '#0a0a08', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '6px' }}>
                  <label style={{ display: 'block', fontSize: '10.5px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>STAT VALUE</label>
                  <input
                    type="text"
                    value={st.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#141412', border: '1px solid rgba(255,255,255,0.12)', color: '#d4ff3f', padding: '6px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '16px', marginBottom: '8px' }}
                  />
                  <label style={{ display: 'block', fontSize: '10.5px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>LABEL</label>
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#141412', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '6px 8px', borderRadius: '4px', fontSize: '11px' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: '#d4ff3f',
                color: '#0e0e0c',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '14px',
                fontFamily: 'Syne, sans-serif',
                cursor: saving ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Save size={16} />
              <span>{saving ? 'Saving Settings...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
