// Système de stockage simple en mémoire
// Dans une application de production, ceci devrait être remplacé par une base de données

import { UserProfile, Booking } from './types';

// Stockage en mémoire
const users: Map<string, UserProfile> = new Map();
const bookings: Map<string, Booking> = new Map();
const usersBySlug: Map<string, string> = new Map(); // slug -> userId

// Données de démonstration
const demoUser: UserProfile = {
  id: 'demo-user-1',
  name: 'Marie Tremblay',
  email: 'marie.tremblay@example.com',
  bookingSlug: 'marie-tremblay',
  timezone: 'America/Toronto',
  meetingDuration: 30,
  availabilities: [
    {
      dayOfWeek: 1, // Lundi
      slots: [
        { id: '1', start: '09:00', end: '12:00' },
        { id: '2', start: '13:00', end: '17:00' }
      ]
    },
    {
      dayOfWeek: 2, // Mardi
      slots: [
        { id: '3', start: '09:00', end: '12:00' },
        { id: '4', start: '13:00', end: '17:00' }
      ]
    },
    {
      dayOfWeek: 3, // Mercredi
      slots: [
        { id: '5', start: '09:00', end: '12:00' },
        { id: '6', start: '13:00', end: '17:00' }
      ]
    },
    {
      dayOfWeek: 4, // Jeudi
      slots: [
        { id: '7', start: '09:00', end: '12:00' },
        { id: '8', start: '13:00', end: '17:00' }
      ]
    },
    {
      dayOfWeek: 5, // Vendredi
      slots: [
        { id: '9', start: '09:00', end: '12:00' },
        { id: '10', start: '13:00', end: '16:00' }
      ]
    }
  ]
};

// Initialiser avec l'utilisateur de démonstration
users.set(demoUser.id, demoUser);
usersBySlug.set(demoUser.bookingSlug, demoUser.id);

// Fonctions d'accès aux données

export function getUserBySlug(slug: string): UserProfile | undefined {
  const userId = usersBySlug.get(slug);
  if (!userId) return undefined;
  return users.get(userId);
}

export function getUserById(id: string): UserProfile | undefined {
  return users.get(id);
}

export function createUser(user: UserProfile): UserProfile {
  users.set(user.id, user);
  usersBySlug.set(user.bookingSlug, user.id);
  return user;
}

export function updateUser(id: string, updates: Partial<UserProfile>): UserProfile | undefined {
  const user = users.get(id);
  if (!user) return undefined;
  
  const updatedUser = { ...user, ...updates };
  users.set(id, updatedUser);
  
  // Mettre à jour le slug si nécessaire
  if (updates.bookingSlug && updates.bookingSlug !== user.bookingSlug) {
    usersBySlug.delete(user.bookingSlug);
    usersBySlug.set(updates.bookingSlug, id);
  }
  
  return updatedUser;
}

export function createBooking(booking: Booking): Booking {
  bookings.set(booking.id, booking);
  return booking;
}

export function getBookingsForUser(userId: string): Booking[] {
  return Array.from(bookings.values()).filter(b => b.userId === userId);
}

export function getBookingById(id: string): Booking | undefined {
  return bookings.get(id);
}

export function updateBooking(id: string, updates: Partial<Booking>): Booking | undefined {
  const booking = bookings.get(id);
  if (!booking) return undefined;
  
  const updatedBooking = { ...booking, ...updates };
  bookings.set(id, updatedBooking);
  return updatedBooking;
}

// Vérifier si un créneau est disponible
export function isSlotAvailable(
  userId: string,
  startTime: Date,
  endTime: Date
): boolean {
  const userBookings = getBookingsForUser(userId);
  
  for (const booking of userBookings) {
    if (booking.status === 'cancelled') continue;
    
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);
    
    // Vérifier le chevauchement
    if (startTime < bookingEnd && endTime > bookingStart) {
      return false;
    }
  }
  
  return true;
}
