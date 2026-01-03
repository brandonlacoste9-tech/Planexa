import { NextRequest, NextResponse } from 'next/server';
import { createBooking, getUserById, isSlotAvailable } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { Booking } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, clientName, clientEmail, startTime } = body;

    // Validation
    if (!userId || !clientName || !clientEmail || !startTime) {
      return NextResponse.json(
        { error: 'Informations manquantes' },
        { status: 400 }
      );
    }

    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Calculer l'heure de fin
    const start = new Date(startTime);
    const end = new Date(start);
    end.setMinutes(start.getMinutes() + user.meetingDuration);

    // Vérifier la disponibilité
    if (!isSlotAvailable(userId, start, end)) {
      return NextResponse.json(
        { error: 'Ce créneau n\'est plus disponible' },
        { status: 409 }
      );
    }

    // Créer la réservation
    const booking: Booking = {
      id: generateId(),
      userId,
      clientName,
      clientEmail,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    const createdBooking = createBooking(booking);

    // Dans une vraie application, on enverrait ici des courriels de confirmation
    console.log('Réservation créée:', createdBooking);
    console.log(`Courriel à envoyer à ${clientEmail} et ${user.email}`);

    return NextResponse.json(createdBooking);
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
