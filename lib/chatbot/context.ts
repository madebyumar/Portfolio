import {
  getLiveExperiences,
  getLiveProfile,
  getLiveProjects,
  getLiveServices,
  getLiveSkills,
} from '@/lib/data/portfolio'
import type { ChatbotSettings } from '@/lib/chatbot/types'

export async function buildPortfolioContext(settings: ChatbotSettings): Promise<string> {
  const [profile, projects, services, skills, experiences] = await Promise.all([
    getLiveProfile(),
    getLiveProjects(),
    getLiveServices(),
    getLiveSkills(),
    getLiveExperiences(),
  ])

  const lines: string[] = [
    settings.systemPrompt,
    '',
    '## Portfolio context (source of truth)',
  ]

  if (profile) {
    lines.push(
      `Name: ${profile.name || 'Umar Shoaib'}`,
      `Role: ${profile.role || 'Software Engineer'}`,
      `Status: ${profile.status || 'Available'}`,
      `Location: ${profile.location || 'Gujranwala, Pakistan'}`,
      `Timezone: ${profile.timezone || 'PKT'}`,
      `Email: ${profile.email || 'contact@umarshoaib.com'}`,
      `GitHub: ${profile.github || ''}`,
      `LinkedIn: ${profile.linkedin || ''}`,
      `WhatsApp: ${profile.whatsapp || ''}`,
      `Bio: ${profile.bio || ''}`,
      `Headline: ${profile.headline || ''}`
    )
    if (profile.stats?.length) {
      lines.push(`Stats: ${profile.stats.map((s) => `${s.value} ${s.label}`).join('; ')}`)
    }
  }

  if (services?.length) {
    lines.push('', '## Services')
    for (const service of services) {
      lines.push(`- ${service.title} (${service.tag}): ${service.desc}`)
    }
  }

  if (projects?.length) {
    lines.push('', '## Projects')
    for (const project of projects.slice(0, 8)) {
      lines.push(
        `- ${project.title} [${project.category}] — ${project.blurb || ''}`,
        `  Tech: ${(project.tech || []).join(', ')}`,
        `  Slug: /project/${project.slug}`
      )
    }
  }

  if (skills?.length) {
    lines.push('', '## Skills')
    for (const skill of skills) {
      const category =
        typeof skill === 'object' && skill && 'category' in skill ? String(skill.category) : 'Skill'
      const name =
        typeof skill === 'object' && skill && 'name' in skill ? String(skill.name) : String(skill)
      lines.push(`- ${category}: ${name}`)
    }
  }

  if (experiences?.length) {
    lines.push('', '## Experience')
    for (const exp of experiences) {
      const role =
        typeof exp === 'object' && exp && 'role' in exp ? String(exp.role || 'Role') : 'Role'
      const company =
        typeof exp === 'object' && exp && 'company' in exp ? String(exp.company || '') : ''
      const period =
        typeof exp === 'object' && exp && 'period' in exp ? String(exp.period || '') : ''
      const description =
        typeof exp === 'object' && exp && 'description' in exp && exp.description
          ? String(exp.description)
          : ''
      const bullets =
        typeof exp === 'object' && exp && 'bullets' in exp && Array.isArray(exp.bullets)
          ? exp.bullets.join(', ')
          : ''
      lines.push(
        `- ${role}${company ? ` @ ${company}` : ''}${period ? ` (${period})` : ''}`,
        description ? `  ${description}` : '',
        bullets ? `  Focus: ${bullets}` : ''
      )
    }
  }

  lines.push(
    '',
    '## Routing hints',
    '- Hire / contact: direct visitors to /hire or the contact form on the homepage.',
    '- Projects: link to /project/{slug} when relevant.',
    '- Keep answers under ~120 words unless the visitor asks for detail.'
  )

  return lines.filter(Boolean).join('\n')
}
