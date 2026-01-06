import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/app/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    const body = await request.json()
    // Explicitly ignore body.userId if present, use authenticated user.id
    const { dayOfWeek, startTime, endTime } = body

    const availability = await prisma.availability.create({
      data: {
        userId: user.id,
        dayOfWeek: parseInt(dayOfWeek),
        startTime,
        endTime
      }
    })

    return NextResponse.json(availability)
  } catch (error: any) {
    if (error.message.includes('Unauthorized')) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Erreur lors de la création de la disponibilité:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      )
    }

    // Verify ownership
    const availability = await prisma.availability.findUnique({
        where: { id }
    });

    if (!availability) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (availability.userId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.availability.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message.includes('Unauthorized')) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Erreur lors de la suppression:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
