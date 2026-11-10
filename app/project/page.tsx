import { redirect } from 'next/navigation'
import { getLiveProjects } from '@/lib/data/portfolio'

export const revalidate = 60

export default async function ProjectIndexPage() {
  const projects = await getLiveProjects()
  if (projects?.[0]?.slug) {
    redirect(`/project/${projects[0].slug}`)
  }
  redirect('/#projects')
}
