import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'
import { createClient as createSupabaseJsClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/env'
import type { ChatProvider } from '@/lib/chatbot/types'

function normalizeSupabaseUrl(url: string): string {
  return url.trim().replace(/\/$/, '')
}

function createPublicSettingsClient() {
  return createSupabaseJsClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export interface ProviderApiKey {
  id: string
  label: string
  key: string
  enabled: boolean
}

export interface ChatbotApiKeysVault {
  gemini: ProviderApiKey[]
  groq: ProviderApiKey[]
}

export interface MaskedProviderApiKey {
  id: string
  label: string
  keyMasked: string
  enabled: boolean
  hasKey: boolean
}

export interface MaskedChatbotApiKeysVault {
  gemini: MaskedProviderApiKey[]
  groq: MaskedProviderApiKey[]
}

const SETTINGS_KEY = 'chatbot_api_keys'
const MAX_KEYS_PER_PROVIDER = 20

function emptyVault(): ChatbotApiKeysVault {
  return { gemini: [], groq: [] }
}

function getEncryptionSecretCandidates(): Buffer[] {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '')
  const urlRaw = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
  const materials = [
    process.env.CHATBOT_KEYS_SECRET?.trim(),
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
    // Stable app secret (preferred fallback — does not change when ADMIN_EMAILS changes)
    `portfolio-chatbot-v2::${url}`,
    urlRaw && urlRaw !== url ? `portfolio-chatbot-v2::${urlRaw}` : '',
    // Legacy materials (keep so existing encrypted keys still decrypt)
    `portfolio-chatbot::${process.env.ADMIN_EMAILS || 'dev'}::${url}`,
    `portfolio-chatbot::contact@umarshoaib.com::${url}`,
    `portfolio-chatbot::admin@umarshoaib.com::${url}`,
    `portfolio-chatbot::admin@umarshoaib.com,contact@umarshoaib.com::${url}`,
    `portfolio-chatbot::dev::${url}`,
    urlRaw
      ? `portfolio-chatbot::contact@umarshoaib.com::${urlRaw}`
      : '',
  ].filter((value): value is string => Boolean(value && value.trim()))

  const unique: string[] = []
  for (const material of materials) {
    if (!unique.includes(material)) unique.push(material)
  }
  return unique.map((material) => createHash('sha256').update(material).digest())
}

function getEncryptionSecret(): Buffer {
  return getEncryptionSecretCandidates()[0]
}

export function sanitizeApiKey(raw: string): string {
  return raw
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/^Bearer\s+/i, '')
    .replace(/\s+/g, '')
}

function encryptJson(payload: ChatbotApiKeysVault): { v: 1; iv: string; data: string } {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', getEncryptionSecret(), iv)
  const json = JSON.stringify(payload)
  const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return {
    v: 1,
    iv: iv.toString('base64'),
    data: Buffer.concat([encrypted, tag]).toString('base64'),
  }
}

function decryptJson(blob: unknown): ChatbotApiKeysVault | null {
  if (!blob || typeof blob !== 'object' || Array.isArray(blob)) return null
  const raw = blob as Record<string, unknown>
  if (raw.v !== 1 || typeof raw.iv !== 'string' || typeof raw.data !== 'string') return null

  try {
    const iv = Buffer.from(raw.iv, 'base64')
    const packed = Buffer.from(raw.data, 'base64')
    if (packed.length < 17) return null
    const tag = packed.subarray(packed.length - 16)
    const encrypted = packed.subarray(0, packed.length - 16)

    for (const secret of getEncryptionSecretCandidates()) {
      try {
        const decipher = createDecipheriv('aes-256-gcm', secret, iv)
        decipher.setAuthTag(tag)
        const json = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
        return normalizeVault(JSON.parse(json))
      } catch {
        // try next secret material
      }
    }
    return null
  } catch {
    return null
  }
}

function normalizeVault(value: unknown): ChatbotApiKeysVault {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return emptyVault()
  const raw = value as Record<string, unknown>
  return {
    gemini: normalizeKeyList(raw.gemini),
    groq: normalizeKeyList(raw.groq),
  }
}

function normalizeKeyList(value: unknown): ProviderApiKey[] {
  if (!Array.isArray(value)) return []
  const out: ProviderApiKey[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue
    const row = item as Record<string, unknown>
    const key = typeof row.key === 'string' ? sanitizeApiKey(row.key) : ''
    if (!key) continue
    out.push({
      id:
        typeof row.id === 'string' && row.id.trim()
          ? row.id.trim()
          : `k-${randomBytes(6).toString('hex')}`,
      label:
        typeof row.label === 'string' && row.label.trim()
          ? row.label.trim().slice(0, 60)
          : `Key ${out.length + 1}`,
      key: key.slice(0, 200),
      enabled: row.enabled !== false,
    })
    if (out.length >= MAX_KEYS_PER_PROVIDER) break
  }
  return out
}

export function maskApiKey(key: string): string {
  const trimmed = key.trim()
  if (trimmed.length <= 8) return '••••••••'
  return `${trimmed.slice(0, 4)}••••${trimmed.slice(-4)}`
}

export function toMaskedVault(vault: ChatbotApiKeysVault): MaskedChatbotApiKeysVault {
  const mapList = (list: ProviderApiKey[]): MaskedProviderApiKey[] =>
    list.map((item) => ({
      id: item.id,
      label: item.label,
      keyMasked: maskApiKey(item.key),
      enabled: item.enabled,
      hasKey: Boolean(item.key),
    }))

  return {
    gemini: mapList(vault.gemini),
    groq: mapList(vault.groq),
  }
}

function parseEnvKeys(value: string | undefined): string[] {
  if (!value?.trim()) return []
  return value
    .split(/[\n,]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, MAX_KEYS_PER_PROVIDER)
}

/** Keys from env vars (comma or newline separated). Always available as backup. */
export function getEnvProviderKeys(provider: ChatProvider): string[] {
  if (provider === 'gemini') {
    const fromMulti = [
      ...parseEnvKeys(process.env.GOOGLE_GENERATIVE_AI_API_KEYS),
      ...parseEnvKeys(process.env.GEMINI_API_KEYS),
    ]
    const single =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() || process.env.GEMINI_API_KEY?.trim()
    const list: string[] = []
    for (const key of fromMulti) {
      if (!list.includes(key)) list.push(key)
    }
    if (single && !list.includes(single)) list.unshift(single)
    return list.slice(0, MAX_KEYS_PER_PROVIDER)
  }

  const fromMulti = parseEnvKeys(process.env.GROQ_API_KEYS)
  const single = process.env.GROQ_API_KEY?.trim()
  const list = [...fromMulti]
  if (single && !list.includes(single)) list.unshift(single)
  return list.slice(0, MAX_KEYS_PER_PROVIDER)
}

export async function loadChatbotApiKeysVault(): Promise<ChatbotApiKeysVault> {
  try {
    // Use a cookie-free client so public chat can always read the encrypted vault.
    const supabase = createPublicSettingsClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', SETTINGS_KEY)
      .maybeSingle()

    if (error || !data?.value) {
      console.error('Chatbot keys load failed:', error?.message || 'missing row')
      return emptyVault()
    }
    const vault = decryptJson(data.value)
    if (!vault) {
      console.error('Chatbot keys decrypt failed — re-save keys in Admin → Chatbot')
      return emptyVault()
    }
    return vault
  } catch (error) {
    console.error('Chatbot keys load exception:', error)
    return emptyVault()
  }
}

export async function saveChatbotApiKeysVault(vault: ChatbotApiKeysVault): Promise<void> {
  const cleaned = normalizeVault(vault)
  const encrypted = encryptJson(cleaned)
  const supabase = await createClient()
  const { error } = await supabase.from('site_settings').upsert(
    {
      key: SETTINGS_KEY,
      value: encrypted,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'key' }
  )
  if (error) throw new Error(error.message)
}

/** Merge admin vault keys + env keys for a provider (enabled only). */
export async function getProviderApiKeys(provider: ChatProvider): Promise<string[]> {
  const vault = await loadChatbotApiKeysVault()
  const fromAdmin = (provider === 'gemini' ? vault.gemini : vault.groq)
    .filter((item) => item.enabled && item.key)
    .map((item) => item.key)

  const fromEnv = getEnvProviderKeys(provider)
  const merged: string[] = []
  for (const key of [...fromAdmin, ...fromEnv]) {
    if (!merged.includes(key)) merged.push(key)
  }
  return merged
}

export async function getProviderKeyCounts() {
  const vault = await loadChatbotApiKeysVault()
  const geminiAdmin = vault.gemini.filter((k) => k.enabled && k.key).length
  const groqAdmin = vault.groq.filter((k) => k.enabled && k.key).length
  const geminiEnv = getEnvProviderKeys('gemini').length
  const groqEnv = getEnvProviderKeys('groq').length

  return {
    geminiConfigured: geminiAdmin + geminiEnv > 0,
    groqConfigured: groqAdmin + groqEnv > 0,
    geminiCount: geminiAdmin + geminiEnv,
    groqCount: groqAdmin + groqEnv,
    geminiAdminCount: geminiAdmin,
    groqAdminCount: groqAdmin,
    geminiEnvCount: geminiEnv,
    groqEnvCount: groqEnv,
  }
}

export function applyKeyUpdates(
  existing: ChatbotApiKeysVault,
  incoming: {
    gemini?: Array<Partial<ProviderApiKey> & { key?: string; clear?: boolean }>
    groq?: Array<Partial<ProviderApiKey> & { key?: string; clear?: boolean }>
  }
): ChatbotApiKeysVault {
  return {
    gemini: mergeKeyList(existing.gemini, incoming.gemini),
    groq: mergeKeyList(existing.groq, incoming.groq),
  }
}

function mergeKeyList(
  existing: ProviderApiKey[],
  incoming?: Array<Partial<ProviderApiKey> & { key?: string; clear?: boolean }>
): ProviderApiKey[] {
  if (!incoming) return existing
  const byId = new Map(existing.map((item) => [item.id, item]))
  const next: ProviderApiKey[] = []

  for (const row of incoming) {
    if (!row || typeof row !== 'object') continue
    const id =
      typeof row.id === 'string' && row.id.trim()
        ? row.id.trim()
        : `k-${randomBytes(6).toString('hex')}`
    const prev = byId.get(id)
    const incomingKey = typeof row.key === 'string' ? sanitizeApiKey(row.key) : ''
    const keepPrevious = !incomingKey && Boolean(prev?.key) && row.clear !== true
    const key = incomingKey || (keepPrevious ? prev!.key : '')
    if (!key) continue

    next.push({
      id,
      label:
        typeof row.label === 'string' && row.label.trim()
          ? row.label.trim().slice(0, 60)
          : prev?.label || `Key ${next.length + 1}`,
      key: key.slice(0, 200),
      enabled: row.enabled !== false,
    })
    if (next.length >= MAX_KEYS_PER_PROVIDER) break
  }

  return next
}

export { MAX_KEYS_PER_PROVIDER, SETTINGS_KEY }
