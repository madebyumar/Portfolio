/**
 * IMPORTANT: Next.js only inlines NEXT_PUBLIC_* values when accessed as
 * static property reads (process.env.NEXT_PUBLIC_FOO). Dynamic process.env[name]
 * is undefined in the browser bundle.
 */

export function getSupabaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  if (!value) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL')
  }
  return value
}

export function getSupabaseAnonKey(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!value) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  return value
}

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  if (process.env.URL) return process.env.URL.replace(/\/$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`
  return 'http://localhost:3000'
}

/** Comma-separated admin emails. Empty list = allow any auth user outside production. */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}
