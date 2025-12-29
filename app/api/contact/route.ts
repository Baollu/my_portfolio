import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, subject, message } = body

    // Validation
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      )
    }

    const contact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
      },
    })

    try {
      await resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: process.env.CONTACT_EMAIL || 'your@email.com',
        reply_to: email,
        subject: subject || `New message from ${firstName} ${lastName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e60012;">New message from your portfolio</h2>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
              ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
            </div>
            
            <div style="background: #fff; padding: 20px; border-left: 4px solid #e60012; margin: 20px 0;">
              <h3 style="margin-top: 0;">Message:</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="color: #666; font-size: 12px; margin-top: 20px;">
              <p>Received on ${new Date().toLocaleString()}</p>
              <p>ID: ${contact.id}</p>
            </div>
          </div>
        `,
        text: `
New message from your portfolio

Name: ${firstName} ${lastName}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
${subject ? `Subject: ${subject}` : ''}

Message:
${message}

---
Received on ${new Date().toLocaleString()}
ID: ${contact.id}
        `.trim(),
      })
    } catch (emailError) {
      console.error('Email send error:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      id: contact.id,
    })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Error sending message' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    const contacts = await prisma.contact.findMany({
      where: {
        ...(unreadOnly && { read: false }),
        archived: false,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    const unreadCount = await prisma.contact.count({
      where: { read: false, archived: false },
    })

    return NextResponse.json({
      contacts,
      unreadCount,
      total: contacts.length,
    })
  } catch (error) {
    console.error('GET contacts error:', error)
    return NextResponse.json(
      { error: 'Error fetching messages' },
      { status: 500 }
    )
  }
}
