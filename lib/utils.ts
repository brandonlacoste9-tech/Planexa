// Utilitaires pour les dates en format français canadien

export const DAYS_FR = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi'
];

export const DAYS_FR_SHORT = [
  'Dim',
  'Lun',
  'Mar',
  'Mer',
  'Jeu',
  'Ven',
  'Sam'
];

export const MONTHS_FR = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre'
];

/**
 * Formate une date en format français canadien
 * @param date - Date à formater
 * @param includeTime - Inclure l'heure
 * @returns Date formatée (ex: "15 janvier 2024" ou "15 janvier 2024 à 14h30")
 */
export function formatDateFR(date: Date, includeTime: boolean = false): string {
  const day = date.getDate();
  const month = MONTHS_FR[date.getMonth()];
  const year = date.getFullYear();
  
  if (includeTime) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year} à ${hours}h${minutes}`;
  }
  
  return `${day} ${month} ${year}`;
}

/**
 * Formate une heure en format 24h français
 * @param date - Date contenant l'heure
 * @returns Heure formatée (ex: "14h30")
 */
export function formatTimeFR(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}h${minutes}`;
}

/**
 * Formate une date au format JJ/MM/AAAA
 * @param date - Date à formater
 * @returns Date formatée (ex: "15/01/2024")
 */
export function formatDateShortFR(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Parse une chaîne de temps (HH:MM) et retourne les heures et minutes
 */
export function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
}

/**
 * Génère un ID unique simple
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
