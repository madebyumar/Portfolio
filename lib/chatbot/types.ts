export type ChatProvider = 'gemini' | 'groq'

export interface ChatbotSettings {
  enabled: boolean
  widgetTitle: string
  welcomeMessage: string
  placeholder: string
  suggestedQuestions: string[]
  systemPrompt: string
  primaryProvider: ChatProvider
  fallbackEnabled: boolean
  geminiModel: string
  groqModel: string
  maxHistoryMessages: number
  rateLimitPerMinute: number
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface PublicChatbotConfig {
  enabled: boolean
  widgetTitle: string
  welcomeMessage: string
  placeholder: string
  suggestedQuestions: string[]
}

export const DEFAULT_CHATBOT_SETTINGS: ChatbotSettings = {
  enabled: true,
  widgetTitle: "Ask Umar's assistant",
  welcomeMessage:
    "Hi! I can answer questions about Umar's skills, projects, and how to hire him. What would you like to know?",
  placeholder: 'Ask about projects, skills, hire…',
  suggestedQuestions: [
    'What services do you offer?',
    'Show me your best projects',
    'How can I hire you?',
  ],
  systemPrompt:
    "You are the portfolio assistant for Umar Shoaib, a software engineer specializing in full-stack and AI. Answer only using the provided portfolio context. Be concise, friendly, and professional. If asked about pricing, suggest contacting via the hire form or email. Never invent employers, clients, or credentials. If you do not know, say so and point them to the contact section.",
  primaryProvider: 'gemini',
  fallbackEnabled: true,
  geminiModel: 'gemini-3.6-flash',
  groqModel: 'llama-3.3-70b-versatile',
  maxHistoryMessages: 12,
  rateLimitPerMinute: 10,
}

export function asChatbotSettings(value: unknown): ChatbotSettings {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ...DEFAULT_CHATBOT_SETTINGS }
  }

  const raw = value as Record<string, unknown>
  const suggested = Array.isArray(raw.suggestedQuestions)
    ? raw.suggestedQuestions.filter((q): q is string => typeof q === 'string' && q.trim().length > 0)
    : DEFAULT_CHATBOT_SETTINGS.suggestedQuestions

  const primary =
    raw.primaryProvider === 'groq' || raw.primaryProvider === 'gemini'
      ? raw.primaryProvider
      : DEFAULT_CHATBOT_SETTINGS.primaryProvider

  return {
    enabled: raw.enabled !== false,
    widgetTitle:
      typeof raw.widgetTitle === 'string' && raw.widgetTitle.trim()
        ? raw.widgetTitle.trim()
        : DEFAULT_CHATBOT_SETTINGS.widgetTitle,
    welcomeMessage:
      typeof raw.welcomeMessage === 'string' && raw.welcomeMessage.trim()
        ? raw.welcomeMessage.trim()
        : DEFAULT_CHATBOT_SETTINGS.welcomeMessage,
    placeholder:
      typeof raw.placeholder === 'string' && raw.placeholder.trim()
        ? raw.placeholder.trim()
        : DEFAULT_CHATBOT_SETTINGS.placeholder,
    suggestedQuestions: suggested.length > 0 ? suggested.slice(0, 6) : DEFAULT_CHATBOT_SETTINGS.suggestedQuestions,
    systemPrompt:
      typeof raw.systemPrompt === 'string' && raw.systemPrompt.trim()
        ? raw.systemPrompt.trim()
        : DEFAULT_CHATBOT_SETTINGS.systemPrompt,
    primaryProvider: primary,
    fallbackEnabled: raw.fallbackEnabled !== false,
    geminiModel:
      typeof raw.geminiModel === 'string' && raw.geminiModel.trim()
        ? raw.geminiModel.trim()
        : DEFAULT_CHATBOT_SETTINGS.geminiModel,
    groqModel:
      typeof raw.groqModel === 'string' && raw.groqModel.trim()
        ? raw.groqModel.trim()
        : DEFAULT_CHATBOT_SETTINGS.groqModel,
    maxHistoryMessages: clampInt(raw.maxHistoryMessages, 4, 24, DEFAULT_CHATBOT_SETTINGS.maxHistoryMessages),
    rateLimitPerMinute: clampInt(raw.rateLimitPerMinute, 3, 60, DEFAULT_CHATBOT_SETTINGS.rateLimitPerMinute),
  }
}

export function toPublicChatbotConfig(settings: ChatbotSettings): PublicChatbotConfig {
  return {
    enabled: settings.enabled,
    widgetTitle: settings.widgetTitle,
    welcomeMessage: settings.welcomeMessage,
    placeholder: settings.placeholder,
    suggestedQuestions: settings.suggestedQuestions,
  }
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, Math.round(n)))
}
