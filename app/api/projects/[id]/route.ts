import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'
import { error } from "console";

export async function GET(
  req: Request,
  {params}: {params: {id: string}}
) {
  try {
    const project = await prisma.project.findUnique({
      where: {id: params.id}
    })

    if (!project) {
      return NextResponse.json(
        {error: 'project not found'},
        {status: 404}
      )
    }

    return NextResponse.json({project})
  } catch (error) {
    console.error("Error GET project:", error)
    return NextResponse.json(
      { error: "Error to fetch project"},
      {status: 500}
    )
  }
}

export async function PUT(
  req: Request,
  {params}: {params: {id: string}}
) {
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
      published,
    } = body

    const existingProject = await prisma.project.findUnique({
      where: {id: params.id},
    })

    if (!existingProject) {
      return NextResponse.json(
        {error: 'Project not found'},
        {status: 404}
      )
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(shortDesc !== undefined && { shortDesc }),
        ...(tags && { tags }),
        ...(category && { category }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(liveUrl !== undefined && { liveUrl }),
        ...(featured !== undefined && { featured }),
        ...(order !== undefined && { order }),
        ...(published !== undefined && { published }),
      },
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Error PUT project:', error)
    return NextResponse.json(
      { error: 'Error to maj project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.project.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE project:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du projet' },
      { status: 500 }
    )
  }
}
