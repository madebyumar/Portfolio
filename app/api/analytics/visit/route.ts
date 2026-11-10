import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { clientIp, rateLimit } from '@/lib/rate-limit'

interface GeoResult {
  country_code?: string | null
  country_name?: string | null
  city?: string | null
  region?: string | null
}

function parseReferrerHost(referrer: string | null): string | null {
  if (!referrer) return null
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '')
    return host || null
  } catch {
    return null
  }
}

function getClientIp(request: Request): string {
  const nf = request.headers.get('x-nf-client-connection-ip')
  if (nf) return nf.trim()
  return clientIp(request)
}

async function lookupGeo(ip: string, request: Request): Promise<GeoResult> {
  const headerCountry =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code')

  if (headerCountry && headerCountry !== 'XX' && headerCountry !== 'T1') {
    return {
      country_code: headerCountry.toUpperCase(),
      country_name: headerCountry.toUpperCase(),
      city: request.headers.get('x-vercel-ip-city'),
      region: request.headers.get('x-vercel-ip-country-region'),
    }
  }

  if (!ip || ip === 'unknown' || ip === '127.0.0.1' || ip === '::1') {
    return {
      country_code: 'LO',
      country_name: 'Local / Unknown',
      city: null,
      region: null,
    }
  }

  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(2500),
    })
    if (!res.ok) return {}
    const data = (await res.json()) as {
      success?: boolean
      country_code?: string
      country?: string
      city?: string
      region?: string
    }
    if (!data.success) return {}
    return {
      country_code: data.country_code || null,
      country_name: data.country || null,
      city: data.city || null,
      region: data.region || null,
    }
  } catch {
    return {}
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const limited = rateLimit(`visit:${ip}`, 30, 60_000)
    if (!limited.ok) {
      return NextResponse.json({ ok: true, skipped: 'rate_limit' })
    }

    const body: unknown = await request.json().catch(() => null)
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const fields = body as Record<string, unknown>
    const path = typeof fields.path === 'string' ? fields.path.trim().slice(0, 300) : ''
    const referrer = typeof fields.referrer === 'string' ? fields.referrer.trim().slice(0, 500) : ''
    const sessionId =
      typeof fields.sessionId === 'string' ? fields.sessionId.trim().slice(0, 80) : ''
    const userAgent =
      typeof fields.userAgent === 'string'
        ? fields.userAgent.trim().slice(0, 400)
        : request.headers.get('user-agent')?.slice(0, 400) || ''

    if (!path || !path.startsWith('/') || path.startsWith('/admin') || path.startsWith('/api')) {
      return NextResponse.json({ ok: true, skipped: 'path' })
    }

    const supabase = await createClient()

    // Soft dedupe: same session + path within 30 minutes
    if (sessionId) {
      const since = new Date(Date.now() - 30 * 60 * 1000).toISOString()
      const { data: existing } = await supabase
        .from('page_visits')
        .select('id')
        .eq('session_id', sessionId)
        .eq('path', path)
        .gte('created_at', since)
        .limit(1)

      if (existing && existing.length > 0) {
        return NextResponse.json({ ok: true, skipped: 'dedupe' })
      }
    }

    const geo = await lookupGeo(ip, request)
    const referrerHost = parseReferrerHost(referrer || null)

    const { error } = await supabase.from('page_visits').insert([
      {
        path,
        referrer: referrer || null,
        referrer_host: referrerHost,
        country_code: geo.country_code || null,
        country_name: geo.country_name || null,
        city: geo.city || null,
        region: geo.region || null,
        user_agent: userAgent || null,
        session_id: sessionId || null,
      },
    ])

    if (error) {
      console.error('Visit insert failed:', error)
      return NextResponse.json({ error: 'Unable to record visit' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Visit tracking failed:', err)
    return NextResponse.json({ error: 'Unable to process visit' }, { status: 500 })
  }
}
