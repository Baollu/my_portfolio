import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id: params.id }
    })

    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ skill })
  } catch (error) {
    console.error('GET skill error:', error)
    return NextResponse.json(
      { error: 'Error fetching skill' },
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
    const { title, category, icon, order, published } = body

    const existingSkill = await prisma.skill.findUnique({
      where: { id: params.id },
    })

    if (!existingSkill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      )
    }

    const skill = await prisma.skill.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(category && { category }),
        ...(icon !== undefined && { icon }),
        ...(order !== undefined && { order }),
        ...(published !== undefined && { published }),
      },
    })

    return NextResponse.json({ skill })
  } catch (error) {
    console.error('PUT skill error:', error)
    return NextResponse.json(
      { error: 'Error updating skill' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.skill.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE skill error:', error)
    return NextResponse.json(
      { error: 'Error deleting skill' },
      { status: 500 }
    )
  }
}
