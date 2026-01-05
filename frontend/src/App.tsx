import { useEffect, useState } from 'react';
import CalendarView from './components/CalendarView';
import BookingFlow from './components/BookingFlow';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
    const [apiStatus, setApiStatus] = useState<string>('Checking...');
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        // @ts-ignore
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        fetch(`${apiUrl}/`)
            .then(res => res.json())
            .then(() => setApiStatus('Online 🟢'))
            .catch(() => setApiStatus('Offline 🔴'));
    }, []);

    return (
        <LanguageProvider>
            <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans transition-colors duration-300">
                <header className="px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-4xl font-extrabold text-[var(--accent-color)] tracking-tight">
                            Planexa
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                                Planification simplifiée • Québec
                            </p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)]">
                                API: {apiStatus}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {/* Theme Toggles */}
                        <div className="flex gap-2 mr-4 bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border-color)]">
                            <button onClick={() => document.documentElement.setAttribute('data-theme', 'light')} className="p-2 hover:bg-[var(--bg-primary)] rounded transition-colors" title="Mode Jour">☀️</button>
                            <button onClick={() => document.documentElement.setAttribute('data-theme', 'dark')} className="p-2 hover:bg-[var(--bg-primary)] rounded transition-colors" title="Mode Nuit">🌙</button>
                            <button onClick={() => document.documentElement.setAttribute('data-theme', 'midnight')} className="p-2 hover:bg-[var(--bg-primary)] rounded transition-colors" title="Mode Minuit">🌌</button>
                        </div>

                        <button className="px-5 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg font-semibold hover:bg-[var(--bg-primary)] transition-all shadow-sm">
                            Connexion
                        </button>
                        <button
                            onClick={() => setIsBookingOpen(true)}
                            className="px-5 py-2.5 bg-[var(--accent-color)] text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Réserver un Moment
                        </button>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-8 py-8">
                    <CalendarView />
                </main>

                {isBookingOpen && <BookingFlow onClose={() => setIsBookingOpen(false)} />}
            </div>
        </LanguageProvider>
    )
}

export default App
