import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const published = searchParams.get('published') !== 'false'

    const educations = await prisma.education.findMany({
      where: {
        ...(published && { published: true }),
      },
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' },
      ],
    })

    return NextResponse.json({ educations })
  } catch (error) {
    console.error('GET educations error:', error)
    return NextResponse.json(
      { error: 'Error fetching educations' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, school, location, startDate, endDate, description, order } = body

    if (!title || !school || !startDate) {
      return NextResponse.json(
        { error: 'Title, school and startDate are required' },
        { status: 400 }
      )
    }

    const education = await prisma.education.create({
      data: {
        title,
        school,
        location: location || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description: description || null,
        order: order || 0,
      },
    })

    return NextResponse.json({ education }, { status: 201 })
  } catch (error) {
    console.error('POST education error:', error)
    return NextResponse.json(
      { error: 'Error creating education' },
      { status: 500 }
    )
  }
}
