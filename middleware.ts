import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './i18n'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
})

const protectedRoutes = ['/admin']

function isProtectedApiRoute(pathname: string, method: string): boolean {
  // GET requests are always public
  if (method === 'GET') {
    // Exception: viewing contact messages requires auth
    if (pathname === '/api/contact') {
      return true
    }
    return false
  }
  
  const writeProtectedRoutes = ['/api/projects', '/api/skills', '/api/about', '/api/contact']
  return writeProtectedRoutes.some(route => pathname.startsWith(route))
}

function handleAuth(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    })
  }

  try {
    const [type, credentials] = authHeader.split(' ')

    if (type !== 'Basic') {
      return new NextResponse('Invalid authentication type', { status: 401 })
    }

    const [username, password] = Buffer.from(credentials, 'base64')
      .toString()
      .split(':')

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return null
    }

    return new NextResponse('Invalid credentials', { status: 401 })
  } catch {
    return new NextResponse('Authentication error', { status: 401 })
  }
}

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.includes(route))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api/')) {
    if (isProtectedApiRoute(pathname, request.method)) {
      const authResponse = handleAuth(request)
      if (authResponse) return authResponse
    }
    return NextResponse.next()
  }

  if (isProtectedRoute(pathname)) {
    const authResponse = handleAuth(request)
    if (authResponse) return authResponse
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)',
    '/api/:path*'
  ],
}