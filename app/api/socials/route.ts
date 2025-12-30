import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const links = await prisma.socialLink.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ links })
  } catch (error) {
    console.error('GET social links error:', error)
    return NextResponse.json(
      { error: 'Error fetching social links' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { platform, url, icon, order } = body

    if (!platform || !url) {
      return NextResponse.json(
        { error: 'Platform and URL are required' },
        { status: 400 }
      )
    }

    const link = await prisma.socialLink.create({
      data: {
        platform,
        url,
        icon: icon || null,
        order: order || 0,
      },
    })

    return NextResponse.json({ link }, { status: 201 })
  } catch (error) {
    console.error('POST social link error:', error)
    return NextResponse.json(
      { error: 'Error creating social link' },
      { status: 500 }
    )
  }
}
