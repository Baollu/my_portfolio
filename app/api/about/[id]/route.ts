import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const section = await prisma.aboutSection.findUnique({
      where: { id: params.id },
    })

    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ section })
  } catch (error) {
    console.error('GET about section error:', error)
    return NextResponse.json(
      { error: 'Error fetching section' },
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
    const { title, content, order, published } = body

    const existingSection = await prisma.aboutSection.findUnique({
      where: { id: params.id },
    })

    if (!existingSection) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      )
    }

    const section = await prisma.aboutSection.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(order !== undefined && { order }),
        ...(published !== undefined && { published }),
      },
    })

    return NextResponse.json({ section })
  } catch (error) {
    console.error('PUT about section error:', error)
    return NextResponse.json(
      { error: 'Error updating section' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.aboutSection.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE about section error:', error)
    return NextResponse.json(
      { error: 'Error deleting section' },
      { status: 500 }
    )
  }
}
