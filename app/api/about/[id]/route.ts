import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

export async function GET(
  req: Request,
  { params }: {params: {id: string}}
) {
  try {
    const section = await prisma.aboutSection.findUnique({
      where: {id: params.id},
    })

    if (!section) {
      return NextResponse.json(
        { error: 'Section not found'},
        { status: 404 }
      )
    }

    return NextResponse.json({ section })
  } catch (error) {
    console.error('Error to get the about section: ', error)
    return NextResponse.json(
      { error: 'Error to fetch section'},
      { status: 500}
    )
  }
}

export async function PUT(
  req:Request,
  { params }: { params: {id:string}}
) {
  try {
    const body = await req.json()
    const { title, content, order, published } = body

    const existingSection = await prisma.aboutSection.findUnique({
      where: {id: params.id},
    })

    if (!existingSection) {
      return NextResponse.json(
        { error: 'Section not found'},
        {status: 404}
      )
    }

    const section = await prisma.aboutSection.update({
      where: {id: params.id},
      data: {
        ...(title && {title}),
        ...(content && {content }),
        ...(order !== undefined && {order}),
        ...(published !== undefined && {published}),
      },
    })

    return NextResponse.json({section})
  } catch (error) {
    console.error('Error PUT about section:', error)
    return NextResponse.json(
      { error: 'Error to maj the section'},
      {status: 500}
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: {params: {id: string}}
) {
  try {
    await prisma.aboutSection.delete({
      where: {id: params.id},
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error DELETE about section:", error)
    return NextResponse.json(
      {error: 'Error to delete the section'},
      {status: 500}
    )
  }
}
