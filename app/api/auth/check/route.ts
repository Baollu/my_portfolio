import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const token = cookies().get('auth_token')
  
  if (token) {
    return NextResponse.json({ authenticated: true })
  }
  
  return NextResponse.json({ authenticated: false })
}