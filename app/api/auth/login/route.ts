import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64')
      
      cookies().set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 heures
        path: '/',
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    )
  }
}