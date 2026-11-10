import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createGroq } from '@ai-sdk/groq'
import type { ChatMessage, ChatProvider, ChatbotSettings } from '@/lib/chatbot/types'

export function getProviderKeyStatus() {
  return {
    geminiConfigured: Boolean(
      process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() || process.env.GEMINI_API_KEY?.trim()
    ),
    groqConfigured: Boolean(process.env.GROQ_API_KEY?.trim()),
  }
}

function geminiApiKey(): string | null {
  return process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() || process.env.GEMINI_API_KEY?.trim() || null
}

function groqApiKey(): string | null {
  return process.env.GROQ_API_KEY?.trim() || null
}

function providerOrder(settings: ChatbotSettings): ChatProvider[] {
  const primary = settings.primaryProvider
  const secondary: ChatProvider = primary === 'gemini' ? 'groq' : 'gemini'
  if (!settings.fallbackEnabled) return [primary]
  return [primary, secondary]
}

function isRetryableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return true
  const err = error as { statusCode?: number; status?: number; message?: string }
  const code = err.statusCode ?? err.status
  if (code === 400 || code === 401 || code === 403) return false
  const message = (err.message || '').toLowerCase()
  if (message.includes('api key') || message.includes('invalid_api_key')) return false
  return true
}

async function generateWithProvider(
  provider: ChatProvider,
  settings: ChatbotSettings,
  system: string,
  messages: ChatMessage[]
): Promise<string> {
  if (provider === 'gemini') {
    const apiKey = geminiApiKey()
    if (!apiKey) throw new Error('Gemini API key is not configured')
    const google = createGoogleGenerativeAI({ apiKey })
    const result = await generateText({
      model: google(settings.geminiModel),
      system,
      messages,
      maxOutputTokens: 500,
      temperature: 0.4,
    })
    return result.text.trim()
  }

  const apiKey = groqApiKey()
  if (!apiKey) throw new Error('Groq API key is not configured')
  const groq = createGroq({ apiKey })
  const result = await generateText({
    model: groq(settings.groqModel),
    system,
    messages,
    maxOutputTokens: 500,
    temperature: 0.4,
  })
  return result.text.trim()
}

export async function generateChatReply(params: {
  settings: ChatbotSettings
  system: string
  messages: ChatMessage[]
}): Promise<{ text: string; provider: ChatProvider }> {
  const order = providerOrder(params.settings)
  const errors: string[] = []

  for (let i = 0; i < order.length; i++) {
    const provider = order[i]
    const status = getProviderKeyStatus()
    if (provider === 'gemini' && !status.geminiConfigured) {
      errors.push('Gemini key missing')
      continue
    }
    if (provider === 'groq' && !status.groqConfigured) {
      errors.push('Groq key missing')
      continue
    }

    try {
      const text = await generateWithProvider(provider, params.settings, params.system, params.messages)
      if (!text) throw new Error('Empty model response')
      return { text, provider }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown provider error'
      errors.push(`${provider}: ${message}`)
      const hasNext = i < order.length - 1
      if (!hasNext || !isRetryableError(error)) {
        break
      }
    }
  }

  throw new Error(errors.join(' | ') || 'No AI provider available')
}
