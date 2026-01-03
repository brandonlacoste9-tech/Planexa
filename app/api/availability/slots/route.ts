import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseTime, setTime } from '@/lib/date-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const dateStr = searchParams.get('date')

    if (!userId || !dateStr) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    const date = new Date(dateStr)
    const dayOfWeek = date.getDay()

    // Récupérer les disponibilités pour ce jour
    const availabilities = await prisma.availability.findMany({
      where: {
        userId,
        dayOfWeek
      }
    })

    if (availabilities.length === 0) {
      return NextResponse.json([])
    }

    // Récupérer les réservations existantes pour cette date
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const existingBookings = await prisma.booking.findMany({
      where: {
        userId,
        startTime: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: 'confirmed'
      }
    })

    // Générer les créneaux de 30 minutes
    const slots = []
    const slotDuration = 30 // minutes

    for (const availability of availabilities) {
      const start = parseTime(availability.startTime)
      const end = parseTime(availability.endTime)

      let currentMinutes = start.hours * 60 + start.minutes
      const endMinutes = end.hours * 60 + end.minutes

      while (currentMinutes < endMinutes) {
        const hours = Math.floor(currentMinutes / 60)
        const minutes = currentMinutes % 60
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

        const slotStart = setTime(date, timeStr)
        const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000)

        // Vérifier si le créneau est dans le passé
        const isPast = slotStart < new Date()

        // Vérifier si le créneau est déjà réservé
        const isBooked = existingBookings.some(booking => {
          const bookingStart = new Date(booking.startTime)
          const bookingEnd = new Date(booking.endTime)
          return (
            (slotStart >= bookingStart && slotStart < bookingEnd) ||
            (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
            (slotStart <= bookingStart && slotEnd >= bookingEnd)
          )
        })

        slots.push({
          time: timeStr,
          available: !isPast && !isBooked
        })

        currentMinutes += slotDuration
      }
    }

    // Trier les créneaux par heure
    slots.sort((a, b) => a.time.localeCompare(b.time))

    return NextResponse.json(slots)
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
