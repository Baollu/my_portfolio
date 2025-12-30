import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = searchParams.get('limit')
    const published = searchParams.get('published') !== 'false'

    const experiences = await prisma.experience.findMany({
      where: {
        ...(published && { published: true }),
      },
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' },
      ],
      ...(limit && { take: parseInt(limit) }),
    })

    return NextResponse.json({ experiences })
  } catch (error) {
    console.error('GET experiences error:', error)
    return NextResponse.json(
      { error: 'Error fetching experiences' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, company, location, type, startDate, endDate, description, skills, order } = body

    if (!title || !company || !startDate || !description) {
      return NextResponse.json(
        { error: 'Title, company, startDate and description are required' },
        { status: 400 }
      )
    }

    const experience = await prisma.experience.create({
      data: {
        title,
        company,
        location: location || null,
        type: type || 'stage',
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
        skills: skills || [],
        order: order || 0,
      },
    })

    return NextResponse.json({ experience }, { status: 201 })
  } catch (error) {
    console.error('POST experience error:', error)
    return NextResponse.json(
      { error: 'Error creating experience' },
      { status: 500 }
    )
  }
}
