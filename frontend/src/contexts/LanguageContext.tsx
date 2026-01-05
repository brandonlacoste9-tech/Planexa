import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

const LanguageContext = createContext<{
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: string) => string;
}>({
    lang: 'fr',
    setLang: () => { },
    t: (key) => key,
});

const translations: Record<Language, Record<string, string>> = {
    fr: {
        'booking.title': 'Réserver un Moment',
        'booking.select_service': 'Choisir un Service',
        'booking.consultation': 'Consultation Initiale',
        'booking.planning': 'Planification Complète',
        'booking.duration': 'min',
        'booking.cost': 'Gratuit',
        'booking.next': 'Suivant',
        'booking.back': 'Retour',
        'booking.confirm': 'Confirmer le Rendez-vous',
        'booking.name_label': 'Votre Nom',
        'booking.email_label': 'Courriel',
        'booking.notes_label': 'Notes (Optionnel)',
        'booking.success_title': 'Rendez-vous Confirmé!',
        'booking.success_msg': 'Un courriel de confirmation a été envoyé.',
        'booking.close': 'Fermer',
        'booking.date_time': 'Date et Heure',
        'booking.contact_info': 'Vos Coordonnées',
        'booking.step': 'Étape'
    },
    en: {
        'booking.title': 'Book an Appointment',
        'booking.select_service': 'Select a Service',
        'booking.consultation': 'Initial Consultation',
        'booking.planning': 'Full Planning Session',
        'booking.duration': 'min',
        'booking.cost': 'Free',
        'booking.next': 'Next',
        'booking.back': 'Back',
        'booking.confirm': 'Confirm Appointment',
        'booking.name_label': 'Your Name',
        'booking.email_label': 'Email Address',
        'booking.notes_label': 'Notes (Optional)',
        'booking.success_title': 'Appointment Confirmed!',
        'booking.success_msg': 'A confirmation email has been sent.',
        'booking.close': 'Close',
        'booking.date_time': 'Date & Time',
        'booking.contact_info': 'Contact Info',
        'booking.step': 'Step'
    },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Language>('fr');

    const t = (key: string) => translations[lang][key] || key;

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
