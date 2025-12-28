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

    // Group by category
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
    console.error('GET skills error:', error)
    return NextResponse.json(
      { error: 'Error fetching skills' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, category, icon, order } = body

    // Validation
    if (!title || !category) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      )
    }

    const skill = await prisma.skill.create({
      data: {
        title,
        category,
        icon: icon || null,
        order: order || 0,
      },
    })

    return NextResponse.json({ skill }, { status: 201 })
  } catch (error) {
    console.error('POST skill error:', error)
    return NextResponse.json(
      { error: 'Error creating skill' },
      { status: 500 }
    )
  }
}
