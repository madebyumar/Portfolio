import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createGroq } from '@ai-sdk/groq'
import { getProviderApiKeys, getProviderKeyCounts } from '@/lib/chatbot/keys'
import type { ChatMessage, ChatProvider, ChatbotSettings } from '@/lib/chatbot/types'

export async function getProviderKeyStatus() {
  return getProviderKeyCounts()
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
  // Bad request / content policy — don't burn more keys
  if (code === 400) return false
  const message = (err.message || '').toLowerCase()
  if (message.includes('safety') || message.includes('blocked')) return false
  return true
}

async function generateWithProviderKey(
  provider: ChatProvider,
  apiKey: string,
  settings: ChatbotSettings,
  system: string,
  messages: ChatMessage[]
): Promise<string> {
  if (provider === 'gemini') {
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
    const keys = await getProviderApiKeys(provider)
    if (keys.length === 0) {
      errors.push(`${provider}: no API keys configured`)
      continue
    }

    for (let k = 0; k < keys.length; k++) {
      try {
        const text = await generateWithProviderKey(
          provider,
          keys[k],
          params.settings,
          params.system,
          params.messages
        )
        if (!text) throw new Error('Empty model response')
        return { text, provider }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown provider error'
        errors.push(`${provider}[key ${k + 1}/${keys.length}]: ${message}`)
        if (!isRetryableError(error)) {
          // Stop this provider's remaining keys on hard failures
          break
        }
      }
    }
  }

  throw new Error(errors.join(' | ') || 'No AI provider available')
}
