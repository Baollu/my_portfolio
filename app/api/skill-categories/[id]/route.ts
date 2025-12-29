import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.skillCategory.findUnique({
      where: { id: params.id },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error('GET skill category error:', error)
    return NextResponse.json(
      { error: 'Error fetching category' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { label, order } = body

    const existing = await prisma.skillCategory.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const category = await prisma.skillCategory.update({
      where: { id: params.id },
      data: {
        ...(label && { label }),
        ...(order !== undefined && { order }),
      },
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('PUT skill category error:', error)
    return NextResponse.json(
      { error: 'Error updating category' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.skillCategory.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE skill category error:', error)
    return NextResponse.json(
      { error: 'Error deleting category' },
      { status: 500 }
    )
  }
}
