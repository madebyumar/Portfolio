import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    revalidatePath('/', 'layout')
    revalidatePath('/')
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Revalidate failed:', err)
    return NextResponse.json({ error: 'Unable to revalidate' }, { status: 500 })
  }
}
