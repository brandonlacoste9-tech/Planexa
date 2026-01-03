// Modèles de courriels en français canadien
// Dans une application de production, ces modèles seraient utilisés avec un service d'envoi de courriels

import { formatDateFR } from './utils';

export interface EmailData {
  clientName: string;
  clientEmail: string;
  userName: string;
  userEmail: string;
  startTime: Date;
  endTime: Date;
}

/**
 * Génère le contenu du courriel de confirmation pour le client
 */
export function generateClientConfirmationEmail(data: EmailData): string {
  return `
Objet : Confirmation de votre rendez-vous avec ${data.userName}

Bonjour ${data.clientName},

Votre rendez-vous a été confirmé avec succès !

Détails du rendez-vous :
━━━━━━━━━━━━━━━━━━━━━━━━
📅 Date : ${formatDateFR(data.startTime, true)}
⏱️ Durée : ${Math.round((data.endTime.getTime() - data.startTime.getTime()) / 60000)} minutes
👤 Avec : ${data.userName}

Nous avons hâte de vous rencontrer !

Si vous devez annuler ou reporter ce rendez-vous, veuillez contacter ${data.userEmail} directement.

Cordialement,
L'équipe Planexa

━━━━━━━━━━━━━━━━━━━━━━━━
Propulsé par Planexa - Planification simplifiée
  `.trim();
}

/**
 * Génère le contenu du courriel de notification pour l'utilisateur
 */
export function generateUserNotificationEmail(data: EmailData): string {
  return `
Objet : Nouveau rendez-vous réservé

Bonjour ${data.userName},

Un nouveau rendez-vous a été réservé !

Détails du rendez-vous :
━━━━━━━━━━━━━━━━━━━━━━━━
📅 Date : ${formatDateFR(data.startTime, true)}
⏱️ Durée : ${Math.round((data.endTime.getTime() - data.startTime.getTime()) / 60000)} minutes
👤 Client : ${data.clientName}
✉️ Courriel : ${data.clientEmail}

Un courriel de confirmation a été envoyé au client.

Cordialement,
L'équipe Planexa

━━━━━━━━━━━━━━━━━━━━━━━━
Propulsé par Planexa - Planification simplifiée
  `.trim();
}

/**
 * Génère un exemple de courriel HTML (pour une implémentation future)
 */
export function generateHtmlEmail(data: EmailData, isClient: boolean): string {
  const content = isClient 
    ? generateClientConfirmationEmail(data)
    : generateUserNotificationEmail(data);
    
  return `
<!DOCTYPE html>
<html lang="fr-CA">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de rendez-vous</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #0284c7;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: #f9fafb;
      padding: 30px;
      border: 1px solid #e5e7eb;
    }
    .details {
      background-color: white;
      padding: 20px;
      border-left: 4px solid #0284c7;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 12px;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Planexa</h1>
  </div>
  <div class="content">
    <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${content}</pre>
  </div>
  <div class="footer">
    <p>Propulsé par Planexa - Planification simplifiée</p>
  </div>
</body>
</html>
  `.trim();
}
