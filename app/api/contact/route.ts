import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { clientIp, rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = clientIp(request)
    const limited = rateLimit(`contact:${ip}`, 5, 60_000)
    if (!limited.ok) {
      return NextResponse.json(
        { error: 'Too many messages. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } }
      )
    }

    const body: unknown = await request.json()
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid message.' }, { status: 400 })
    }

    const fields = body as Record<string, unknown>

    // Honeypot — bots fill hidden fields; humans leave it empty
    const honeypot = typeof fields.company === 'string' ? fields.company.trim() : ''
    if (honeypot) {
      return NextResponse.json({ success: true })
    }

    const name = typeof fields.name === 'string' ? fields.name.trim() : ''
    const email = typeof fields.email === 'string' ? fields.email.trim() : ''
    const subject = typeof fields.subject === 'string' ? fields.subject.trim() : ''
    const message = typeof fields.message === 'string' ? fields.message.trim() : ''

    if (
      !name ||
      !email ||
      !message ||
      name.length > 120 ||
      email.length > 254 ||
      subject.length > 200 ||
      message.length > 5000 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: 'Enter a valid name, email, and message within the length limits.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { error } = await supabase.from('contact_messages').insert([
      {
        name,
        email,
        subject: subject || null,
        message,
      },
    ])

    if (error) {
      console.error('Contact message insert failed:', error)
      return NextResponse.json({ error: 'Unable to send your message right now.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('Contact message request failed:', err)
    return NextResponse.json({ error: 'Unable to process your message right now.' }, { status: 500 })
  }
}
