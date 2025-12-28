import { NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams} = new URL(req.url)
    const published = searchParams.get('published') !== 'false'

    const sections = await prisma.aboutSection.findMany({
      where: {
        ...(published && {published: true}),
      },
      orderBy: [
        {order: 'asc'},
        {createdAt: 'asc'},
      ],
    })

    return NextResponse.json({sections})
  } catch (error) {
    console.error('Error GET about:', error)
    return NextResponse.json(
      {error: 'Error to fectch sections'},
      {status: 500}
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {key, title, content, order } = body

    if (!key || !title || !content){
      return NextResponse.json(
        {error: 'Key, title and content required'},
        {status: 400}
      )
    }

    const section = await prisma.aboutSection.create({
      data: {
        key,
        title,
        content,
        order: order || 0,
      },
    })

    return NextResponse.json({section}, {status: 201})
  } catch (error) {
    console.error("Error POST about:", error)
    return NextResponse.json(
      {error: "Error to create the section"},
      {status: 500}
    )
  }
}
