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
    console.error('Erreur GET projects:', error)
    return NextResponse.json(
      { error: 'Error to fetch project' },
      { status: 500 }
    )
  }
}

// POST: Créer un nouveau projet
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
        { error: 'Title, description and catégories required' },
        { status: 400 }
      )
    }

    // Générer un slug unique
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Vérifier l'unicité du slug
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
    console.error('Error POST project:', error)
    return NextResponse.json(
      { error: 'Error to create project' },
      { status: 500 }
    )
  }
}
