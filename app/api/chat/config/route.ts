import { NextResponse } from 'next/server'
import { getChatbotSettings } from '@/lib/chatbot/settings'
import { toPublicChatbotConfig } from '@/lib/chatbot/types'

export const runtime = 'nodejs'

export async function GET() {
  const settings = await getChatbotSettings()
  return NextResponse.json(toPublicChatbotConfig(settings), {
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  })
}
