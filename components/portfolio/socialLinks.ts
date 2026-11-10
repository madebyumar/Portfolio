const defaults = {
  github: 'https://github.com/madebyumar',
  linkedin: 'https://www.linkedin.com/in/umar-shoaib20',
  whatsapp: 'https://wa.me/923030890952',
}

export function socialLink(kind: keyof typeof defaults, value?: string) {
  if (!value) return defaults[kind]
  const trimmed = value.trim().replace(/\/+$/, '')
  if (kind === 'github' && trimmed === 'https://github.com') return defaults.github
  if (kind === 'linkedin' && (trimmed === 'https://www.linkedin.com' || trimmed === 'https://linkedin.com')) return defaults.linkedin
  if (kind === 'whatsapp' && trimmed === 'https://wa.me/923000000000') return defaults.whatsapp
  return value
}
