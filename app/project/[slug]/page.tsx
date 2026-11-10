import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLiveProjectBySlug, getLiveProjects, getLiveProfile } from '@/lib/data/portfolio'
import { ProjectPageClient } from '@/components/portfolio/pages/ProjectPageClient'

export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = await getLiveProjects()
  return (projects || []).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getLiveProjectBySlug(slug)
  if (!project) return { title: 'Case study not found' }

  const description =
    project.blurb ||
    project.problem ||
    `${project.title} — full-stack & AI engineering case study by Umar Shoaib.`

  return {
    title: project.title,
    description,
    alternates: { canonical: `/project/${project.slug}` },
    openGraph: {
      title: `${project.title} — Case Study`,
      description,
      type: 'article',
      images: project.img ? [{ url: project.img }] : undefined,
    },
  }
}

export default async function ProjectCasePage({ params }: PageProps) {
  const { slug } = await params
  const [projects, profile] = await Promise.all([getLiveProjects(), getLiveProfile()])
  const project = projects?.find((p) => p.slug === slug)

  if (!project || !projects) notFound()

  return (
    <ProjectPageClient
      projects={projects}
      slug={slug}
      profile={profile || undefined}
    />
  )
}
