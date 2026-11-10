'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Star, CheckCircle2, Circle, X } from 'lucide-react'

interface Project {
  id: string
  slug: string
  title: string
  category: string
  context: string | null
  blurb: string
  img: string | null
  tech: string[]
  stat: string | null
  stat_label: string | null
  highlights: string[]
  problem: string | null
  solution: string | null
  live_url: string | null
  github_url: string | null
  display_order: number
  is_featured: boolean
  is_published: boolean
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    category: '',
    context: '',
    blurb: '',
    img: '',
    tech: '',
    stat: '',
    stat_label: '',
    problem: '',
    solution: '',
    highlights: '',
    live_url: '',
    github_url: '',
    display_order: 0,
    is_featured: false,
    is_published: true,
  })

  const supabase = useMemo(() => createClient(), [])

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      setErrorMsg(error.message)
    } else {
      setProjects(data || [])
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    const timer = setTimeout(() => { void fetchProjects() }, 0)
    return () => clearTimeout(timer)
  }, [fetchProjects])

  const openAddModal = () => {
    setEditingProject(null)
    setFormData({
      slug: '',
      title: '',
      category: '',
      context: '',
      blurb: '',
      img: '',
      tech: '',
      stat: '',
      stat_label: '',
      problem: '',
      solution: '',
      highlights: '',
      live_url: '',
      github_url: '',
      display_order: projects.length + 1,
      is_featured: false,
      is_published: true,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (proj: Project) => {
    setEditingProject(proj)
    setFormData({
      slug: proj.slug,
      title: proj.title,
      category: proj.category,
      context: proj.context || '',
      blurb: proj.blurb,
      img: proj.img || '',
      tech: (proj.tech || []).join(', '),
      stat: proj.stat || '',
      stat_label: proj.stat_label || '',
      problem: proj.problem || '',
      solution: proj.solution || '',
      highlights: (proj.highlights || []).join('\n'),
      live_url: proj.live_url || '',
      github_url: proj.github_url || '',
      display_order: proj.display_order,
      is_featured: proj.is_featured,
      is_published: proj.is_published,
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrorMsg(null)

    const payload = {
      slug: formData.slug.trim(),
      title: formData.title.trim(),
      category: formData.category.trim(),
      context: formData.context.trim() || null,
      blurb: formData.blurb.trim(),
      img: formData.img.trim() || null,
      tech: formData.tech.split(',').map(s => s.trim()).filter(Boolean),
      stat: formData.stat.trim() || null,
      stat_label: formData.stat_label.trim() || null,
      problem: formData.problem.trim() || null,
      solution: formData.solution.trim() || null,
      highlights: formData.highlights.split('\n').map(s => s.trim()).filter(Boolean),
      live_url: formData.live_url.trim() || null,
      github_url: formData.github_url.trim() || null,
      display_order: Number(formData.display_order) || 0,
      is_featured: formData.is_featured,
      is_published: formData.is_published,
    }

    if (editingProject) {
      const { error } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', editingProject.id)

      if (error) {
        setErrorMsg(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase
        .from('projects')
        .insert([payload])

      if (error) {
        setErrorMsg(error.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setIsModalOpen(false)
    fetchProjects()
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) {
      alert(error.message)
    } else {
      fetchProjects()
    }
  }

  const togglePublished = async (proj: Project) => {
    const { error } = await supabase
      .from('projects')
      .update({ is_published: !proj.is_published })
      .eq('id', proj.id)

    if (error) {
      alert(error.message)
    } else {
      fetchProjects()
    }
  }

  return (
    <div suppressHydrationWarning style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Projects &amp; Case Studies
          </h1>
          <p style={{ margin: 0, fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
            Manage the selected work displayed on your homepage and project case studies.
          </p>
        </div>
        <button
          onClick={openAddModal}
          style={{
            background: '#d4ff3f',
            color: '#0e0e0c',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '6px',
            fontWeight: 700,
            fontSize: '13.5px',
            fontFamily: 'Syne, sans-serif',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={16} />
          <span>Add New Project</span>
        </button>
      </div>

      {errorMsg && (
        <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', color: '#ff7b7b', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px' }}>
          {errorMsg}
        </div>
      )}

      {/* Projects Table */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: 'IBM Plex Mono, monospace' }}>
          Loading projects from Supabase...
        </div>
      ) : projects.length === 0 ? (
        <div style={{ background: '#121210', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 16px 0', color: 'rgba(255,255,255,0.5)' }}>No projects found in database.</p>
          <button onClick={openAddModal} style={{ background: '#d4ff3f', color: '#0e0e0c', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
            Create First Project
          </button>
        </div>
      ) : (
        <div style={{ background: '#121210', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: '#161614', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 18px' }}>Order</th>
                <th style={{ padding: '14px 18px' }}>Project</th>
                <th style={{ padding: '14px 18px' }}>Category</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '16px 18px', fontFamily: 'IBM Plex Mono, monospace', color: '#d4ff3f', width: '60px' }}>
                    #{proj.display_order}
                  </td>
                  <td style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14.5px', color: '#fff' }}>{proj.title}</span>
                      {proj.is_featured && (
                        <Star size={13} fill="#d4ff3f" color="#d4ff3f" />
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontFamily: 'IBM Plex Mono, monospace', marginTop: '2px' }}>
                      /{proj.slug}
                    </div>
                  </td>
                  <td style={{ padding: '16px 18px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                    {proj.category}
                  </td>
                  <td style={{ padding: '16px 18px' }}>
                    <button
                      onClick={() => togglePublished(proj)}
                      style={{
                        background: proj.is_published ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                        color: proj.is_published ? '#4ade80' : 'rgba(255, 255, 255, 0.4)',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontFamily: 'IBM Plex Mono, monospace',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      {proj.is_published ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                      <span>{proj.is_published ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>
                  <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                    <button
                      onClick={() => openEditModal(proj)}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontFamily: 'IBM Plex Mono, monospace',
                        marginRight: '8px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Pencil size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id, proj.title)}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255, 80, 80, 0.25)',
                        color: '#ff7b7b',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#141412',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '740px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 24px 70px rgba(0,0,0,0.8)'
          }}>
            <div style={{ padding: '20px 26px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', margin: 0 }}>
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ overflowY: 'auto', padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>TITLE *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value
                      setFormData({
                        ...formData,
                        title,
                        slug: editingProject ? formData.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      })
                    }}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>SLUG *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>CATEGORY *</label>
                  <input
                    type="text"
                    required
                    placeholder="AI · Computer Vision"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>CONTEXT / COMPANY</label>
                  <input
                    type="text"
                    placeholder="Aibitsoft · Backend + AI Engineer"
                    value={formData.context}
                    onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>ORDER</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>BLURB (SHORT SUMMARY) *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.blurb}
                  onChange={(e) => setFormData({ ...formData, blurb: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>IMAGE URL</label>
                <input
                  type="text"
                  placeholder="https://... or /images/works/project.png"
                  value={formData.img}
                  onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>TECH STACK (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    placeholder="Python, YOLO, OpenCV"
                    value={formData.tech}
                    onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>STAT VALUE</label>
                  <input
                    type="text"
                    placeholder="94%"
                    value={formData.stat}
                    onChange={(e) => setFormData({ ...formData, stat: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>STAT LABEL</label>
                  <input
                    type="text"
                    placeholder="accuracy"
                    value={formData.stat_label}
                    onChange={(e) => setFormData({ ...formData, stat_label: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>HIGHLIGHTS (ONE BULLET PER LINE)</label>
                <textarea
                  rows={3}
                  placeholder="Detects smartwatches in real time&#10;Runs on Raspberry Pi"
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>THE PROBLEM</label>
                  <textarea
                    rows={2}
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>THE SOLUTION</label>
                  <textarea
                    rows={2}
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  />
                  <span>Published on Website</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  />
                  <span>Featured Project</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ background: '#d4ff3f', color: '#0e0e0c', border: 'none', padding: '10px 22px', borderRadius: '6px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
