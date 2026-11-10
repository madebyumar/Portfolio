'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

interface SkillItem {
  id: string
  category: string
  name: string
  display_order: number
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [category, setCategory] = useState('Frontend')
  const [name, setName] = useState('')
  const [displayOrder, setDisplayOrder] = useState(1)

  const supabase = useMemo(() => createClient(), [])

  const fetchSkills = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true })

    if (data) setSkills(data)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    const timer = setTimeout(() => { void fetchSkills() }, 0)
    return () => clearTimeout(timer)
  }, [fetchSkills])

  const openAddModal = () => {
    setEditingSkill(null)
    setCategory('Frontend')
    setName('')
    setDisplayOrder(skills.length + 1)
    setIsModalOpen(true)
  }

  const openEditModal = (skill: SkillItem) => {
    setEditingSkill(skill)
    setCategory(skill.category)
    setName(skill.name)
    setDisplayOrder(skill.display_order)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      category: category.trim(),
      name: name.trim(),
      display_order: displayOrder,
    }

    if (editingSkill) {
      await supabase.from('skills').update(payload).eq('id', editingSkill.id)
    } else {
      await supabase.from('skills').insert([payload])
    }

    setSaving(false)
    setIsModalOpen(false)
    fetchSkills()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill entry?')) return
    await supabase.from('skills').delete().eq('id', id)
    fetchSkills()
  }

  return (
    <div suppressHydrationWarning style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Skills &amp; Capabilities
          </h1>
          <p style={{ margin: 0, fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
            Manage the tech stack groups shown in the capabilities section.
          </p>
        </div>
        <button
          onClick={openAddModal}
          style={{ background: '#d4ff3f', color: '#0e0e0c', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 700, fontSize: '13.5px', fontFamily: 'Syne, sans-serif', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} />
          <span>Add Skill Category</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: 'IBM Plex Mono, monospace' }}>
          Loading skills from Supabase...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {skills.map((skill) => (
            <div key={skill.id} style={{ background: '#121210', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#d4ff3f', background: 'rgba(212,255,63,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                    #{skill.display_order}
                  </span>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '18px', color: '#fff' }}>
                    {skill.category}
                  </span>
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                  {skill.name}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginLeft: '24px' }}>
                <button
                  onClick={() => openEditModal(skill)}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Pencil size={12} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
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
          <div style={{ background: '#141412', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', width: '100%', maxWidth: '560px', padding: '26px', boxShadow: '0 24px 70px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', margin: 0 }}>
                {editingSkill ? 'Edit Skill Category' : 'Add Skill Category'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>CATEGORY NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frontend, AI / ML"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>TECHNOLOGIES (BULLET/DOT SEPARATED) *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="React.js · Vue.js · Next.js · TypeScript"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={{ background: '#d4ff3f', color: '#0e0e0c', border: 'none', padding: '10px 22px', borderRadius: '6px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
