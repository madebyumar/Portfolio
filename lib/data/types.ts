export interface ProfileStat {
  value: string
  label: string
}

export interface Profile {
  name?: string
  role?: string
  status?: string
  bio?: string
  headline?: string
  email?: string
  github?: string
  linkedin?: string
  whatsapp?: string
  location?: string
  timezone?: string
  ianaTimezone?: string
  stats?: ProfileStat[]
}

export interface Project {
  slug: string
  title: string
  category: string
  context?: string
  img?: string
  blurb?: string
  tech?: string[]
  stat?: string
  statLabel?: string
  highlights?: string[]
  problem?: string
  solution?: string
  display_order?: number
  is_featured?: boolean
}

export interface BlogPost {
  slug: string
  title: string
  tag?: string
  date?: string
  excerpt?: string
  img?: string
  read_time?: string
  content?: string
}
