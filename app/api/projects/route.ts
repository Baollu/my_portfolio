import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured') === 'true'
    const published = searchParams.get('published') !== 'false'

    const projects = await prisma.project.findMany({
      where: {
        ...(category && { category }),
        ...(featured && { featured: true }),
        ...(published && { published: true }),
      },
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('GET projects error:', error)
    return NextResponse.json(
      { error: 'Error fetching projects' },
      { status: 500 }
    )
  }
}

// POST: Create a new project
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      title,
      description,
      shortDesc,
      tags,
      category,
      imageUrl,
      githubUrl,
      liveUrl,
      featured,
      order,
    } = body

    // Validation
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Title, description and category are required' },
        { status: 400 }
      )
    }

    // Generate unique slug
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check slug uniqueness
    let finalSlug = slug
    let counter = 1
    while (await prisma.project.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`
      counter++
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug: finalSlug,
        description,
        shortDesc: shortDesc || null,
        tags: tags || [],
        category,
        imageUrl: imageUrl || null,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        featured: featured || false,
        order: order || 0,
      },
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('POST project error:', error)
    return NextResponse.json(
      { error: 'Error creating project' },
      { status: 500 }
    )
  }
}
