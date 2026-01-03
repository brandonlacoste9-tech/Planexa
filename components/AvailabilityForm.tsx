'use client'

import { useState } from 'react'
import { getDayNameFr } from '@/lib/date-utils'

interface Availability {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

interface AvailabilityFormProps {
  userId: string
  existingAvailabilities: Availability[]
}

export default function AvailabilityForm({ userId, existingAvailabilities }: AvailabilityFormProps) {
  const [availabilities, setAvailabilities] = useState<Availability[]>(existingAvailabilities)
  const [newAvailability, setNewAvailability] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAdd = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAvailability, userId })
      })
      
      if (response.ok) {
        const created = await response.json()
        setAvailabilities([...availabilities, created])
        setNewAvailability({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' })
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/availability?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setAvailabilities(availabilities.filter(a => a.id !== id))
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  return (
    <div>
      {/* Liste des disponibilités existantes */}
      <div className="mb-6 space-y-2">
        {availabilities.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            Aucune disponibilité configurée. Ajoutez-en une ci-dessous.
          </p>
        ) : (
          availabilities.map((avail) => (
            <div key={avail.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-semibold">{getDayNameFr(avail.dayOfWeek)}</span>
                <span className="text-gray-600 ml-3">
                  {avail.startTime} - {avail.endTime}
                </span>
              </div>
              <button
                onClick={() => handleDelete(avail.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Supprimer
              </button>
            </div>
          ))
        )}
      </div>

      {/* Formulaire d'ajout */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Ajouter une disponibilité</h3>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jour de la semaine
            </label>
            <select
              value={newAvailability.dayOfWeek}
              onChange={(e) => setNewAvailability({ ...newAvailability, dayOfWeek: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {[0, 1, 2, 3, 4, 5, 6].map(day => (
                <option key={day} value={day}>
                  {getDayNameFr(day)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de début
              </label>
              <input
                type="time"
                value={newAvailability.startTime}
                onChange={(e) => setNewAvailability({ ...newAvailability, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de fin
              </label>
              <input
                type="time"
                value={newAvailability.endTime}
                onChange={(e) => setNewAvailability({ ...newAvailability, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}
