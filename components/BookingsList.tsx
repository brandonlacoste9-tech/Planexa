'use client'

import { formatDateTimeFr } from '@/lib/date-utils'

interface Booking {
  id: string
  clientName: string
  clientEmail: string
  startTime: Date
  endTime: Date
  status: string
  notes?: string | null
}

interface BookingsListProps {
  bookings: Booking[]
}

export default function BookingsList({ bookings }: BookingsListProps) {
  if (bookings.length === 0) {
    return (
      <p className="text-gray-500 text-sm italic">
        Aucune réservation pour le moment.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="border-l-4 border-blue-500 pl-4 py-2">
          <div className="flex justify-between items-start mb-1">
            <div className="font-semibold">{booking.clientName}</div>
            <span className={`text-xs px-2 py-1 rounded ${
              booking.status === 'confirmed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {booking.status === 'confirmed' ? 'Confirmé' : 'Annulé'}
            </span>
          </div>
          <div className="text-sm text-gray-600">{booking.clientEmail}</div>
          <div className="text-sm text-gray-700 mt-1">
            {formatDateTimeFr(new Date(booking.startTime))}
          </div>
          {booking.notes && (
            <div className="text-sm text-gray-500 mt-1 italic">
              Note: {booking.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
