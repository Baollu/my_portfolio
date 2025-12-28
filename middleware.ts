import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// Routes qui nécessitent une authentification
const protectedRoutes = [
  '/admin',
  '/api/projects',
  '/api/skills',
  '/api/contact', // Pour GET (voir les messages)
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtectedRoute = protectedRoutes.some(route => {
    if (route === '/api/contact') {
      return pathname.startsWith(route) && request.method === 'GET'
    }
    return pathname.startsWith(route)
  })

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return new NextResponse("Authentification required", {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
    })
  }

  try {
    const [type, credentials] = authHeader.split(' ')

    if (type !== 'Basic') {
        return new NextResponse('invalide authentification', {status: 401})
    }

    const [username, password] = Buffer.from(credentials, 'base64')
      .toString()
      .split(':')

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

    if (username === ADMIN_USERNAME && password == ADMIN_PASSWORD) {
        return NextResponse.next()
    }

    return new NextResponse('Identifiants invalides', { status: 401 })
    } catch (error) {
        return new NextResponse('Erreur d\'authentification', { status: 401 })
    }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/projects/:path*',
    '/api/skills/:path*',
    '/api/contact',
  ],
}
