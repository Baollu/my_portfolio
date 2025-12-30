import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './i18n'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
})

function isProtectedApiRoute(pathname: string, method: string): boolean {
  if (method === 'GET') {
    if (pathname === '/api/contact') return true
    return false
  }
  
  const writeProtectedRoutes = [
    '/api/projects',
    '/api/skills',
    '/api/about',
    '/api/contact',
    '/api/skill-categories',
    '/api/project-categories',
    '/api/experiences',
    '/api/educations',
    '/api/socials',
  ]
  return writeProtectedRoutes.some(route => pathname.startsWith(route))
}

function checkCookieAuth(request: NextRequest): boolean {
  const token = request.cookies.get('auth_token')
  return !!token?.value
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api/')) {
    if (pathname.startsWith('/api/auth/')) {
      return NextResponse.next()
    }
    
    if (isProtectedApiRoute(pathname, request.method)) {
      if (!checkCookieAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }
    return NextResponse.next()
  }

  if (pathname.includes('/admin')) {
    if (!checkCookieAuth(request)) {
      const locale = pathname.split('/')[1] || defaultLocale
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)',
    '/api/:path*'
  ],
}
