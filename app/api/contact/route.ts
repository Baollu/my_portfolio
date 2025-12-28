import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

// POST: Recevoir un nouveau message de contact
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nom, prenom, email, tel, sujet, message } = body

    // Validation
    if (!nom || !prenom || !email || !message) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    // Sauvegarder dans la base de données
    const contact = await prisma.contact.create({
      data: {
        nom,
        prenom,
        email,
        tel: tel || null,
        sujet: sujet || null,
        message,
      },
    })

    // Envoyer l'email
    try {
      await resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: process.env.CONTACT_EMAIL || 'cheng.boris@hotmail.com',
        replyTo: email,
        subject: sujet || `Nouveau message de ${nom} ${prenom}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e60012;">Nouveau message depuis votre portfolio</h2>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Nom:</strong> ${nom} ${prenom}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              ${tel ? `<p><strong>Téléphone:</strong> ${tel}</p>` : ''}
              ${sujet ? `<p><strong>Sujet:</strong> ${sujet}</p>` : ''}
            </div>
            
            <div style="background: #fff; padding: 20px; border-left: 4px solid #e60012; margin: 20px 0;">
              <h3 style="margin-top: 0;">Message:</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="color: #666; font-size: 12px; margin-top: 20px;">
              <p>Message reçu le ${new Date().toLocaleString('fr-FR')}</p>
              <p>ID: ${contact.id}</p>
            </div>
          </div>
        `,
        text: `
Nouveau message depuis votre portfolio

Nom: ${nom} ${prenom}
Email: ${email}
${tel ? `Téléphone: ${tel}` : ''}
${sujet ? `Sujet: ${sujet}` : ''}

Message:
${message}

---
Reçu le ${new Date().toLocaleString('fr-FR')}
ID: ${contact.id}
        `.trim(),
      })
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError)
      // On continue même si l'email échoue (message sauvegardé en DB)
    }

    return NextResponse.json({
      success: true,
      message: 'Message envoyé avec succès',
      id: contact.id,
    })
  } catch (error) {
    console.error('Erreur API contact:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    )
  }
}

// GET: Récupérer tous les messages (pour l'admin)
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
    console.error('Erreur GET contacts:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    )
  }
}
