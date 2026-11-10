import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLiveBlogBySlug, getLiveBlogs, getLiveProfile } from '@/lib/data/portfolio'
import { BlogArticleClient } from '@/components/portfolio/pages/BlogArticleClient'

export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const blogs = await getLiveBlogs()
  return (blogs || []).map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getLiveBlogBySlug(slug)
  if (!post) return { title: 'Article not found' }

  return {
    title: post.title,
    description: post.excerpt || `${post.title} — technical writing by Umar Shoaib.`,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      images: post.img ? [{ url: post.img }] : undefined,
    },
  }
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params
  const [post, profile] = await Promise.all([getLiveBlogBySlug(slug), getLiveProfile()])

  if (!post) notFound()

  return <BlogArticleClient post={post} profile={profile || undefined} />
}
