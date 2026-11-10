import { NextResponse } from 'next/server'
import { isAllowedAdminEmail } from '@/lib/auth/admin'
import {
  applyKeyUpdates,
  loadChatbotApiKeysVault,
  saveChatbotApiKeysVault,
  toMaskedVault,
  type ProviderApiKey,
} from '@/lib/chatbot/keys'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !isAllowedAdminEmail(user.email)) return null
  return user
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const vault = await loadChatbotApiKeysVault()
  return NextResponse.json({ keys: toMaskedVault(vault) })
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const fields = body as {
    gemini?: Array<Partial<ProviderApiKey> & { key?: string; clear?: boolean }>
    groq?: Array<Partial<ProviderApiKey> & { key?: string; clear?: boolean }>
  }

  try {
    const existing = await loadChatbotApiKeysVault()
    const next = applyKeyUpdates(existing, {
      gemini: fields.gemini,
      groq: fields.groq,
    })
    await saveChatbotApiKeysVault(next)
    return NextResponse.json({ ok: true, keys: toMaskedVault(next) })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save keys'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
