import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const published = searchParams.get('published') !== 'false'

    const skills = await prisma.skill.findMany({
      where: {
        ...(category && { category }),
        ...(published && { published: true }),
      },
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
        { title: 'asc' },
      ],
    })

    // Grouper par catégorie
    const groupedSkills = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    }, {} as Record<string, typeof skills>)

    return NextResponse.json({
      skills,
      groupedSkills,
    })
  } catch (error) {
    console.error('Error GET skills:', error)
    return NextResponse.json(
      { error: 'Error to fetch skills' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, category, rating, icon, order } = body

    // Validation
    if (!title || !category) {
      return NextResponse.json(
        { error: 'Title and category required' },
        { status: 400 }
      )
    }

    if (rating !== undefined && (rating < 0 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 0 and 5' },
        { status: 400 }
      )
    }

    const skill = await prisma.skill.create({
      data: {
        title,
        category,
        rating: rating || 0,
        icon: icon || null,
        order: order || 0,
      },
    })

    return NextResponse.json({ skill }, { status: 201 })
  } catch (error) {
    console.error('Error POST skill:', error)
    return NextResponse.json(
      { error: 'Error to create skills' },
      { status: 500 }
    )
  }
}
