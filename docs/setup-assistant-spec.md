# PLANEXA SETUP ASSISTANT — SPECIFICATION (SECTION 1 OF MANY)

This document defines the Planexa Setup Assistant. 
This is **Section 1 only**. More sections will be added later. 
Cursor must NOT assume missing details. Cursor must wait for the next sections.

---

## 1. PURPOSE OF THE SETUP ASSISTANT

The Planexa Setup Assistant is a friendly, Québec-coded onboarding guide that helps new users configure their AI-powered scheduling system. It must feel:

- Calm  
- Modern  
- Microsoft-inspired  
- Clean and accessible  
- Friendly and reassuring  
- Never overwhelming  

The assistant guides users step-by-step through connecting:

1. Their AI provider  
2. Their phone number (Twilio or similar)  
3. Their email inbox (Gmail/Outlook)  
4. Their calendar (Google/Outlook)  
5. Their tone and color mode  
6. Optional modules  

The assistant must be:
- Conversational  
- Human-in-the-loop  
- Easy to follow  
- Non-technical in tone  
- Québec-friendly in language and examples  

---

## 2. TWO MODES

The Setup Assistant must support two modes:

### A) Guided Mode (default)
A conversational AI guide that explains each step in simple language.

### B) Manual Mode
A clean settings page for power users who want to configure everything themselves.

Users can switch between modes at any time.

---

## 3. VISUAL STYLE (MICROSOFT-INSPIRED)

The UI must follow a modern Microsoft Fluent-style aesthetic:

- Inter or Segoe UI Variable font  
- Soft blues, greys, lavenders  
- Rounded corners  
- Light shadows  
- Smooth transitions  
- Spacious layout  
- High accessibility  

Color modes supported:
- Light  
- Dark  
- Midnight  
- Pastel  
- High-contrast  
- Dyslexia-friendly  

---

## 4. COMPONENT STRUCTURE

Cursor must create the following empty components (implementation comes later):

```
/frontend/src/features/setup-assistant/
  AssistantIntro.tsx
  ChooseAI.tsx
  ConnectTwilio.tsx
  ConnectEmail.tsx
  ConnectCalendar.tsx
  ChooseTone.tsx
  ChooseTheme.tsx
  Finish.tsx
```

These files must remain empty until future sections define their behavior.

---

## 5. IMPORTANT RULE FOR CURSOR

Cursor must treat this as **Section 1 only**.  
More sections will follow.  
Cursor must NOT generate missing logic or UI until the next sections are provided.

Cursor should prepare the structure, not the full implementation.

---

# SECTION 2 — AI PROVIDER SETUP

(This is Section 2 only. More sections will follow. Cursor must NOT assume missing details.)

---

## 1. PURPOSE OF THIS SECTION

This section defines the behavior and UI for the **ChooseAI.tsx** component.  
The goal is to help the user select and connect their preferred AI provider in a friendly, guided way.

The assistant must:
- Explain the differences simply  
- Recommend DeepSeek as best value  
- Support Gemini and OpenAI  
- Validate the API key  
- Provide clear success/error states  
- Keep the tone calm, friendly, and Québec-coded  

---

## 2. SUPPORTED AI PROVIDERS

The UI must show three options:

### A) DeepSeek (Recommended)
- Label: "DeepSeek (Recommandé)"
- Description: "Rapide, abordable, excellent pour les appels et les courriels."
- Badge: "Meilleur rapport qualité-prix"

### B) Gemini
- Label: "Gemini (Google)"
- Description: "Idéal pour la voix, la transcription et l'écosystème Google."

### C) OpenAI
- Label: "OpenAI"
- Description: "Option premium pour le langage naturel."

Each provider must have:
- A radio button or card selector  
- A short description  
- A link to "Comment obtenir une clé API"  

---

## 3. API KEY INPUT

After selecting a provider, the user must see:

- A single input field for the API key  
- A "Tester la clé" button  
- A loading state  
- A success state (green checkmark + message)  
- An error state (red warning + message)  

The assistant must validate the key by calling a backend endpoint:

```
POST /api/setup/validate-ai-key
{
  provider: "deepseek" | "gemini" | "openai",
  apiKey: "..."
}
```

Cursor must NOT implement the backend yet.  
Backend details will come in Section 4.

---

## 4. GUIDED MODE BEHAVIOR

In guided mode, the assistant must speak in a friendly tone:

Example:

« Choisissons ton fournisseur d'IA.  
Je peux t'expliquer les différences si tu veux. »

When the user selects a provider:

« Parfait! Entre ta clé API ici, et je vais vérifier si tout fonctionne. »

On success:

« Excellent! Ton assistant est prêt à travailler. »

On error:

« Hmm… cette clé ne fonctionne pas. On peut réessayer ensemble. »

---

## 5. MANUAL MODE BEHAVIOR

Manual mode must show:

- A dropdown for provider  
- A single API key input  
- A "Save" button  
- No conversational text  

---

## 6. VISUAL STYLE

Follow the Microsoft Fluent-inspired aesthetic defined in Section 1:

- Inter or Segoe UI Variable  
- Soft blues and greys  
- Rounded cards  
- Smooth transitions  
- Clear spacing  
- Accessible labels  

---

## 7. COMPONENT REQUIREMENTS (ChooseAI.tsx)

Cursor must implement:

- Provider selection UI  
- API key input  
- Test button  
- Success/error states  
- Guided + Manual modes  
- Placeholder backend call  
- No navigation logic yet (Section 3 will define routing)

---

## 8. IMPORTANT RULE FOR CURSOR

Cursor must treat this as **Section 2 only**.  
More sections will follow.  
Cursor must NOT implement Twilio, Email, Calendar, Tone, Theme, or Finish steps yet.

Cursor must ONLY implement ChooseAI.tsx according to this section.

---

# SECTION 3 — NAVIGATION, FLOW, AND ASSISTANT INTRO

(This is Section 3 only. More sections will follow. Cursor must NOT assume missing details.)

---

## 1. PURPOSE OF THIS SECTION

This section defines:
- The navigation system between setup steps  
- The step progression indicator  
- The AssistantIntro component  
- Mode switching (Guided vs Manual)  
- The container layout for the entire setup flow  

Cursor must implement:
- AssistantIntro.tsx  
- A SetupFlow container component  
- A step navigation system  
- A progress indicator  
- Mode switching UI  

Cursor must NOT implement Twilio, Email, Calendar, Tone, or Theme steps yet.

---

## 2. SETUP STEPS (ORDERED)

The setup flow must follow this order:

1. AssistantIntro  
2. ChooseAI  
3. ConnectTwilio  
4. ConnectEmail  
5. ConnectCalendar  
6. ChooseTone  
7. ChooseTheme  
8. Finish  

Only steps 1 and 2 are implemented at this stage.  
Steps 3–8 must remain placeholders.

---

## 3. SETUPFLOW CONTAINER

Cursor must create a new component:

```
/frontend/src/features/setup-assistant/SetupFlow.tsx
```

This component must:
- Manage the current step index  
- Render the correct step component  
- Provide "Next" and "Back" navigation  
- Display a progress indicator  
- Support Guided and Manual modes  
- Pass mode + navigation props to each step  

The container must NOT implement business logic yet.

---

## 4. PROGRESS INDICATOR

A horizontal step indicator must appear at the top:

- Circles or checkmarks for each step  
- Current step highlighted  
- Completed steps marked  
- Future steps greyed out  
- Microsoft Fluent-style design  

Example:

```
[● Intro] — [○ IA] — [○ Téléphone] — [○ Courriel] — [...]
```

Cursor must implement this as a reusable component:

```
/frontend/src/features/setup-assistant/ProgressBar.tsx
```

---

## 5. MODE SWITCHING (GUIDED VS MANUAL)

At the top-right of the SetupFlow container, include a toggle:

```
Mode: Guided | Manual
```

Behavior:
- Guided mode shows conversational text  
- Manual mode hides conversational text  
- Switching modes does NOT reset progress  
- Mode is stored in local state  

---

## 6. ASSISTANTINTRO COMPONENT

Cursor must implement:

```
/frontend/src/features/setup-assistant/AssistantIntro.tsx
```

### Guided Mode Text (French, friendly, Québec-coded):

« Bonjour! Je suis ton assistant Planexa.  
On va configurer ton système ensemble, étape par étape.  
Ça prend moins de cinq minutes. »

Button:
```
Commencer
```

### Manual Mode Text:

« Configuration rapide. Choisis une étape pour commencer. »

Button:
```
Commencer
```

### Visual Style:
- Large friendly card  
- Soft Microsoft-style colors  
- Rounded corners  
- Calm spacing  
- Optional illustration placeholder (no image yet)  

---

## 7. NAVIGATION RULES

- "Next" moves to the next step  
- "Back" moves to the previous step  
- AssistantIntro only shows "Commencer"  
- ChooseAI triggers "Next" only after success  
- Manual mode always shows "Next"  

Cursor must NOT implement validation logic for future steps yet.

---

## 8. IMPORTANT RULE FOR CURSOR

Cursor must treat this as **Section 3 only**.  
Cursor must NOT implement Twilio, Email, Calendar, Tone, Theme, or Finish steps yet.  
Cursor must ONLY implement:

- SetupFlow.tsx  
- ProgressBar.tsx  
- AssistantIntro.tsx  
- Navigation logic  
- Mode switching  
- Step rendering  

More sections will follow.

---

# SECTION 4 — CONNECTER LE NUMÉRO DE TÉLÉPHONE (TWILIO)

(Ceci est la Section 4 seulement. D'autres sections suivront.  
Cursor NE DOIT PAS deviner ou implémenter les étapes futures.)

---

## 1. OBJECTIF DE CETTE SECTION

Cette section définit le comportement et l'interface du composant **ConnectTwilio.tsx**.

Le but est d'aider l'utilisateur à connecter son numéro de téléphone professionnel afin que l'assistant Planexa puisse :

- Répondre aux appels  
- Transférer les appels  
- Prendre des messages  
- Réserver des rendez-vous  
- Envoyer des SMS de rappel  

Le ton doit rester :
- Simple  
- Rassurant  
- Québecois  
- Non technique  

---

## 2. MODE SIMPLE (PAR DÉFAUT)

Le mode simple doit afficher :

### A) Explication courte
« On va connecter ton numéro de téléphone.  
C'est rapide et ça te permet d'avoir un assistant qui répond pour toi. »

### B) Champs requis
1. **Twilio Account SID**  
2. **Twilio Auth Token**  
3. **Numéro Twilio** (format +1…)  
4. **URL du webhook** (affichée automatiquement, en lecture seule)

### C) Boutons
- **"Acheter un numéro Twilio"**  
  Lien : https://www.twilio.com/console/phone-numbers/search  
- **"Tester l'appel"**  
- **"Enregistrer"**

### D) Validation
Le bouton "Tester l'appel" doit appeler un endpoint placeholder :

```
POST /api/setup/test-call
{
  sid: "...",
  token: "...",
  phoneNumber: "..."
}
```

Cursor NE DOIT PAS implémenter le backend.  
Le backend sera défini dans une section future.

### E) États visuels
- Chargement (spinner)  
- Succès (check vert + message)  
- Erreur (rouge + message)  

---

## 3. MODE AVANCÉ (OPTIONNEL)

Un bouton "Options avancées" doit ouvrir un panneau contenant :

- Choix du fournisseur (Twilio par défaut, Telnyx, Plivo — mais **désactivés** pour l'instant)  
- Paramètres SIP (désactivés)  
- Numéro de secours (fallback)  
- Choix de la voix de l'assistant (liste statique pour l'instant)  

Ces options doivent être visibles mais **non fonctionnelles**.  
Elles seront activées dans une section future.

---

## 4. MODE MANUEL

Le mode manuel doit afficher :

- Trois champs simples (SID, Token, Numéro)  
- Un bouton "Enregistrer"  
- Aucun texte conversationnel  
- Aucun test automatique  

---

## 5. COMPORTEMENT EN MODE GUIDÉ

Le ton doit être chaleureux et rassurant :

### Exemple de texte guidé :
« Parfait! Maintenant, on va connecter ton numéro de téléphone.  
Si tu n'en as pas encore un, tu peux en acheter un ici.  
Ça prend moins d'une minute. »

### Après avoir entré les infos :
« Super! On va tester ton numéro pour s'assurer que tout fonctionne. »

### Succès :
« Excellent! Ton assistant pourra répondre aux appels. »

### Erreur :
« Hmm… on dirait que ça ne fonctionne pas.  
On peut réessayer ensemble. »

---

## 6. STYLE VISUEL

Respecter le style Microsoft Fluent défini dans la Section 1 :

- Cartes arrondies  
- Couleurs douces  
- Icônes simples  
- Transitions fluides  
- Accessibilité élevée  
- Support du mode sombre  

---

## 7. EXIGENCES DU COMPOSANT (ConnectTwilio.tsx)

Cursor doit implémenter :

- UI complète du mode simple  
- UI du mode manuel  
- UI du panneau d'options avancées (désactivées)  
- Validation visuelle  
- Appel placeholder pour "Tester l'appel"  
- Gestion des états (succès, erreur, chargement)  
- Intégration avec SetupFlow (nextStep, backStep, mode)  

Cursor NE DOIT PAS implémenter :
- Le backend  
- La logique réelle d'appel  
- Les fournisseurs alternatifs  
- Les options avancées fonctionnelles  

---

## 8. RÈGLE IMPORTANTE POUR CURSOR

Cursor doit traiter ceci comme **Section 4 seulement**.  
Il NE DOIT PAS implémenter les étapes suivantes :

- ConnectEmail  
- ConnectCalendar  
- ChooseTone  
- ChooseTheme  
- Finish  

Ces étapes seront définies dans les sections suivantes.

---

# SECTION 5 — CONNECTEMAIL (GMAIL + MICROSOFT + IMAP/SMTP)

(Ceci est la Section 5 seulement. Cursor NE DOIT PAS implémenter les sections suivantes.)

---

## 1. OBJECTIF DE CETTE SECTION

Cette section définit le comportement et l'interface du composant **ConnectEmail.tsx**.

Le but est d'aider l'utilisateur à connecter son courriel professionnel afin que l'assistant Planexa puisse :

- Lire et envoyer des courriels  
- Répondre automatiquement aux clients  
- Résumer les conversations  
- Extraire les demandes importantes  
- Réserver des rendez-vous à partir des courriels  

Le ton doit rester :
- Simple  
- Rassurant  
- Québecois  
- Non technique  

---

## 2. OPTIONS DE CONNEXION

L'utilisateur doit pouvoir choisir entre :

### A) **Gmail (OAuth Google)**
Bouton : **"Se connecter avec Google"**

Permissions demandées :
- Lire les courriels  
- Envoyer des courriels  
- Lire le calendrier (pour synchronisation future)  
- Profil de base  

### B) **Microsoft Outlook / Office 365 (OAuth Microsoft Graph)**
Bouton : **"Se connecter avec Microsoft"**

Permissions demandées :
- Mail.ReadWrite  
- Calendars.ReadWrite  
- User.Read  

### C) **Mode avancé : IMAP / SMTP (manuel)**
Champs :
- Serveur IMAP  
- Port IMAP  
- Serveur SMTP  
- Port SMTP  
- Nom d'utilisateur  
- Mot de passe / App Password  

Ce mode doit être **caché derrière un bouton "Options avancées"**.

### D) **Option : Sauter cette étape**
Bouton : **"Je veux sauter cette étape."**

Si l'utilisateur saute :
- Marquer l'étape comme complétée  
- Passer à la prochaine étape  
- L'assistant IA fonctionne, mais sans courriel  

---

## 3. MODE SIMPLE (PAR DÉFAUT)

Le mode simple doit afficher :

### A) Explication courte
« On va connecter ton adresse courriel.  
Ça permet à ton assistant de répondre aux clients et de gérer tes messages. »

### B) Deux gros boutons OAuth
- "Se connecter avec Google"  
- "Se connecter avec Microsoft"  

### C) Après la connexion
Afficher :
- Nom du compte  
- Adresse courriel  
- Icône de succès  
- Bouton "Envoyer un courriel de test"  

### D) Test de courriel
Appel placeholder :

```
POST /api/setup/test-email
{
  provider: "google" | "microsoft" | "imap",
  email: "..."
}
```

Cursor NE DOIT PAS implémenter le backend.

### E) États visuels
- Chargement (spinner)  
- Succès (check vert + message)  
- Erreur (rouge + message)  

---

## 4. MODE AVANCÉ (IMAP/SMTP)

Accessible via un bouton :

**"Options avancées (IMAP/SMTP)"**

Champs requis :
- IMAP Host  
- IMAP Port  
- SMTP Host  
- SMTP Port  
- Username  
- Password  

Bouton :
**"Tester la connexion"**

État :
- Succès / Erreur  
- Auto-advance si succès  

---

## 5. MODE MANUEL

Le mode manuel doit afficher :

- Un texte simple :  
  « Entre les informations de ton serveur courriel. »  
- Les champs IMAP/SMTP  
- Un bouton "Enregistrer"  
- Aucun texte conversationnel  
- Aucun test automatique  

---

## 6. COMPORTEMENT EN MODE GUIDÉ

Le ton doit être chaleureux et rassurant :

### Exemple de texte guidé :
« Parfait! Maintenant, on va connecter ton adresse courriel.  
C'est ce qui permet à ton assistant de répondre automatiquement aux clients. »

### Après la connexion :
« Super! On va envoyer un petit courriel de test pour s'assurer que tout fonctionne. »

### Succès :
« Excellent! Ton assistant pourra lire et envoyer des courriels. »

### Erreur :
« Hmm… on dirait que ça ne fonctionne pas.  
On peut réessayer ensemble. »

---

## 7. STYLE VISUEL

Respecter le style Microsoft Fluent défini dans la Section 1 :

- Cartes arrondies  
- Couleurs douces  
- Icônes simples  
- Transitions fluides  
- Accessibilité élevée  
- Support du mode sombre  

---

## 8. EXIGENCES DU COMPOSANT (ConnectEmail.tsx)

Cursor doit implémenter :

- UI complète du mode simple (Google + Microsoft)  
- UI du mode avancé (IMAP/SMTP)  
- UI du mode manuel  
- Validation visuelle  
- Appel placeholder pour "test email"  
- Gestion des états (succès, erreur, chargement)  
- Intégration avec SetupFlow (nextStep, backStep, mode)  
- Bouton "Sauter cette étape"  

Cursor NE DOIT PAS implémenter :
- Le backend  
- La logique réelle d'envoi de courriel  
- La synchronisation calendrier  
- Les intégrations futures  

---

## 9. RÈGLE IMPORTANTE POUR CURSOR

Cursor doit traiter ceci comme **Section 5 seulement**.  
Il NE DOIT PAS implémenter les étapes suivantes :

- ConnectCalendar  
- ConnectNotion  
- ChooseTone  
- ChooseTheme  
- Finish  

Ces étapes seront définies dans les sections suivantes.

---

# SECTION 6 — CONNECTCALENDAR (GOOGLE + MICROSOFT)

(Ceci est la Section 6 seulement. Cursor NE DOIT PAS implémenter les sections suivantes.)

---

## 1. OBJECTIF DE CETTE SECTION

Cette section définit le comportement et l'interface du composant **ConnectCalendar.tsx**.

Le but est d'aider l'utilisateur à connecter son calendrier afin que l'assistant Planexa puisse :

- Lire la disponibilité  
- Éviter les conflits  
- Créer des rendez-vous  
- Envoyer des rappels  
- Gérer les annulations  
- Synchroniser automatiquement les réservations  

Le ton doit rester :
- Simple  
- Rassurant  
- Québecois  
- Non technique  

---

## 2. OPTIONS DE CONNEXION

L'utilisateur doit pouvoir choisir entre :

### A) **Google Calendar (OAuth Google)**
Bouton : **"Se connecter avec Google"**

Permissions demandées :
- Calendars.ReadWrite  
- Userinfo.profile  

### B) **Microsoft Calendar (Outlook / Office 365 via Graph API)**
Bouton : **"Se connecter avec Microsoft"**

Permissions demandées :
- Calendars.ReadWrite  
- User.Read  

### C) **Option : Sauter cette étape**
Bouton : **"Je veux sauter cette étape."**

Si l'utilisateur saute :
- Marquer l'étape comme complétée  
- Passer à la prochaine étape  
- L'assistant IA fonctionne, mais sans gestion automatique de disponibilité  

---

## 3. MODE SIMPLE (PAR DÉFAUT)

Le mode simple doit afficher :

### A) Explication courte
« On va connecter ton calendrier.  
Ça permet à ton assistant de connaître ta disponibilité et d'éviter les conflits. »

### B) Deux gros boutons OAuth
- "Se connecter avec Google"  
- "Se connecter avec Microsoft"  

### C) Après la connexion
Afficher :
- Nom du compte  
- Adresse courriel  
- Icône de succès  
- Liste des calendriers détectés  
- Choix du calendrier principal (dropdown)  
- Bouton "Tester la synchronisation"  

### D) Test de synchronisation
Appel placeholder :

```
POST /api/setup/test-calendar
{
  provider: "google" | "microsoft",
  calendarId: "..."
}
```

Cursor NE DOIT PAS implémenter le backend.

### E) États visuels
- Chargement (spinner)  
- Succès (check vert + message)  
- Erreur (rouge + message)  

---

## 4. MODE AVANCÉ (OPTIONNEL)

Accessible via un bouton :

**"Options avancées"**

Contenu :
- Liste complète des calendriers  
- Possibilité d'en sélectionner plusieurs (lecture seule pour l'instant)  
- Option "Créer un calendrier dédié Planexa" (désactivée pour l'instant)  
- Option "Ignorer les événements marqués comme 'Occupé'" (désactivée)  

Toutes les options avancées doivent être **visibles mais non fonctionnelles**.

---

## 5. MODE MANUEL

Le mode manuel doit afficher :

- Un texte simple :  
  « Entre l'identifiant de ton calendrier. »  
- Un champ texte : Calendar ID  
- Un bouton "Enregistrer"  
- Aucun texte conversationnel  
- Aucun test automatique  

---

## 6. COMPORTEMENT EN MODE GUIDÉ

Le ton doit être chaleureux et rassurant :

### Exemple de texte guidé :
« Parfait! Maintenant, on va connecter ton calendrier.  
Ça va permettre à ton assistant de réserver des rendez-vous sans conflit. »

### Après la connexion :
« Super! On va tester la synchronisation pour s'assurer que tout fonctionne. »

### Succès :
« Excellent! Ton assistant pourra gérer ta disponibilité. »

### Erreur :
« Hmm… on dirait que ça ne fonctionne pas.  
On peut réessayer ensemble. »

---

## 7. STYLE VISUEL

Respecter le style Microsoft Fluent défini dans la Section 1 :

- Cartes arrondies  
- Couleurs douces  
- Icônes simples  
- Transitions fluides  
- Accessibilité élevée  
- Support du mode sombre  

---

## 8. EXIGENCES DU COMPOSANT (ConnectCalendar.tsx)

Cursor doit implémenter :

- UI complète du mode simple (Google + Microsoft)  
- Sélection du calendrier principal  
- UI du mode avancé (désactivé)  
- UI du mode manuel  
- Validation visuelle  
- Appel placeholder pour "test calendar sync"  
- Gestion des états (succès, erreur, chargement)  
- Intégration avec SetupFlow (nextStep, backStep, mode)  
- Bouton "Sauter cette étape"  

Cursor NE DOIT PAS implémenter :
- Le backend  
- La logique réelle de synchronisation  
- Les options avancées fonctionnelles  
- Les intégrations futures  

---

## 9. RÈGLE IMPORTANTE POUR CURSOR

Cursor doit traiter ceci comme **Section 6 seulement**.  
Il NE DOIT PAS implémenter les étapes suivantes :

- ConnectNotion  
- ChooseTone  
- ChooseTheme  
- Finish  

Ces étapes seront définies dans les sections suivantes.

---

# SECTION 7 — CHOOSETONE (TON DE L'ASSISTANT)

(Ceci est la Section 7 seulement. Cursor NE DOIT PAS implémenter les sections suivantes.)

---

## 1. OBJECTIF DE CETTE SECTION

Cette section définit le comportement et l'interface du composant **ChooseTone.tsx**.

Le but est d'aider l'utilisateur à choisir la personnalité et le ton de son assistant Planexa, afin que :

- Les réponses reflètent son style  
- Les messages soient cohérents avec sa marque  
- Les interactions soient naturelles et personnalisées  

Le ton doit rester :
- Simple  
- Rassurant  
- Québecois  
- Non technique  

---

## 2. OPTIONS DE TON

L'utilisateur doit pouvoir choisir entre **5 tons prédéfinis** + **1 ton personnalisé**.

### A) **Chaleureux / Amical (par défaut)**
Icône : 😊  
Description :  
« Doux, accueillant, proche, typiquement québécois. »  
Exemple :  
« Allô! Merci d'avoir écrit. Je regarde ça tout de suite. »

### B) **Professionnel / Neutre**
Icône : 🧑‍💼  
Description :  
« Clair, poli, formel, idéal pour entreprises. »  
Exemple :  
« Bonjour, merci pour votre message. Je vous reviens rapidement. »

### C) **Direct / Efficace**
Icône : ⚡  
Description :  
« Court, précis, va droit au but. »  
Exemple :  
« Reçu. Je m'en occupe. »

### D) **Enthousiaste / Énergique**
Icône : ✨  
Description :  
« Positif, motivant, dynamique. »  
Exemple :  
« Super nouvelle! Je m'occupe de ça immédiatement! »

### E) **Sérieux / Calme**
Icône : 🧘  
Description :  
« Stable, posé, rassurant. »  
Exemple :  
« Merci pour votre message. Je vais traiter votre demande. »

### F) **Personnalisé**
Icône : 🎨  
Champs :  
- « Décris le ton que tu veux » (textarea)  
- Exemple généré automatiquement (placeholder statique)  

---

## 3. MODE SIMPLE (PAR DÉFAUT)

Le mode simple doit afficher :

### A) Explication courte
« Choisis le ton que ton assistant va utiliser lorsqu'il parle à tes clients. »

### B) Grille de cartes (6 options)
Chaque carte doit contenir :
- Icône  
- Nom du ton  
- Description courte  
- Exemple de message  
- Sélection visuelle (bordure bleue)  

### C) Bouton "Continuer"
Activé seulement après sélection.

### D) Option : "Je veux sauter cette étape"
Si l'utilisateur saute :
- Ton = "Chaleureux / Amical"  
- Marquer l'étape comme complétée  
- Passer à la prochaine étape  

---

## 4. MODE AVANCÉ (OPTIONNEL)

Accessible via un bouton :

**"Options avancées"**

Contenu :
- Curseur "Niveau de formalité" (désactivé)  
- Curseur "Niveau d'humour" (désactivé)  
- Curseur "Niveau d'énergie" (désactivé)  
- Message : "Fonctionnalités avancées bientôt disponibles."  

Toutes les options avancées doivent être **visibles mais non fonctionnelles**.

---

## 5. MODE MANUEL

Le mode manuel doit afficher :

- Un texte simple :  
  « Choisis un ton ou écris le tien. »  
- Les 6 options sous forme de liste simple  
- Un champ texte pour ton personnalisé  
- Un bouton "Enregistrer"  
- Aucun texte conversationnel  

---

## 6. COMPORTEMENT EN MODE GUIDÉ

Le ton doit être chaleureux et rassurant :

### Exemple de texte guidé :
« Parfait! Maintenant, on va choisir comment ton assistant parle.  
Tu peux rester simple ou choisir un style plus personnalisé. »

### Après la sélection :
« Super choix! Ton assistant va maintenant parler dans ce style. »

---

## 7. STYLE VISUEL

Respecter le style Microsoft Fluent défini dans la Section 1 :

- Cartes arrondies  
- Icônes simples  
- Couleurs douces  
- Transitions fluides  
- Accessibilité élevée  
- Support du mode sombre  

---

## 8. EXIGENCES DU COMPOSANT (ChooseTone.tsx)

Cursor doit implémenter :

- UI complète du mode simple (6 cartes)  
- UI du ton personnalisé  
- UI du mode avancé (désactivé)  
- UI du mode manuel  
- Validation visuelle  
- Gestion des états (sélection, succès)  
- Intégration avec SetupFlow (nextStep, backStep, mode)  
- Bouton "Sauter cette étape"  

Cursor NE DOIT PAS implémenter :
- Le backend  
- La logique réelle de génération de ton  
- Les options avancées fonctionnelles  

---

## 9. RÈGLE IMPORTANTE POUR CURSOR

Cursor doit traiter ceci comme **Section 7 seulement**.  
Il NE DOIT PAS implémenter les étapes suivantes :

- ChooseTheme  
- Finish  

Ces étapes seront définies dans les sections suivantes.

---

# SECTION 8 — CHOOSETHEME (THÈME VISUEL)

(Ceci est la Section 8 seulement. Cursor NE DOIT PAS implémenter la Section 9.)

---

## 1. OBJECTIF DE CETTE SECTION

Cette section définit le comportement et l'interface du composant **ChooseTheme.tsx**.

Le but est d'aider l'utilisateur à choisir l'apparence visuelle de son espace Planexa, afin que :

- L'interface reflète son style  
- L'expérience soit confortable pour ses yeux  
- Le thème soit cohérent avec sa marque  

Le ton doit rester :
- Simple  
- Rassurant  
- Québecois  
- Non technique  

---

## 2. OPTIONS DE THÈME

L'utilisateur doit pouvoir choisir entre **4 thèmes principaux** + **2 options avancées**.

### A) **Clair (par défaut)**
Icône : 🌞  
Description :  
« Lumineux, propre, facile à lire. »

### B) **Sombre**
Icône : 🌙  
Description :  
« Doux pour les yeux, idéal le soir. »

### C) **Minuit**
Icône : 🌌  
Description :  
« Contraste élevé, ambiance premium. »

### D) **Haut contraste**
Icône : ⚫⚪  
Description :  
« Lisibilité maximale, accessibilité renforcée. »

### E) **Couleur d'accent (option avancée)**
- Sélecteur de couleur (désactivé)  
- Message : « Personnalisation bientôt disponible. »

### F) **Taille de police (option avancée)**
- Curseur (désactivé)  
- Message : « Option bientôt disponible. »

---

## 3. MODE SIMPLE (PAR DÉFAUT)

Le mode simple doit afficher :

### A) Explication courte
« Choisis le thème visuel de ton espace Planexa. »

### B) Grille de cartes (4 thèmes)
Chaque carte doit contenir :
- Icône  
- Nom du thème  
- Description courte  
- Aperçu visuel (rectangle stylisé)  
- Sélection visuelle (bordure bleue)  

### C) Bouton "Continuer"
Activé seulement après sélection.

### D) Option : "Je veux sauter cette étape"
Si l'utilisateur saute :
- Thème = "Clair"  
- Marquer l'étape comme complétée  
- Passer à la prochaine étape  

---

## 4. MODE AVANCÉ

Accessible via un bouton :

**"Options avancées"**

Contenu :
- Sélecteur de couleur d'accent (désactivé)  
- Curseur de taille de police (désactivé)  
- Message :  
  « Les options de personnalisation avancée arrivent bientôt. »

Toutes les options avancées doivent être **visibles mais non fonctionnelles**.

---

## 5. MODE MANUEL

Le mode manuel doit afficher :

- Un texte simple :  
  « Choisis ton thème visuel. »  
- Les 4 thèmes sous forme de liste simple  
- Un bouton "Enregistrer"  
- Aucun texte conversationnel  

---

## 6. COMPORTEMENT EN MODE GUIDÉ

Le ton doit être chaleureux et rassurant :

### Exemple de texte guidé :
« Parfait! Maintenant, on va choisir l'apparence de ton espace.  
Tu peux rester simple ou choisir un style plus contrasté. »

### Après la sélection :
« Super! Ton espace va maintenant utiliser ce thème. »

---

## 7. STYLE VISUEL

Respecter le style Microsoft Fluent défini dans la Section 1 :

- Cartes arrondies  
- Icônes simples  
- Couleurs douces  
- Aperçus visuels stylisés  
- Transitions fluides  
- Accessibilité élevée  
- Support du mode sombre  

---

## 8. EXIGENCES DU COMPOSANT (ChooseTheme.tsx)

Cursor doit implémenter :

- UI complète du mode simple (4 cartes)  
- UI du mode avancé (désactivé)  
- UI du mode manuel  
- Validation visuelle  
- Gestion des états (sélection, succès)  
- Intégration avec SetupFlow (nextStep, backStep, mode)  
- Bouton "Sauter cette étape"  

Cursor NE DOIT PAS implémenter :
- Le backend  
- La logique réelle de changement de thème global  
- Les options avancées fonctionnelles  

---

## 9. RÈGLE IMPORTANTE POUR CURSOR

Cursor doit traiter ceci comme **Section 8 seulement**.  
Il NE DOIT PAS implémenter la Section 9 (Finish).
