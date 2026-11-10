'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

interface ServiceItem {
  id: string
  num: string
  tag: string
  title: string
  description: string
  display_order: number
  is_published: boolean
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ServiceItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [num, setNum] = useState('01')
  const [tag, setTag] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [displayOrder, setDisplayOrder] = useState(1)
  const [isPublished, setIsPublished] = useState(true)

  const supabase = useMemo(() => createClient(), [])

  const fetchServices = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('services').select('*').order('display_order', { ascending: true })
    if (data) setServices(data as ServiceItem[])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    const t = setTimeout(() => {
      void fetchServices()
    }, 0)
    return () => clearTimeout(t)
  }, [fetchServices])

  const openAdd = () => {
    setEditing(null)
    setNum(String(services.length + 1).padStart(2, '0'))
    setTag('')
    setTitle('')
    setDescription('')
    setDisplayOrder(services.length + 1)
    setIsPublished(true)
    setIsModalOpen(true)
  }

  const openEdit = (item: ServiceItem) => {
    setEditing(item)
    setNum(item.num)
    setTag(item.tag)
    setTitle(item.title)
    setDescription(item.description)
    setDisplayOrder(item.display_order)
    setIsPublished(item.is_published)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      num: num.trim(),
      tag: tag.trim(),
      title: title.trim(),
      description: description.trim(),
      display_order: displayOrder,
      is_published: isPublished,
    }

    if (editing) {
      await supabase.from('services').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('services').insert([payload])
    }

    setSaving(false)
    setIsModalOpen(false)
    fetchServices()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return
    await supabase.from('services').delete().eq('id', id)
    fetchServices()
  }

  return (
    <div suppressHydrationWarning style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', margin: '0 0 6px 0' }}>
            Services (What I Do)
          </h1>
          <p style={{ margin: 0, fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
            Manage homepage service cards shown publicly.
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            background: '#d4ff3f',
            color: '#0e0e0c',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '6px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.45)' }}>Loading…</p>
      ) : (
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden' }}>
          {services.map((s) => (
            <div
              key={s.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr auto',
                gap: '16px',
                padding: '16px 18px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#d4ff3f' }}>{s.num}</span>
              <div>
                <div style={{ fontWeight: 700 }}>{s.title}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                  {s.tag} · {s.is_published ? 'Published' : 'Hidden'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => openEdit(s)} style={iconBtn}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => void handleDelete(s.id)} style={iconBtn}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 200,
            padding: '20px',
          }}
        >
          <form
            onSubmit={handleSave}
            style={{
              width: '100%',
              maxWidth: '520px',
              background: '#121210',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ margin: 0 }}>{editing ? 'Edit service' : 'Add service'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} style={iconBtn}>
                <X size={16} />
              </button>
            </div>

            <Field label="Number" value={num} onChange={setNum} />
            <Field label="Tag" value={tag} onChange={setTag} />
            <Field label="Title" value={title} onChange={setTitle} required />
            <label style={labelStyle}>
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </label>
            <Field
              label="Display order"
              value={String(displayOrder)}
              onChange={(v) => setDisplayOrder(Number(v) || 0)}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '13px' }}>
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
              Published on homepage
            </label>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%',
                background: '#d4ff3f',
                color: '#0e0e0c',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {saving ? 'Saving…' : 'Save service'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

const iconBtn: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff',
  borderRadius: '6px',
  padding: '8px',
  cursor: 'pointer',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '12px',
  fontSize: '12px',
  color: 'rgba(255,255,255,0.6)',
  fontFamily: 'IBM Plex Mono, monospace',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  marginTop: '6px',
  background: '#0a0a08',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff',
  padding: '10px 12px',
  borderRadius: '6px',
  boxSizing: 'border-box',
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  return (
    <label style={labelStyle}>
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={inputStyle}
      />
    </label>
  )
}
