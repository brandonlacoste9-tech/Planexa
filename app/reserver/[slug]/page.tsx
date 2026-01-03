'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DAYS_FR, formatDateFR, formatTimeFR, formatDateShortFR } from '@/lib/utils';
import { UserProfile, Availability, TimeSlot } from '@/lib/types';

interface TimeSlotOption {
  date: Date;
  dateStr: string;
}

export default function BookingPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlotOption[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotOption | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');

  // Charger les informations de l'utilisateur
  useEffect(() => {
    fetch(`/api/users/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError('Utilisateur non trouvé');
        } else {
          setUser(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur de chargement');
        setLoading(false);
      });
  }, [slug]);

  // Générer les dates disponibles (prochains 14 jours)
  const getAvailableDates = () => {
    const dates: Date[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  // Charger les créneaux disponibles pour une date
  const loadSlotsForDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    
    if (!user) {
      setAvailableSlots([]);
      return;
    }
    
    const dayOfWeek = date.getDay();
    const availability = user.availabilities?.find((a: Availability) => a.dayOfWeek === dayOfWeek);
    
    if (!availability) {
      setAvailableSlots([]);
      return;
    }

    const slots: TimeSlotOption[] = [];
    
    availability.slots.forEach((slot: TimeSlot) => {
      const [startHour, startMin] = slot.start.split(':').map(Number);
      const [endHour, endMin] = slot.end.split(':').map(Number);
      
      const slotStart = new Date(date);
      slotStart.setHours(startHour, startMin, 0, 0);
      
      const slotEnd = new Date(date);
      slotEnd.setHours(endHour, endMin, 0, 0);
      
      // Générer des créneaux de meetingDuration minutes
      let currentTime = new Date(slotStart);
      while (currentTime < slotEnd) {
        const nextTime = new Date(currentTime);
        nextTime.setMinutes(currentTime.getMinutes() + user.meetingDuration);
        
        if (nextTime <= slotEnd) {
          slots.push({
            date: new Date(currentTime),
            dateStr: currentTime.toISOString()
          });
        }
        
        currentTime = nextTime;
      }
    });
    
    setAvailableSlots(slots);
  };

  // Soumettre la réservation
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot || !clientName || !clientEmail || !user) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          clientName,
          clientEmail,
          startTime: selectedSlot.dateStr,
        })
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setBookingSuccess(true);
      }
    } catch (err) {
      setError('Erreur lors de la réservation');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌</div>
          <div className="text-xl">{error}</div>
        </div>
      </div>
    );
  }

  if (bookingSuccess && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-4">Réservation confirmée !</h2>
          <p className="text-gray-600 mb-6">
            Votre rendez-vous avec <strong>{user.name}</strong> a été confirmé.
          </p>
          <div className="bg-gray-50 p-4 rounded mb-6">
            <p className="font-semibold">{formatDateFR(selectedSlot!.date, true)}</p>
          </div>
          <p className="text-sm text-gray-500">
            Un courriel de confirmation a été envoyé à {clientEmail}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Réserver un rendez-vous
          </h1>
          <p className="text-xl text-gray-600">
            avec {user?.name}
          </p>
        </div>

        {/* Informations */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center gap-4">
            <div className="text-primary-600 text-2xl">⏱️</div>
            <div>
              <div className="font-semibold">Durée de la rencontre</div>
              <div className="text-gray-600">{user?.meetingDuration} minutes</div>
            </div>
          </div>
        </div>

        {!selectedDate ? (
          /* Sélection de la date */
          <div>
            <h2 className="text-xl font-semibold mb-4">Choisissez une date</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {getAvailableDates().map((date, idx) => {
                const dayOfWeek = date.getDay();
                const hasAvailability = user?.availabilities?.some((a: Availability) => a.dayOfWeek === dayOfWeek);
                
                if (!hasAvailability) return null;
                
                return (
                  <button
                    key={idx}
                    onClick={() => loadSlotsForDate(date)}
                    className="bg-white hover:bg-primary-50 border-2 border-gray-200 hover:border-primary-500 p-4 rounded-lg transition-all text-left"
                  >
                    <div className="font-semibold text-gray-900">
                      {DAYS_FR[date.getDay()]}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDateShortFR(date)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : !selectedSlot ? (
          /* Sélection du créneau */
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {formatDateFR(selectedDate)}
              </h2>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-primary-600 hover:text-primary-700"
              >
                ← Changer de date
              </button>
            </div>
            
            {availableSlots.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-600">
                Aucun créneau disponible pour cette date
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSlot(slot)}
                    className="bg-white hover:bg-primary-50 border-2 border-gray-200 hover:border-primary-500 p-3 rounded-lg transition-all"
                  >
                    <div className="font-semibold text-center">
                      {formatTimeFR(slot.date)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Formulaire de réservation */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Vos informations</h2>
              <button
                onClick={() => setSelectedSlot(null)}
                className="text-primary-600 hover:text-primary-700"
              >
                ← Changer l&apos;heure
              </button>
            </div>
            
            <div className="bg-primary-50 p-4 rounded-lg mb-6">
              <div className="font-semibold text-primary-900">
                Rendez-vous sélectionné :
              </div>
              <div className="text-primary-700">
                {formatDateFR(selectedSlot.date, true)}
              </div>
            </div>

            <form onSubmit={handleBooking} className="bg-white p-6 rounded-lg shadow-md">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Votre nom *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Votre courriel *
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Confirmer la réservation
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
