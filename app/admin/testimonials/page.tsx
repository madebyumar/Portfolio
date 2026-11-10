'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Star, X } from 'lucide-react'

interface TestimonialItem {
  id: string
  quote: string
  author: string
  role_title: string
  company: string | null
  initials: string | null
  is_featured: boolean
  display_order: number
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form states
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')
  const [roleTitle, setRoleTitle] = useState('')
  const [company, setCompany] = useState('')
  const [initials, setInitials] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [displayOrder, setDisplayOrder] = useState(1)

  const supabase = useMemo(() => createClient(), [])

  const fetchTestimonials = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })

    if (data) setTestimonials(data)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    const timer = setTimeout(() => { void fetchTestimonials() }, 0)
    return () => clearTimeout(timer)
  }, [fetchTestimonials])

  const openAddModal = () => {
    setEditingItem(null)
    setQuote('')
    setAuthor('')
    setRoleTitle('')
    setCompany('')
    setInitials('')
    setIsFeatured(false)
    setDisplayOrder(testimonials.length + 1)
    setIsModalOpen(true)
  }

  const openEditModal = (item: TestimonialItem) => {
    setEditingItem(item)
    setQuote(item.quote)
    setAuthor(item.author)
    setRoleTitle(item.role_title)
    setCompany(item.company || '')
    setInitials(item.initials || '')
    setIsFeatured(item.is_featured)
    setDisplayOrder(item.display_order)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      quote: quote.trim(),
      author: author.trim(),
      role_title: roleTitle.trim(),
      company: company.trim() || null,
      initials: initials.trim() || author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      is_featured: isFeatured,
      display_order: displayOrder,
    }

    if (editingItem) {
      await supabase.from('testimonials').update(payload).eq('id', editingItem.id)
    } else {
      await supabase.from('testimonials').insert([payload])
    }

    setSaving(false)
    setIsModalOpen(false)
    fetchTestimonials()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    fetchTestimonials()
  }

  return (
    <div suppressHydrationWarning style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Client Words &amp; Reviews
          </h1>
          <p style={{ margin: 0, fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
            Manage client quotes and testimonials displayed in the &ldquo;Client Words&rdquo; section.
          </p>
        </div>
        <button
          onClick={openAddModal}
          style={{ background: '#d4ff3f', color: '#0e0e0c', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 700, fontSize: '13.5px', fontFamily: 'Syne, sans-serif', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: 'IBM Plex Mono, monospace' }}>
          Loading testimonials from Supabase...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {testimonials.map((item) => (
            <div key={item.id} style={{ background: '#121210', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, paddingRight: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ width: '32px', height: '32px', borderRadius: '4px', background: item.is_featured ? '#d4ff3f' : '#222', color: item.is_featured ? '#0e0e0c' : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px', fontFamily: 'Syne, sans-serif' }}>
                    {item.initials || 'CL'}
                  </span>
                  <div>
                    <strong style={{ fontSize: '15px', color: '#fff' }}>{item.author}</strong>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontFamily: 'IBM Plex Mono, monospace', marginLeft: '8px' }}>
                      {item.role_title} {item.company ? `· ${item.company}` : ''}
                    </span>
                  </div>
                  {item.is_featured && (
                    <span style={{ background: 'rgba(212,255,63,0.15)', color: '#d4ff3f', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={10} fill="#d4ff3f" />
                      <span>FEATURED</span>
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '14px', lineHeight: 1.65, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>
                  &ldquo;{item.quote}&rdquo;
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => openEditModal(item)}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Pencil size={12} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
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
          <div style={{ background: '#141412', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', width: '100%', maxWidth: '620px', padding: '26px', boxShadow: '0 24px 70px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', margin: 0 }}>
                {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>CLIENT QUOTE *</label>
                <textarea
                  required
                  rows={4}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>AUTHOR NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="S. Mitchell"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>AVATAR INITIALS</label>
                  <input
                    type="text"
                    placeholder="SM"
                    value={initials}
                    onChange={(e) => setInitials(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>ROLE / INDUSTRY *</label>
                  <input
                    type="text"
                    required
                    placeholder="E-commerce"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>COMPANY / LOCATION</label>
                  <input
                    type="text"
                    placeholder="London"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '4px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  <span>Featured Quote (Spans 2 rows on homepage)</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={{ background: '#d4ff3f', color: '#0e0e0c', border: 'none', padding: '10px 22px', borderRadius: '6px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
                  {saving ? 'Saving...' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
