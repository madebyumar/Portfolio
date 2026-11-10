import type { MetadataRoute } from 'next'
import { getLiveBlogs, getLiveProjects } from '@/lib/data/portfolio'
import { getSiteUrl } from '@/lib/env'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const [blogs, projects] = await Promise.all([getLiveBlogs(), getLiveProjects()])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/hire`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  const blogRoutes: MetadataRoute.Sitemap = (blogs || []).map((b) => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const projectRoutes: MetadataRoute.Sitemap = (projects || []).map((p) => ({
    url: `${base}/project/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogRoutes, ...projectRoutes]
}
