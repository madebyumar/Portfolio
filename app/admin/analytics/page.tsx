'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Globe2, Link2, Eye, MapPin, RefreshCw, Trash2 } from 'lucide-react'

interface VisitRow {
  id: string
  path: string
  referrer: string | null
  referrer_host: string | null
  country_code: string | null
  country_name: string | null
  city: string | null
  region: string | null
  created_at: string
}

interface CountItem {
  label: string
  count: number
  meta?: string
}

function aggregate(rows: VisitRow[], keyFn: (row: VisitRow) => string): CountItem[] {
  const map = new Map<string, number>()
  for (const row of rows) {
    const key = keyFn(row) || 'Unknown'
    map.set(key, (map.get(key) || 0) + 1)
  }
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

export default function AdminAnalyticsPage() {
  const [visits, setVisits] = useState<VisitRow[]>([])
  const [loading, setLoading] = useState(true)
  const [clearing, setClearing] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  const fetchVisits = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('page_visits')
      .select(
        'id, path, referrer, referrer_host, country_code, country_name, city, region, created_at'
      )
      .order('created_at', { ascending: false })
      .limit(2000)

    setVisits((data as VisitRow[]) || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    const t = setTimeout(() => {
      void fetchVisits()
    }, 0)
    return () => clearTimeout(t)
  }, [fetchVisits])

  const byCountry = useMemo(
    () =>
      aggregate(visits, (v) => {
        if (v.country_name && v.country_code) return `${v.country_name} (${v.country_code})`
        return v.country_name || v.country_code || 'Unknown'
      }),
    [visits]
  )

  const byReferrer = useMemo(
    () =>
      aggregate(visits, (v) => {
        if (!v.referrer_host) return 'Direct / none'
        return v.referrer_host
      }),
    [visits]
  )

  const byPath = useMemo(() => aggregate(visits, (v) => v.path || '/'), [visits])

  const maxCountry = byCountry[0]?.count || 1

  const clearAll = async () => {
    if (!confirm('Delete all visitor analytics data? This cannot be undone.')) return
    setClearing(true)
    await supabase.from('page_visits').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await fetchVisits()
    setClearing(false)
  }

  return (
    <div suppressHydrationWarning style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', margin: '0 0 6px 0' }}>
            Visitor Analytics
          </h1>
          <p style={{ margin: 0, fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
            See which countries people visit from, and which sites send them here.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => void fetchVisits()}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              padding: '10px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '12px',
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            type="button"
            onClick={() => void clearAll()}
            disabled={clearing}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,80,80,0.35)',
              color: '#ff8f8f',
              padding: '10px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '12px',
              opacity: clearing ? 0.6 : 1,
            }}
          >
            <Trash2 size={14} /> Clear data
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <MetricCard icon={<Eye size={16} />} label="Tracked visits" value={String(visits.length)} />
        <MetricCard icon={<Globe2 size={16} />} label="Countries" value={String(byCountry.length)} />
        <MetricCard icon={<Link2 size={16} />} label="Traffic sources" value={String(byReferrer.length)} />
      </div>

      {loading ? (
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.45)' }}>Loading analytics…</p>
      ) : visits.length === 0 ? (
        <div style={{ padding: '40px', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '8px', color: 'rgba(255,255,255,0.55)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px' }}>
          No visits recorded yet. Open the public site in another tab — traffic will appear here with country + source.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px' }}>
          <Panel title="Visitors by country" icon={<Globe2 size={15} />}>
            {byCountry.map((item) => (
              <BarRow key={item.label} label={item.label} count={item.count} max={maxCountry} />
            ))}
          </Panel>

          <Panel title="Where they came from" icon={<Link2 size={15} />}>
            {byReferrer.map((item) => (
              <SimpleRow key={item.label} label={item.label} count={item.count} />
            ))}
          </Panel>

          <Panel title="Top pages" icon={<Eye size={15} />}>
            {byPath.slice(0, 12).map((item) => (
              <SimpleRow key={item.label} label={item.label} count={item.count} />
            ))}
          </Panel>

          <Panel title="Recent visits" icon={<MapPin size={15} />}>
            <div style={{ maxHeight: '420px', overflow: 'auto' }}>
              {visits.slice(0, 40).map((v) => (
                <div
                  key={v.id}
                  style={{
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '12.5px',
                    fontFamily: 'IBM Plex Mono, monospace',
                  }}
                >
                  <div style={{ color: '#fff', marginBottom: '4px' }}>{v.path}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {(v.city ? `${v.city}, ` : '') + (v.country_name || v.country_code || 'Unknown')}
                    {' · '}
                    {v.referrer_host || 'Direct'}
                    {' · '}
                    {new Date(v.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div style={{ background: '#121210', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>{icon}</span>
      </div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '34px' }}>{value}</div>
    </div>
  )
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section style={{ background: '#121210', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ color: '#d4ff3f' }}>{icon}</span>
        <h2 style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700 }}>{title}</h2>
      </div>
      {children}
    </section>
  )
}

function BarRow({ label, count, max }: { label: string; count: number; max: number }) {
  const width = Math.max(8, Math.round((count / max) * 100))
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px' }}>
        <span>{label}</span>
        <span style={{ color: '#d4ff3f' }}>{count}</span>
      </div>
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ width: `${width}%`, height: '100%', background: '#d4ff3f' }} />
      </div>
    </div>
  )
}

function SimpleRow({ label, count }: { label: string; count: number }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '10px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '12.5px',
      }}
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ color: '#d4ff3f', flexShrink: 0 }}>{count}</span>
    </div>
  )
}
