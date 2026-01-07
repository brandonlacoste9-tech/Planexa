# Planexo Landing Page - Specification

**Date:** January 5, 2026  
**Status:** ✅ Complete  
**Location:** `frontend/src/pages/LandingPage.tsx`

---

## 🎯 Overview

A premium, Quebec-first landing page for Planexo — the AI scheduling assistant that handles calls, emails, and calendar management automatically.

---

## 📐 Design System

### Visual Style
- **Microsoft Fluent-inspired** aesthetic
- Rounded corners (2xl, 3xl)
- Soft shadows and gradients
- Smooth transitions (300ms)
- Premium spacing

### Colors
- Primary: Blue (#2563eb)
- Gradients: Blue to Purple accents
- Background: Light/Dark/Midnight themes supported
- CSS Variables for theming

### Typography
- Font: Inter (system-ui fallback)
- Headlines: Bold, tight tracking
- Body: Regular, relaxed leading
- All text in Quebec French

---

## 📦 Sections

### 1. Navigation (Fixed)
- Logo with gradient icon
- Desktop nav links (Fonctionnalités, Comment ça marche, Tarifs, FAQ)
- Theme toggle (light/dark)
- CTA buttons (Connexion, Essai gratuit)
- Mobile hamburger menu

### 2. Hero Section
- Badge: "Nouveau — Assistant IA pour entreprises québécoises"
- Headline: "Ton assistant qui répond pour toi"
- Subheadline: Value proposition
- CTA buttons: Primary + Secondary (with demo)
- Social proof: User count + rating
- Mock dashboard preview

### 3. Trusted By
- Company logos placeholder (Desjardins, Hydro-Québec, SAQ, etc.)

### 4. Features (6 cards)
1. **Réception d'appels IA** - AI phone answering
2. **Gestion des courriels** - Email management
3. **Calendrier intelligent** - Smart calendar
4. **Ton style, ton ton** - Customizable personality
5. **Rappels automatiques** - Automatic reminders
6. **Données au Québec** - Local data hosting

### 5. How It Works (3 steps)
1. Crée ton compte (30 seconds)
2. Configure ton assistant (guided setup)
3. Laisse-le travailler (starts immediately)

### 6. Testimonials (3 cards)
- Marie-Claude Tremblay (Dentiste, Montréal)
- Jean-François Gagnon (Coach sportif, Québec)
- Sophie Lavoie (Avocate, Sherbrooke)

### 7. Pricing (3 tiers)
1. **Débutant** - 49$/mois
   - 100 appels/mois
   - 500 courriels/mois
   - Basic features

2. **Professionnel** - 99$/mois (Most popular)
   - Unlimited calls/emails
   - Multi-user calendar
   - Advanced analytics

3. **Entreprise** - Custom
   - Everything + custom integrations
   - Dedicated support

### 8. FAQ (6 questions)
- Comment fonctionne l'assistant téléphonique?
- Est-ce que mes données sont sécurisées?
- Puis-je personnaliser les réponses?
- Combien de temps prend la configuration?
- Puis-je annuler mon abonnement?
- Est-ce que l'assistant parle vraiment français québécois?

### 9. Final CTA
- Gradient background (blue)
- "Prêt à reprendre ton temps?"
- Two CTA buttons
- Trust badges

### 10. Footer
- Brand column with tagline
- Product links
- Company links
- Legal links
- Social media icons
- Copyright

---

## 🎨 Key Features

### Responsive Design
- Mobile-first approach
- Hamburger menu on mobile
- Grid layouts adapt to screen size
- Touch-friendly buttons

### Dark Mode Support
- Theme toggle in navigation
- All sections support dark mode
- Proper contrast ratios

### Animations
- Hover effects on cards
- Button hover animations
- FAQ accordion
- Smooth scrolling

### Accessibility
- Semantic HTML
- Proper heading hierarchy
- Focus states
- Alt text ready for images

---

## 🔧 Technical Details

### Dependencies
- React (useState)
- Lucide React (icons)
- Tailwind CSS (styling)

### Icons Used
- Calendar, Phone, Mail, MessageSquare
- Clock, Shield, Sparkles, Check
- ArrowRight, Play, Star, Users
- Zap, Globe, ChevronDown
- Menu, X, Sun, Moon

### State Management
- `mobileMenuOpen` - Mobile menu toggle
- `theme` - Light/Dark theme
- `activeFaq` - FAQ accordion

---

## 🚀 Usage

```tsx
import { LandingPage } from './pages';

function App() {
  return <LandingPage />;
}
```

Or update routing to show landing page at root:

```tsx
// In App.tsx or router config
<Route path="/" element={<LandingPage />} />
<Route path="/app" element={<Dashboard />} />
```

---

## 📋 Checklist

- [x] Navigation with logo and links
- [x] Hero section with value proposition
- [x] Trusted by section
- [x] Features grid (6 features)
- [x] How it works (3 steps)
- [x] Testimonials (3 cards)
- [x] Pricing (3 tiers)
- [x] FAQ accordion (6 questions)
- [x] Final CTA section
- [x] Footer with links
- [x] Dark mode support
- [x] Mobile responsive
- [x] Quebec French throughout
- [x] Microsoft Fluent design

---

## 📸 Preview Sections

### Hero
```
┌─────────────────────────────────────────────────┐
│  🗓️ Planexo              Fonctionnalités  FAQ   │
│                                    [Connexion]  │
├─────────────────────────────────────────────────┤
│                                                 │
│     ✨ Nouveau — Assistant IA québécois        │
│                                                 │
│         Ton assistant qui                       │
│         répond pour toi                         │
│                                                 │
│  Planexo gère tes appels, tes courriels...    │
│                                                 │
│   [Commencer gratuitement →]  [▶ Voir la démo] │
│                                                 │
│   👥👥👥👥👥 +2,500 entreprises  ★★★★★ 4.9/5  │
│                                                 │
│   ┌─────────────────────────────────────────┐  │
│   │  📞 47        ✉️ 156       📅 23        │  │
│   │  Appels      Courriels    Rendez-vous   │  │
│   └─────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Pricing
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Débutant   │ │★ POPULAIRE ★│ │  Entreprise  │
│    49$/mo    │ │    99$/mo    │ │  Sur mesure  │
│              │ │              │ │              │
│ ✓ 100 appels │ │ ✓ Illimité   │ │ ✓ Tout + API │
│ ✓ 500 emails │ │ ✓ Multi-user │ │ ✓ Formation  │
│ ✓ Calendrier │ │ ✓ Analytics  │ │ ✓ SLA        │
│              │ │              │ │              │
│ [Commencer]  │ │ [Commencer]  │ │ [Contacter]  │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## 🔮 Future Enhancements

1. **Add real images/illustrations**
2. **Connect CTA buttons to auth flow**
3. **Add animated statistics**
4. **Integrate with analytics**
5. **Add chatbot widget**
6. **Video testimonials**
7. **Live demo embed**

---

**Landing Page Complete** ✅
