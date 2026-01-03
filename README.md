# Planexa 📅

Planexa est un outil de planification de rendez-vous simple et efficace, entièrement en français canadien. Similaire à Calendly, Planexa permet aux professionnels de gérer leurs disponibilités et aux clients de réserver facilement des créneaux horaires.

## ✨ Fonctionnalités

- **Interface 100% en français canadien** : Tous les textes, dates et formats suivent les standards français-canadiens
- **Gestion des disponibilités** : Configurez vos jours et heures de disponibilité par jour de la semaine
- **Lien de réservation personnalisé** : Partagez votre lien unique avec vos clients
- **Réservation en temps réel** : Les clients voient instantanément les créneaux disponibles
- **Créneaux de 30 minutes** : Réservations automatiques par intervalles de 30 minutes
- **Prévention des conflits** : Le système vérifie automatiquement les disponibilités
- **Design épuré et moderne** : Interface intuitive avec Tailwind CSS
- **Fuseau horaire** : Support du fuseau horaire America/Montreal par défaut
- **Notifications par courriel** : Confirmations automatiques (infrastructure en place)

## 🚀 Installation

### Prérequis

- Node.js 18+ et npm
- SQLite (inclus avec le projet)

### Étapes d'installation

1. Clonez le dépôt :
```bash
git clone https://github.com/brandonlacoste9-tech/Planexa.git
cd Planexa
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
```bash
cp .env.example .env
```

4. Initialisez la base de données :
```bash
npm run db:push
```

5. Lancez le serveur de développement :
```bash
npm run dev
```

6. Ouvrez votre navigateur à l'adresse : `http://localhost:3000`

## 📖 Utilisation

### Pour les professionnels

1. Accédez au **Tableau de bord** depuis la page d'accueil
2. Configurez vos **disponibilités** en ajoutant des créneaux par jour de la semaine
3. Copiez votre **lien de réservation** personnalisé
4. Partagez ce lien avec vos clients par courriel, sur votre site web, etc.
5. Consultez vos **réservations récentes** directement dans le tableau de bord

### Pour les clients

1. Cliquez sur le lien de réservation reçu
2. Sélectionnez une **date** parmi les 14 prochains jours
3. Choisissez un **créneau horaire** disponible
4. Remplissez vos informations (nom, courriel, notes optionnelles)
5. Confirmez la réservation
6. Recevez une confirmation par courriel

## 🛠️ Technologies utilisées

- **Framework** : Next.js 16 avec TypeScript
- **Base de données** : SQLite avec Prisma ORM
- **Styles** : Tailwind CSS
- **Dates** : date-fns avec locale français
- **Fuseaux horaires** : date-fns-tz
- **Emails** : nodemailer (infrastructure en place)

## 📁 Structure du projet

```
Planexa/
├── app/                      # Pages et routes Next.js
│   ├── [slug]/              # Page de réservation dynamique
│   ├── api/                 # API routes
│   │   ├── availability/    # Gestion des disponibilités
│   │   └── bookings/        # Gestion des réservations
│   ├── dashboard/           # Tableau de bord
│   └── page.tsx             # Page d'accueil
├── components/              # Composants React
│   ├── AvailabilityForm.tsx # Formulaire de disponibilités
│   ├── BookingCalendar.tsx  # Calendrier de réservation
│   ├── BookingsList.tsx     # Liste des réservations
│   └── CopyButton.tsx       # Bouton de copie
├── lib/                     # Utilitaires
│   ├── date-utils.ts        # Fonctions de gestion des dates
│   └── prisma.ts            # Client Prisma
├── prisma/                  # Configuration Prisma
│   └── schema.prisma        # Schéma de base de données
└── public/                  # Fichiers statiques
```

## 🗄️ Modèle de données

### User (Utilisateur)
- Informations de l'utilisateur (nom, email, slug unique)
- Fuseau horaire (America/Montreal par défaut)
- Relations : availabilities, bookings

### Availability (Disponibilité)
- Jour de la semaine (0=Dimanche, 6=Samedi)
- Heure de début et de fin (format HH:mm)
- Relation : user

### Booking (Réservation)
- Informations du client (nom, email)
- Date et heure de début/fin
- Durée (30 minutes par défaut)
- Notes optionnelles
- Statut (confirmed, cancelled)
- Relation : user

## 🌐 API Routes

### Disponibilités
- `POST /api/availability` - Créer une disponibilité
- `DELETE /api/availability?id={id}` - Supprimer une disponibilité
- `GET /api/availability/slots?userId={id}&date={date}` - Obtenir les créneaux disponibles

### Réservations
- `POST /api/bookings` - Créer une réservation

## 🔧 Scripts disponibles

```bash
npm run dev          # Lancer le serveur de développement
npm run build        # Construire pour la production
npm run start        # Lancer le serveur de production
npm run lint         # Vérifier le code avec ESLint
npm run db:push      # Synchroniser le schéma Prisma avec la BD
npm run db:studio    # Ouvrir Prisma Studio (interface BD)
```

## 🎨 Personnalisation

### Changer la durée des créneaux
Modifiez la constante `slotDuration` dans `/app/api/availability/slots/route.ts`

### Modifier les couleurs
Éditez le thème dans `tailwind.config.ts`

### Ajouter d'autres fuseaux horaires
Modifiez le fuseau par défaut dans `prisma/schema.prisma`

## 📝 Standards français-canadiens

- **Format de date** : "5 janvier 2026 à 10:00"
- **Jours de la semaine** : Lundi, Mardi, Mercredi, etc.
- **Mois** : janvier (janv.), février (févr.), mars, etc.
- **Courriel** au lieu d'email
- **Rendez-vous** au lieu d'appointment
- **Disponibilité** au lieu d'availability

## 🚧 Développements futurs

- [ ] Authentification des utilisateurs
- [ ] Envoi automatique d'emails de confirmation
- [ ] Rappels par courriel
- [ ] Support de plusieurs durées de rendez-vous
- [ ] Intégration avec Google Calendar
- [ ] Personnalisation des couleurs et du branding
- [ ] Support de plusieurs professionnels
- [ ] Annulation et reprogrammation de rendez-vous
- [ ] Statistiques et rapports

## 📄 Licence

ISC

## 👥 Auteur

Créé pour répondre aux besoins des professionnels francophones souhaitant un outil de planification simple et efficace.
