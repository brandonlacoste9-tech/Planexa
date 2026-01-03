import { format, parse } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'

// Format une date en français canadien
export function formatDateFr(date: Date, formatStr: string = 'PPP'): string {
  return format(date, formatStr, { locale: fr })
}

// Format une date avec heure en français canadien
export function formatDateTimeFr(date: Date): string {
  return format(date, "d MMMM yyyy 'à' HH:mm", { locale: fr })
}

// Format juste l'heure
export function formatTimeFr(date: Date): string {
  return format(date, 'HH:mm', { locale: fr })
}

// Convertit une date en timezone spécifique
export function toTimezone(date: Date, timezone: string): Date {
  return toZonedTime(date, timezone)
}

// Convertit depuis une timezone vers UTC
export function fromTimezone(date: Date, timezone: string): Date {
  return fromZonedTime(date, timezone)
}

// Obtient le nom du jour en français
export function getDayNameFr(dayOfWeek: number): string {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  return days[dayOfWeek]
}

// Parse une heure au format HH:mm
export function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return { hours, minutes }
}

// Crée une date à partir d'une date de base et d'une heure
export function setTime(date: Date, timeStr: string): Date {
  const { hours, minutes } = parseTime(timeStr)
  const newDate = new Date(date)
  newDate.setHours(hours, minutes, 0, 0)
  return newDate
}
