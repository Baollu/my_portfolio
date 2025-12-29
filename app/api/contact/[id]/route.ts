import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    
    const contact = await prisma.contact.update({
      where: { id: params.id },
      data: { read: body.read },
    })

    return NextResponse.json({ contact })
  } catch (error) {
    console.error('PUT contact error:', error)
    return NextResponse.json(
      { error: 'Error updating contact' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.contact.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE contact error:', error)
    return NextResponse.json(
      { error: 'Error deleting contact' },
      { status: 500 }
    )
  }
}