# Planexa

Outil de planification en français canadien - similaire à Calendly

## Description

Planexa est un outil de planification de rendez-vous en français canadien. Les utilisateurs peuvent définir leurs disponibilités, partager un lien de réservation unique, et permettre à leurs clients de choisir un créneau horaire. Toute l'interface, les courriels et les formats de date suivent les normes françaises canadiennes.

## Fonctionnalités

- ✅ Interface entièrement en français canadien
- 📅 Configuration des disponibilités par jour de la semaine
- 🔗 Lien de réservation unique pour chaque utilisateur
- ⏰ Formats de date français-canadiens (JJ/MM/AAAA)
- ⏱️ Formats d'heure en 24h (ex: 14h30)
- 📧 Templates de courriels en français
- 🎨 Design moderne et épuré avec Tailwind CSS
- ⚡ Application rapide construite avec Next.js 15
- 🌍 Fuseau horaire par défaut : America/Toronto (EST/EDT)

## Captures d'écran

### Page d'accueil
![Page d'accueil](https://github.com/user-attachments/assets/68938b7d-9792-41bd-88c8-d98d746cb910)

### Sélection de date
![Sélection de date](https://github.com/user-attachments/assets/22657e79-efb5-44ba-9698-d500b8474fda)

### Sélection de l'heure
![Sélection de l'heure](https://github.com/user-attachments/assets/a1f8ec27-585a-440a-b723-cff8823fa2ad)

### Formulaire de réservation
![Formulaire](https://github.com/user-attachments/assets/0be4015a-4360-4cf3-8693-ed4c2d9a0f33)

### Confirmation
![Confirmation](https://github.com/user-attachments/assets/f5da40cf-0186-4494-ae66-1cdccbb15585)

## Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn

### Étapes d'installation

1. Cloner le dépôt :
```bash
git clone https://github.com/brandonlacoste9-tech/Planexa.git
cd Planexa
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer le serveur de développement :
```bash
npm run dev
```

4. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Utilisation

### Pour les utilisateurs (propriétaires de calendrier)

Le système inclut un utilisateur de démonstration avec le slug `marie-tremblay`. Dans une application de production, vous créeriez votre propre profil avec :

- Votre nom
- Votre adresse courriel
- Votre slug unique (ex: `jean-dupont`)
- Vos disponibilités par jour de semaine
- La durée de vos rendez-vous (en minutes)

### Pour les clients

1. Visitez le lien de réservation partagé (ex: `/reserver/marie-tremblay`)
2. Choisissez une date disponible
3. Sélectionnez un créneau horaire
4. Remplissez vos informations (nom et courriel)
5. Confirmez la réservation

## Structure du projet

```
Planexa/
├── app/                      # Application Next.js
│   ├── api/                  # Routes API
│   │   ├── bookings/         # Gestion des réservations
│   │   └── users/            # Gestion des utilisateurs
│   ├── reserver/[slug]/      # Page de réservation publique
│   ├── layout.tsx            # Layout principal
│   ├── page.tsx              # Page d'accueil
│   └── globals.css           # Styles globaux
├── lib/                      # Utilitaires et logique
│   ├── types.ts              # Types TypeScript
│   ├── utils.ts              # Fonctions utilitaires (formats de date)
│   ├── storage.ts            # Système de stockage
│   └── email.ts              # Templates de courriels
├── components/               # Composants React réutilisables
├── public/                   # Fichiers statiques
└── package.json              # Dépendances du projet
```

## Technologies utilisées

- **Next.js 16** - Framework React pour applications web
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **React 19** - Bibliothèque UI

## Formats de date français-canadiens

L'application utilise les formats suivants :

- **Date courte** : JJ/MM/AAAA (ex: 15/01/2024)
- **Date longue** : J mois AAAA (ex: 15 janvier 2024)
- **Heure** : HHhMM (ex: 14h30)
- **Date et heure** : J mois AAAA à HHhMM (ex: 15 janvier 2024 à 14h30)

## Fuseau horaire

Le fuseau horaire par défaut est `America/Toronto` (Heure de l'Est, EST/EDT), utilisé au Québec et dans l'est du Canada.

## Développement futur

Pour une application de production, vous devriez ajouter :

- 🗄️ Base de données (PostgreSQL, MongoDB, etc.)
- 🔐 Authentification des utilisateurs
- 📧 Service d'envoi de courriels (SendGrid, Mailgun, etc.)
- 📱 Interface de gestion des disponibilités pour les utilisateurs
- 📊 Tableau de bord pour voir les réservations
- ❌ Fonction d'annulation de rendez-vous
- 🔔 Rappels par courriel
- 🌐 Déploiement sur Vercel, Netlify ou autre plateforme

## Scripts disponibles

```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Construire pour la production
npm start        # Démarrer le serveur de production
npm run lint     # Vérifier le code avec ESLint
```

## Licence

ISC

## Auteur

Projet créé pour démontrer un outil de planification en français canadien.

## Support

Pour toute question ou problème, veuillez ouvrir un ticket sur GitHub.

