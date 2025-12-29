import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.projectCategory.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('GET project categories error:', error)
    return NextResponse.json(
      { error: 'Error fetching categories' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { key, label, order } = body

    if (!key || !label) {
      return NextResponse.json(
        { error: 'Key and label are required' },
        { status: 400 }
      )
    }

    const category = await prisma.projectCategory.create({
      data: {
        key,
        label,
        order: order || 0,
      },
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error('POST project category error:', error)
    return NextResponse.json(
      { error: 'Error creating category' },
      { status: 500 }
    )
  }
}
