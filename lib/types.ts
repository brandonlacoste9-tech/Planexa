// Types pour l'application de planification

export interface TimeSlot {
  id: string;
  start: string; // ISO 8601 format
  end: string;   // ISO 8601 format
}

export interface Availability {
  dayOfWeek: number; // 0 = dimanche, 1 = lundi, etc.
  slots: TimeSlot[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bookingSlug: string; // URL unique pour les réservations
  availabilities: Availability[];
  meetingDuration: number; // en minutes
  timezone: string; // e.g., "America/Toronto"
}

export interface Booking {
  id: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  startTime: string; // ISO 8601 format
  endTime: string;   // ISO 8601 format
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}
