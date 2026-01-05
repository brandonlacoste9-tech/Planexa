import { useState, useEffect } from 'react';
import { Clock, X, ChevronRight, User, Mail, FileText, Check } from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';
import { frCA, enUS } from 'date-fns/locale';
import { useLanguage } from '../contexts/LanguageContext';

interface EventType {
    id: string;
    title: string;
    description: string;
    duration: number;
    color: string;
    user: {
        name: string;
        avatarUrl?: string;
    };
}

export default function BookingFlow({ onClose }: { onClose: () => void }) {
    const { t, lang, setLang } = useLanguage();
    const [step, setStep] = useState(1);
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [selectedService, setSelectedService] = useState<EventType | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', notes: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch Event Types
    useEffect(() => {
        // @ts-ignore
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        fetch(`${apiUrl}/event-types`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setEventTypes(data);
            })
            .catch(err => console.error(err));
    }, []);

    // Step 1: Select Service
    const handleServiceSelect = (service: EventType) => {
        setSelectedService(service);
        setStep(2);
    };

    // Step 2: Select Date & Time (Mocked slots)
    const availableSlots = ['09:00', '10:00', '11:00', '13:00', '14:30', '16:00'];
    const nextDays = Array.from({ length: 5 }, (_, i) => addDays(startOfToday(), i + 1));
    const currentLocale = lang === 'fr' ? frCA : enUS;

    const handleSlotSelect = (date: Date, slot: string) => {
        setSelectedDate(date);
        setSelectedSlot(slot);
        setStep(3);
    };

    // Step 3: Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!selectedService || !selectedDate || !selectedSlot) return;

        // Construct Start Time
        const [hours, minutes] = selectedSlot.split(':').map(Number);
        const startTime = new Date(selectedDate);
        startTime.setHours(hours, minutes, 0, 0);

        try {
            // @ts-ignore
            const apiUrl = import.meta.env.VITE_API_URL || '/api';
            const res = await fetch(`${apiUrl}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventTypeId: selectedService.id,
                    startTime: startTime.toISOString(),
                    attendeeName: formData.name,
                    attendeeEmail: formData.email,
                    notes: formData.notes
                })
            });

            if (!res.ok) throw new Error('Booking failed');
            setStep(4); // Success
        } catch (err) {
            setError(lang === 'fr' ? 'Une erreur est survenue. Veuillez réessayer.' : 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-primary)]">
                    <div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">
                            {step === 1 && t('booking.select_service')}
                            {step === 2 && t('booking.date_time')}
                            {step === 3 && t('booking.contact_info')}
                            {step === 4 && t('booking.success_title')}
                        </h2>
                        {step < 4 && <p className="text-sm text-[var(--text-secondary)]">{t('booking.step')} {step} / 3</p>}
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Language Toggle */}
                        <button
                            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                            className="text-sm font-medium px-3 py-1.5 rounded-full border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-2"
                        >
                            {lang === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
                        </button>

                        {step < 4 && (
                            <button onClick={onClose} className="p-2 hover:bg-[var(--bg-secondary)] rounded-full text-[var(--text-secondary)]">
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">

                    {/* STEP 1: SERVICES */}
                    {step === 1 && (
                        <div className="grid gap-4">
                            {eventTypes.length === 0 ? (
                                <div className="space-y-4">
                                    {/* Mock data loading state or actual empty state fallback */}
                                    {[1, 2].map(i => (
                                        <div key={i} className="animate-pulse flex items-center p-4 rounded-xl border border-[var(--border-color)]">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                eventTypes.map(service => (
                                    <button
                                        key={service.id}
                                        onClick={() => handleServiceSelect(service)}
                                        className="flex items-start gap-4 p-4 rounded-xl border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:bg-[var(--bg-primary)] transition-all text-left group"
                                    >
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: service.color || '#666' }}>
                                            {service.title.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">
                                                {service.title}
                                            </h3>
                                            <p className="text-sm text-[var(--text-secondary)] mt-1">{service.description}</p>
                                            <div className="flex items-center gap-2 mt-2 text-xs font-medium text-[var(--text-secondary)]">
                                                <Clock size={14} /> {service.duration} {t('booking.duration')}
                                                <span className="mx-1">•</span>
                                                <User size={14} /> {service.user.name}
                                            </div>
                                        </div>
                                        <ChevronRight className="ml-auto text-[var(--text-secondary)] self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {/* STEP 2: DATES */}
                    {step === 2 && selectedService && (
                        <div>
                            <div className="mb-6 flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedService.color }}></span>
                                <span className="font-medium text-[var(--text-primary)]">{selectedService.title}</span>
                                <span className="text-[var(--text-secondary)] text-sm">• {selectedService.duration} {t('booking.duration')}</span>
                                <button onClick={() => setStep(1)} className="ml-auto text-xs text-[var(--accent-color)] hover:underline">{lang === 'fr' ? 'Modifier' : 'Edit'}</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase">{lang === 'fr' ? 'Jours disponibles' : 'Available Days'}</h3>
                                    {nextDays.map(date => (
                                        <button
                                            key={date.toString()}
                                            onClick={() => setSelectedDate(date)}
                                            className={`w-full text-left p-3 rounded-lg border transition-all ${selectedDate?.toDateString() === date.toDateString()
                                                ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-white'
                                                : 'border-[var(--border-color)] hover:bg-[var(--bg-primary)] text-[var(--text-primary)]'
                                                }`}
                                        >
                                            {format(date, 'EEEE d MMMM', { locale: currentLocale }).charAt(0).toUpperCase() + format(date, 'EEEE d MMMM', { locale: currentLocale }).slice(1)}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase">{lang === 'fr' ? 'Heures' : 'Times'}</h3>
                                    {selectedDate ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            {availableSlots.map(slot => (
                                                <button
                                                    key={slot}
                                                    onClick={() => handleSlotSelect(selectedDate, slot)}
                                                    className="p-2 rounded-md border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] text-[var(--text-primary)] transition-colors"
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-[var(--text-secondary)] italic">{lang === 'fr' ? 'Sélectionnez une date pour voir les heures.' : 'Select a date to view times.'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: FORM */}
                    {step === 3 && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="mb-6 p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[var(--text-secondary)]">{t('booking.select_service')}</span>
                                    <span className="font-medium text-[var(--text-primary)]">{selectedService?.title}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[var(--text-secondary)]">{t('booking.date_time')}</span>
                                    <span className="font-medium text-[var(--text-primary)] max-w-[200px] text-right">
                                        {selectedDate && format(selectedDate, 'd MMMM', { locale: currentLocale })} {lang === 'fr' ? 'à' : 'at'} {selectedSlot}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-primary)]">{t('booking.name_label')}</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-[var(--text-secondary)]" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent outline-none transition-all"
                                        placeholder="Jean Tremblay"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-primary)]">{t('booking.email_label')}</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-[var(--text-secondary)]" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent outline-none transition-all"
                                        placeholder="jean@exemple.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-primary)]">{t('booking.notes_label')}</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 text-[var(--text-secondary)]" size={18} />
                                    <textarea
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent outline-none transition-all min-h-[100px]"
                                        placeholder={lang === 'fr' ? "Détails supplémentaires..." : "Additional details..."}
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors">
                                    {t('booking.back')}
                                </button>
                                <button type="submit" disabled={loading} className="flex-1 py-3 rounded-lg bg-[var(--accent-color)] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                                    {loading ? '...' : t('booking.confirm')}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* STEP 4: SUCCESS */}
                    {step === 4 && (
                        <div className="text-center py-10 animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check size={40} strokeWidth={3} />
                            </div>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{t('booking.success_title')}</h2>
                            <p className="text-[var(--text-secondary)] mb-8">{t('booking.success_msg')}</p>
                            <button
                                onClick={onClose}
                                className="px-8 py-3 rounded-lg bg-[var(--accent-color)] text-white font-medium hover:opacity-90 transition-opacity"
                            >
                                {t('booking.close')}
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
