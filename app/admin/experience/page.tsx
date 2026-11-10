'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

interface ExperienceItem {
  id: string
  role: string
  company: string
  period: string
  location: string | null
  bullets: string[]
  display_order: number
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form states
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [period, setPeriod] = useState('')
  const [location, setLocation] = useState('')
  const [bullets, setBullets] = useState('')
  const [displayOrder, setDisplayOrder] = useState(1)

  const supabase = useMemo(() => createClient(), [])

  const fetchExperiences = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('experiences')
      .select('*')
      .order('display_order', { ascending: true })

    if (data) setExperiences(data)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    const timer = setTimeout(() => { void fetchExperiences() }, 0)
    return () => clearTimeout(timer)
  }, [fetchExperiences])

  const openAddModal = () => {
    setEditingExp(null)
    setRole('')
    setCompany('')
    setPeriod('2025 → PRESENT')
    setLocation('Remote')
    setBullets('Laravel, Node.js, PostgreSQL')
    setDisplayOrder(experiences.length + 1)
    setIsModalOpen(true)
  }

  const openEditModal = (exp: ExperienceItem) => {
    setEditingExp(exp)
    setRole(exp.role)
    setCompany(exp.company)
    setPeriod(exp.period)
    setLocation(exp.location || '')
    setBullets((exp.bullets || []).join(', '))
    setDisplayOrder(exp.display_order)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      role: role.trim(),
      company: company.trim(),
      period: period.trim(),
      location: location.trim() || null,
      bullets: bullets.split(',').map(s => s.trim()).filter(Boolean),
      display_order: displayOrder,
    }

    if (editingExp) {
      await supabase.from('experiences').update(payload).eq('id', editingExp.id)
    } else {
      await supabase.from('experiences').insert([payload])
    }

    setSaving(false)
    setIsModalOpen(false)
    fetchExperiences()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this career experience?')) return
    await supabase.from('experiences').delete().eq('id', id)
    fetchExperiences()
  }

  return (
    <div suppressHydrationWarning style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Work Experience &amp; Career
          </h1>
          <p style={{ margin: 0, fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
            Manage the career timeline entries shown in your experience section.
          </p>
        </div>
        <button
          onClick={openAddModal}
          style={{ background: '#d4ff3f', color: '#0e0e0c', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 700, fontSize: '13.5px', fontFamily: 'Syne, sans-serif', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} />
          <span>Add Experience</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: 'IBM Plex Mono, monospace' }}>
          Loading experience history from Supabase...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {experiences.map((exp) => (
            <div key={exp.id} style={{ background: '#121210', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#d4ff3f', background: 'rgba(212,255,63,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                    #{exp.display_order}
                  </span>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '19px', color: '#fff' }}>
                    {exp.role}
                  </span>
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12.5px', color: '#d4ff3f', margin: '4px 0 8px 0' }}>
                  {exp.company} · {exp.location || 'Remote'} · {exp.period}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(exp.bullets || []).map((bullet, idx) => (
                    <span key={idx} style={{ padding: '3px 8px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '3px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
                      {bullet}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginLeft: '24px' }}>
                <button
                  onClick={() => openEditModal(exp)}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Pencil size={12} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  style={{ background: 'transparent', border: '1px solid rgba(255,80,80,0.3)', color: '#ff7b7b', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={12} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#141412', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', width: '100%', maxWidth: '600px', padding: '26px', boxShadow: '0 24px 70px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', margin: 0 }}>
                {editingExp ? 'Edit Experience' : 'Add Experience'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>ROLE TITLE *</label>
                  <input
                    type="text"
                    required
                    placeholder="Backend + AI Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>COMPANY / CLIENT *</label>
                  <input
                    type="text"
                    required
                    placeholder="Aibitsoft"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>PERIOD *</label>
                  <input
                    type="text"
                    required
                    placeholder="OCT 2025 → PRESENT"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>LOCATION</label>
                  <input
                    type="text"
                    placeholder="Gujranwala, PK · Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>ORDER</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>TECH TAGS / ACHIEVEMENTS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  placeholder="Laravel, Node.js, OpenAI API, PostgreSQL"
                  value={bullets}
                  onChange={(e) => setBullets(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={{ background: '#d4ff3f', color: '#0e0e0c', border: 'none', padding: '10px 22px', borderRadius: '6px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
                  {saving ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
