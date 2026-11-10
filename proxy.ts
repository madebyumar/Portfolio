import type { NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/session'

export function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|scripts/|uploads/|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
