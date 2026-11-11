import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createGroq } from '@ai-sdk/groq'
import { GoogleGenAI } from '@google/genai'
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

function isAuthKey(apiKey: string): boolean {
  return apiKey.trim().startsWith('AQ.')
}

function buildGeminiContents(system: string, messages: ChatMessage[]) {
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []

  // Fold system prompt into the first user turn — works on both Gemini API and Vertex Express.
  const history = messages.filter((m) => m.role === 'user' || m.role === 'assistant')
  if (history.length === 0) {
    contents.push({ role: 'user', parts: [{ text: system }] })
    return contents
  }

  for (let i = 0; i < history.length; i++) {
    const msg = history[i]
    const role: 'user' | 'model' = msg.role === 'assistant' ? 'model' : 'user'
    let text = msg.content
    if (i === 0 && role === 'user' && system.trim()) {
      text = `${system}\n\n---\n\nUser: ${msg.content}`
    }
    contents.push({ role, parts: [{ text }] })
  }

  return contents
}

function extractGenAiText(response: { text?: string; candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }): string {
  if (typeof response.text === 'string' && response.text.trim()) {
    return response.text.trim()
  }
  const parts = response.candidates?.[0]?.content?.parts || []
  return parts
    .map((part) => (typeof part.text === 'string' ? part.text : ''))
    .join('')
    .trim()
}

async function generateWithGoogleGenAi(
  apiKey: string,
  model: string,
  system: string,
  messages: ChatMessage[],
  vertexai: boolean
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey, vertexai })
  const response = await ai.models.generateContent({
    model,
    contents: buildGeminiContents(system, messages),
    config: {
      temperature: 0.4,
      maxOutputTokens: 500,
    },
  })
  const text = extractGenAiText(response)
  if (!text) throw new Error('Empty model response')
  return text
}

async function generateWithAiSdkGoogle(
  apiKey: string,
  model: string,
  system: string,
  messages: ChatMessage[]
): Promise<string> {
  const google = createGoogleGenerativeAI({ apiKey })
  const result = await generateText({
    model: google(model),
    system,
    messages,
    maxOutputTokens: 500,
    temperature: 0.4,
  })
  const text = result.text.trim()
  if (!text) throw new Error('Empty model response')
  return text
}

function geminiModelCandidates(preferred: string): string[] {
  const fallbacks = ['gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-2.5-flash']
  const list = [preferred, ...fallbacks]
  const unique: string[] = []
  for (const model of list) {
    const trimmed = model.trim()
    if (trimmed && !unique.includes(trimmed)) unique.push(trimmed)
  }
  return unique
}

function isModelUnavailableError(message: string): boolean {
  return /no longer available|not found for API version|is not found|404/i.test(message)
}

/**
 * Google AI Studio now issues AQ. authorization keys (and legacy AIza standard keys).
 * Try the official @google/genai SDK first (Gemini API, then Vertex Express for AQ.),
 * then fall back to the Vercel AI SDK Google provider. Also rotate models when Google
 * returns 404 for deprecated Gemini 2.x IDs.
 */
async function generateWithGemini(
  apiKey: string,
  settings: ChatbotSettings,
  system: string,
  messages: ChatMessage[]
): Promise<string> {
  const errors: string[] = []
  const models = geminiModelCandidates(settings.geminiModel)

  for (const model of models) {
    const attempts: Array<{ label: string; run: () => Promise<string> }> = [
      {
        label: `genai/${model}`,
        run: () => generateWithGoogleGenAi(apiKey, model, system, messages, false),
      },
    ]

    // AQ. keys may be bound to Agent Platform / Vertex Express instead of Gemini Developer API.
    if (isAuthKey(apiKey)) {
      attempts.push({
        label: `vertex-express/${model}`,
        run: () => generateWithGoogleGenAi(apiKey, model, system, messages, true),
      })
    }

    attempts.push({
      label: `ai-sdk/${model}`,
      run: () => generateWithAiSdkGoogle(apiKey, model, system, messages),
    })

    let modelUnavailable = false
    for (const attempt of attempts) {
      try {
        return await attempt.run()
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown Gemini error'
        errors.push(`${attempt.label}: ${message}`)
        if (isModelUnavailableError(message)) modelUnavailable = true
      }
    }

    if (!modelUnavailable) break
  }

  throw new Error(errors.join(' | '))
}

async function generateWithProviderKey(
  provider: ChatProvider,
  apiKey: string,
  settings: ChatbotSettings,
  system: string,
  messages: ChatMessage[]
): Promise<string> {
  if (provider === 'gemini') {
    return generateWithGemini(apiKey, settings, system, messages)
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
