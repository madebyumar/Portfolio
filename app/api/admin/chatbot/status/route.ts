import { NextResponse } from 'next/server'
import { isAllowedAdminEmail } from '@/lib/auth/admin'
import { getProviderKeyStatus } from '@/lib/chatbot/providers'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAllowedAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const status = await getProviderKeyStatus()
  return NextResponse.json(status)
}
