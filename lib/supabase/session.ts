import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { CookieOptions } from '@supabase/ssr'
import { isAllowedAdminEmail } from '@/lib/auth/admin'
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/env'

interface CookieToSet {
  name: string
  value: string
  options?: CookieOptions
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // IMPORTANT: use getUser() — never trust getSession() alone for authz
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login'
  const allowed = isAllowedAdminEmail(user?.email)

  // Legacy query-param URLs → clean slug routes
  if (pathname === '/blog') {
    const legacy = request.nextUrl.searchParams.get('b')
    if (legacy) {
      const url = request.nextUrl.clone()
      url.pathname = `/blog/${encodeURIComponent(legacy)}`
      url.search = ''
      return NextResponse.redirect(url, 308)
    }
  }

  if (pathname === '/project') {
    const legacy = request.nextUrl.searchParams.get('p')
    if (legacy) {
      const url = request.nextUrl.clone()
      url.pathname = `/project/${encodeURIComponent(legacy)}`
      url.search = ''
      return NextResponse.redirect(url, 308)
    }
  }

  if (isAdminRoute) {
    if (!user || !allowed) {
      if (user && !allowed) {
        await supabase.auth.signOut()
      }
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  if (pathname === '/admin/login' && user && allowed) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
