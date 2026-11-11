import { NextResponse } from 'next/server'
import { buildPortfolioContext } from '@/lib/chatbot/context'
import { generateChatReply } from '@/lib/chatbot/providers'
import { getChatbotSettings } from '@/lib/chatbot/settings'
import type { ChatMessage } from '@/lib/chatbot/types'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 30

function normalizeMessages(raw: unknown, maxHistory: number): ChatMessage[] | null {
  if (!Array.isArray(raw)) return null
  const cleaned: ChatMessage[] = []

  for (const item of raw) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue
    const role = (item as { role?: unknown }).role
    const content = (item as { content?: unknown }).content
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') continue
    const trimmed = content.trim()
    if (!trimmed || trimmed.length > 2000) continue
    cleaned.push({ role, content: trimmed })
  }

  if (cleaned.length === 0) return null
  if (cleaned[cleaned.length - 1]?.role !== 'user') return null
  return cleaned.slice(-maxHistory)
}

export async function POST(request: Request) {
  try {
    const settings = await getChatbotSettings()
    if (!settings.enabled) {
      return NextResponse.json({ error: 'Chatbot is currently disabled.' }, { status: 503 })
    }

    const ip = clientIp(request)
    const limited = rateLimit(`chat:${ip}`, settings.rateLimitPerMinute, 60_000)
    if (!limited.ok) {
      return NextResponse.json(
        { error: 'Too many messages. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } }
      )
    }

    const body: unknown = await request.json().catch(() => null)
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const fields = body as Record<string, unknown>
    const messages = normalizeMessages(fields.messages, settings.maxHistoryMessages)
    if (!messages) {
      return NextResponse.json({ error: 'Send a valid chat message.' }, { status: 400 })
    }

    const sessionId =
      typeof fields.sessionId === 'string' ? fields.sessionId.trim().slice(0, 80) : ''
    const conversationId =
      typeof fields.conversationId === 'string' ? fields.conversationId.trim().slice(0, 80) : ''

    const userMessage = messages[messages.length - 1]
    const system = await buildPortfolioContext(settings)
    const { text, provider } = await generateChatReply({
      settings,
      system,
      messages,
    })

    let nextConversationId = conversationId || null
    try {
      const supabase = await createClient()
      const userAgent = request.headers.get('user-agent')?.slice(0, 400) || null

      if (!nextConversationId) {
        const { data: created, error: createError } = await supabase
          .from('chat_conversations')
          .insert([
            {
              session_id: sessionId || `anon-${ip}`,
              visitor_ip: ip === 'unknown' ? null : ip.slice(0, 64),
              user_agent: userAgent,
              message_count: 2,
              last_provider: provider,
            },
          ])
          .select('id')
          .single()

        if (!createError && created?.id) {
          nextConversationId = created.id
        }
      } else {
        await supabase
          .from('chat_conversations')
          .update({
            updated_at: new Date().toISOString(),
            last_provider: provider,
            message_count: messages.length + 1,
          })
          .eq('id', nextConversationId)
      }

      if (nextConversationId) {
        await supabase.from('chat_messages').insert([
          {
            conversation_id: nextConversationId,
            role: 'user',
            content: userMessage.content,
          },
          {
            conversation_id: nextConversationId,
            role: 'assistant',
            content: text,
            provider,
          },
        ])
      }
    } catch (logError) {
      console.error('Chat log failed:', logError)
    }

    return NextResponse.json({
      reply: text,
      provider,
      conversationId: nextConversationId,
    })
  } catch (error) {
    console.error('Chat request failed:', error)
    const raw = error instanceof Error ? error.message : ''
    let message = 'Unable to answer right now. Please try again or use the contact form.'
    if (/no API keys configured/i.test(raw)) {
      message =
        'Chat is not configured yet. Add Gemini or Groq API keys in Admin → Chatbot, then Save API keys.'
    } else if (/ACCESS_TOKEN_TYPE_UNSUPPORTED|Invalid Auth key/i.test(raw)) {
      message =
        'Your Google AI Studio AQ.… key was rejected by Google (invalid or not provisioned yet). Create a new key in AI Studio, paste it in Admin → Chatbot, or add a Groq key as backup.'
    } else if (/api key|invalid_api_key|unauthorized|PERMISSION_DENIED|401|403/i.test(raw)) {
      message =
        'Your AI API key was rejected by the provider. In Admin → Chatbot, replace it with a working Gemini (AIza… or AQ.…) or Groq key, then Save API keys.'
    } else if (/rate limit|429|quota|resource_exhausted/i.test(raw)) {
      message = 'AI provider rate limit/quota hit. Add another key in Admin → Chatbot or try again shortly.'
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
