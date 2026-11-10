import { getAdminEmails } from '@/lib/env'

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const allowlist = getAdminEmails()
  if (allowlist.length === 0) {
    // Local/dev convenience — production must set ADMIN_EMAILS
    return process.env.NODE_ENV !== 'production'
  }
  return allowlist.includes(email.trim().toLowerCase())
}
