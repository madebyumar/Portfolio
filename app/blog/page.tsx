import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getLiveBlogs, getLiveProfile } from '@/lib/data/portfolio'
import { BlogPageClient } from '@/components/portfolio/pages/BlogPageClient'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog & Writing',
  description:
    'Technical articles on Laravel, Python, AI integration, and systems architecture by Umar Shoaib.',
  alternates: { canonical: '/blog' },
}

export default async function BlogPage() {
  const [liveBlogs, liveProfile] = await Promise.all([getLiveBlogs(), getLiveProfile()])

  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg)' }} />}>
      <BlogPageClient blogs={liveBlogs || []} profile={liveProfile || undefined} />
    </Suspense>
  )
}
