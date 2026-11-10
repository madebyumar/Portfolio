import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/env'
import type { BlogPost, Profile, Project } from '@/lib/data/types'

let cached: SupabaseClient | null = null

function getPublicClient(): SupabaseClient {
  if (cached) return cached
  cached = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}

function asProfile(value: unknown): Profile | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as Profile
}

export async function getLiveProjects(): Promise<Project[] | null> {
  try {
    const { data, error } = await getPublicClient()
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) return null

    return data.map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      context: p.context,
      img: p.img,
      blurb: p.blurb,
      tech: p.tech || [],
      stat: p.stat,
      statLabel: p.stat_label,
      highlights: p.highlights || [],
      problem: p.problem,
      solution: p.solution,
      display_order: p.display_order,
      is_featured: p.is_featured,
    }))
  } catch {
    return null
  }
}

export async function getLiveProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getLiveProjects()
  return projects?.find((p) => p.slug === slug) ?? null
}

export async function getLiveBlogs(): Promise<BlogPost[] | null> {
  try {
    const { data, error } = await getPublicClient()
      .from('blogs')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) return null

    return data.map((b) => ({
      slug: b.slug,
      title: b.title,
      tag: b.category,
      date: b.date,
      excerpt: b.excerpt,
      img: b.cover_img,
      read_time: b.read_time,
      content: b.content,
    }))
  } catch {
    return null
  }
}

export async function getLiveBlogBySlug(slug: string): Promise<BlogPost | null> {
  const blogs = await getLiveBlogs()
  return blogs?.find((b) => b.slug === slug) ?? null
}

export async function getLiveProfile(): Promise<Profile | null> {
  try {
    const { data, error } = await getPublicClient()
      .from('site_settings')
      .select('value')
      .eq('key', 'profile')
      .single()

    if (error || !data?.value) return null
    return asProfile(data.value)
  } catch {
    return null
  }
}

export async function getLiveThemePaletteId(): Promise<string> {
  try {
    const { data, error } = await getPublicClient()
      .from('site_settings')
      .select('value')
      .eq('key', 'theme')
      .single()

    if (error || !data?.value || typeof data.value !== 'object') return 'volt'
    const value = data.value as { paletteId?: unknown }
    return typeof value.paletteId === 'string' && value.paletteId ? value.paletteId : 'volt'
  } catch {
    return 'volt'
  }
}

export async function getLiveSkills() {
  try {
    const { data, error } = await getPublicClient()
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) return null
    return data
  } catch {
    return null
  }
}

export async function getLiveExperiences() {
  try {
    const { data, error } = await getPublicClient()
      .from('experiences')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) return null
    return data
  } catch {
    return null
  }
}

export async function getLiveTestimonials() {
  try {
    const { data, error } = await getPublicClient()
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) return null
    return data
  } catch {
    return null
  }
}

export async function getLiveServices() {
  try {
    const { data, error } = await getPublicClient()
      .from('services')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) return null
    return data.map((s) => ({
      num: s.num,
      tag: s.tag,
      title: s.title,
      desc: s.description,
    }))
  } catch {
    return null
  }
}
