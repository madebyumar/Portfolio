import { createClient } from '@/lib/supabase/server'
import {
  asChatbotSettings,
  DEFAULT_CHATBOT_SETTINGS,
  type ChatbotSettings,
} from '@/lib/chatbot/types'

export async function getChatbotSettings(): Promise<ChatbotSettings> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'chatbot')
      .single()

    if (error || !data?.value) return { ...DEFAULT_CHATBOT_SETTINGS }
    return asChatbotSettings(data.value)
  } catch {
    return { ...DEFAULT_CHATBOT_SETTINGS }
  }
}
