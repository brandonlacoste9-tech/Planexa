import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, dayOfWeek, startTime, endTime } = body

    const availability = await prisma.availability.create({
      data: {
        userId,
        dayOfWeek: parseInt(dayOfWeek),
        startTime,
        endTime
      }
    })

    return NextResponse.json(availability)
  } catch (error) {
    console.error('Erreur lors de la création de la disponibilité:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      )
    }

    await prisma.availability.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
