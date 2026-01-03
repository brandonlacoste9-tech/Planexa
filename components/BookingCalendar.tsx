'use client'

import { useState, useEffect } from 'react'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'
import { fr } from 'date-fns/locale'

interface User {
  id: string
  name: string
  timezone: string
  availabilities: Array<{
    dayOfWeek: number
    startTime: string
    endTime: string
  }>
}

interface TimeSlot {
  time: string
  available: boolean
}

export default function BookingCalendar({ user }: { user: User }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Générer les 14 prochains jours
  const weekDays = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i))

  useEffect(() => {
    fetchAvailableSlots()
  }, [selectedDate])

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch(
        `/api/availability/slots?userId=${user.id}&date=${selectedDate.toISOString()}`
      )
      if (response.ok) {
        const slots = await response.json()
        setTimeSlots(slots)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des créneaux:', error)
    }
  }

  const handleBooking = async () => {
    if (!selectedTime || !clientName || !clientEmail) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          date: selectedDate.toISOString(),
          time: selectedTime,
          clientName,
          clientEmail,
          notes
        })
      })

      if (response.ok) {
        setShowSuccess(true)
        setClientName('')
        setClientEmail('')
        setNotes('')
        setSelectedTime('')
        fetchAvailableSlots()
      } else {
        alert('Erreur lors de la réservation')
      }
    } catch (error) {
      console.error('Erreur lors de la réservation:', error)
      alert('Erreur lors de la réservation')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Réservation confirmée!
        </h2>
        <p className="text-gray-600 mb-6">
          Un courriel de confirmation a été envoyé à {clientEmail}
        </p>
        <button
          onClick={() => setShowSuccess(false)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Faire une autre réservation
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Sélection de la date */}
      <div>
        <h3 className="font-semibold mb-4">Sélectionnez une date</h3>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate)
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`p-3 rounded-lg border text-center transition ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-xs">{format(day, 'EEE', { locale: fr })}</div>
                <div className="text-lg font-semibold">{format(day, 'd')}</div>
                <div className="text-xs">{format(day, 'MMM', { locale: fr })}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sélection de l'heure */}
      <div>
        <h3 className="font-semibold mb-4">
          Créneaux disponibles le {format(selectedDate, 'd MMMM yyyy', { locale: fr })}
        </h3>
        {timeSlots.length === 0 ? (
          <p className="text-gray-500 italic">Aucun créneau disponible pour cette date.</p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.available && setSelectedTime(slot.time)}
                disabled={!slot.available}
                className={`p-3 rounded-lg border transition ${
                  selectedTime === slot.time
                    ? 'bg-blue-600 text-white border-blue-600'
                    : slot.available
                    ? 'bg-white border-gray-200 hover:border-blue-300'
                    : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Formulaire de réservation */}
      {selectedTime && (
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Vos informations</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Courriel *
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
            </div>
            <button
              onClick={handleBooking}
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isSubmitting ? 'Réservation en cours...' : 'Confirmer la réservation'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
