import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { setTime } from '@/lib/date-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, date, time, clientName, clientEmail, notes } = body

    // Créer la date de début
    const bookingDate = new Date(date)
    const startTime = setTime(bookingDate, time)
    
    // 30 minutes de durée par défaut
    const duration = 30
    const endTime = new Date(startTime.getTime() + duration * 60000)

    // Vérifier qu'il n'y a pas de conflit
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        userId,
        status: 'confirmed',
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          }
        ]
      }
    })

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Ce créneau n\'est plus disponible' },
        { status: 409 }
      )
    }

    // Créer la réservation
    const booking = await prisma.booking.create({
      data: {
        userId,
        clientName,
        clientEmail,
        startTime,
        endTime,
        duration,
        notes: notes || null,
        status: 'confirmed'
      }
    })

    // TODO: Envoyer un email de confirmation
    // Pour l'instant, on simule l'envoi
    console.log('Email de confirmation envoyé à:', clientEmail)

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la réservation' },
      { status: 500 }
    )
  }
}
