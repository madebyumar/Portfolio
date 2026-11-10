'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, CheckCircle2, Circle, X } from 'lucide-react'

interface BlogPost {
  id: string
  slug: string
  title: string
  category: string
  date: string
  read_time: string
  excerpt: string
  content: string
  tags: string[]
  cover_img: string | null
  is_published: boolean
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    category: '',
    date: '',
    read_time: '5 min read',
    excerpt: '',
    content: '',
    tags: '',
    cover_img: '',
    is_published: true,
  })

  const supabase = useMemo(() => createClient(), [])

  const fetchBlogs = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setErrorMsg(error.message)
    } else {
      setBlogs(data || [])
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    const timer = setTimeout(() => { void fetchBlogs() }, 0)
    return () => clearTimeout(timer)
  }, [fetchBlogs])

  const openAddModal = () => {
    setEditingBlog(null)
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    setFormData({
      slug: '',
      title: '',
      category: 'Software Engineering',
      date: today,
      read_time: '5 min read',
      excerpt: '',
      content: '# Title\n\nWrite your blog content here in markdown...',
      tags: 'Backend, Engineering',
      cover_img: '',
      is_published: true,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (blog: BlogPost) => {
    setEditingBlog(blog)
    setFormData({
      slug: blog.slug,
      title: blog.title,
      category: blog.category,
      date: blog.date,
      read_time: blog.read_time,
      excerpt: blog.excerpt,
      content: blog.content,
      tags: (blog.tags || []).join(', '),
      cover_img: blog.cover_img || '',
      is_published: blog.is_published,
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
      date: formData.date.trim(),
      read_time: formData.read_time.trim(),
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
      cover_img: formData.cover_img.trim() || null,
      is_published: formData.is_published,
    }

    if (editingBlog) {
      const { error } = await supabase
        .from('blogs')
        .update(payload)
        .eq('id', editingBlog.id)

      if (error) {
        setErrorMsg(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase
        .from('blogs')
        .insert([payload])

      if (error) {
        setErrorMsg(error.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setIsModalOpen(false)
    fetchBlogs()
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    const { error } = await supabase.from('blogs').delete().eq('id', id)
    if (error) {
      alert(error.message)
    } else {
      fetchBlogs()
    }
  }

  const togglePublished = async (blog: BlogPost) => {
    const { error } = await supabase
      .from('blogs')
      .update({ is_published: !blog.is_published })
      .eq('id', blog.id)

    if (error) {
      alert(error.message)
    } else {
      fetchBlogs()
    }
  }

  return (
    <div suppressHydrationWarning style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Blog &amp; Technical Writing
          </h1>
          <p style={{ margin: 0, fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
            Publish and edit engineering articles shown on your /blog page.
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
          <span>Write New Post</span>
        </button>
      </div>

      {errorMsg && (
        <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', color: '#ff7b7b', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px' }}>
          {errorMsg}
        </div>
      )}

      {/* Blogs Table */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: 'IBM Plex Mono, monospace' }}>
          Loading blog posts from Supabase...
        </div>
      ) : blogs.length === 0 ? (
        <div style={{ background: '#121210', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 16px 0', color: 'rgba(255,255,255,0.5)' }}>No blog posts found in database.</p>
          <button onClick={openAddModal} style={{ background: '#d4ff3f', color: '#0e0e0c', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
            Write First Article
          </button>
        </div>
      ) : (
        <div style={{ background: '#121210', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: '#161614', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 18px' }}>Date</th>
                <th style={{ padding: '14px 18px' }}>Article Title</th>
                <th style={{ padding: '14px 18px' }}>Category</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '16px 18px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.45)', fontSize: '12px', width: '130px' }}>
                    {blog.date}
                  </td>
                  <td style={{ padding: '16px 18px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#fff' }}>{blog.title}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'IBM Plex Mono, monospace', marginTop: '2px' }}>
                      /blog/{blog.slug} · {blog.read_time}
                    </div>
                  </td>
                  <td style={{ padding: '16px 18px', color: '#d4ff3f', fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px' }}>
                    {blog.category}
                  </td>
                  <td style={{ padding: '16px 18px' }}>
                    <button
                      onClick={() => togglePublished(blog)}
                      style={{
                        background: blog.is_published ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                        color: blog.is_published ? '#4ade80' : 'rgba(255, 255, 255, 0.4)',
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
                      {blog.is_published ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                      <span>{blog.is_published ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>
                  <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                    <button
                      onClick={() => openEditModal(blog)}
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
                      onClick={() => handleDelete(blog.id, blog.title)}
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

      {/* Editor Modal */}
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
            maxWidth: '820px',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 24px 70px rgba(0,0,0,0.8)'
          }}>
            <div style={{ padding: '20px 26px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', margin: 0 }}>
                {editingBlog ? 'Edit Blog Post' : 'Write New Article'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ overflowY: 'auto', padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>ARTICLE TITLE *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value
                      setFormData({
                        ...formData,
                        title,
                        slug: editingBlog ? formData.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>CATEGORY *</label>
                  <input
                    type="text"
                    required
                    placeholder="Laravel · AI"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>DATE *</label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>READ TIME</label>
                  <input
                    type="text"
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>EXCERPT (SHORT PREVIEW) *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>TAGS (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    placeholder="Laravel, REST API, Architecture"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>COVER IMAGE URL</label>
                  <input
                    type="text"
                    placeholder="https://... or /images/blog/article.svg"
                    value={formData.cover_img}
                    onChange={(e) => setFormData({ ...formData, cover_img: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>MARKDOWN CONTENT *</label>
                <textarea
                  required
                  rows={12}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0a0a08', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '12px', borderRadius: '6px', fontFamily: 'Consolas, monospace', fontSize: '13px', lineHeight: 1.6 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  />
                  <span>Publish Article Live</span>
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
                  {saving ? 'Saving...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
