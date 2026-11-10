import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAllowedAdminEmail } from '@/lib/auth/admin'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ ok: false, reason: 'unauthenticated' }, { status: 401 })
  }

  if (!isAllowedAdminEmail(user.email)) {
    await supabase.auth.signOut()
    return NextResponse.json({ ok: false, reason: 'forbidden' }, { status: 403 })
  }

  return NextResponse.json({ ok: true })
}
