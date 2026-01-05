import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { frCA } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';

const locales = {
    'fr-CA': frCA,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const generateMockEvents = () => {
    const now = new Date();
    return [
        {
            title: 'Réunion d\'équipe',
            start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 30),
        },
        {
            title: 'Dîner avec client',
            start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12, 0),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 13, 30),
        },
        {
            title: 'Fête de la St-Jean',
            start: new Date(now.getFullYear(), 5, 24), // June 24th
            end: new Date(now.getFullYear(), 5, 25),
            allDay: true,
        },
    ];
};

export default function CalendarView() {
    const [events] = useState(generateMockEvents());

    return (
        <div style={{ height: '700px' }} className="bg-[var(--bg-secondary)] backdrop-blur-sm rounded-xl p-6 shadow-xl border border-[var(--border-color)] transition-colors duration-300">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                culture='fr-CA'
                messages={{
                    next: "Suivant",
                    previous: "Précédent",
                    today: "Aujourd'hui",
                    month: "Mois",
                    week: "Semaine",
                    day: "Jour",
                    agenda: "Agenda",
                    date: "Date",
                    time: "Heure",
                    event: "Événement",
                    noEventsInRange: "Aucun événement dans cette plage",
                }}
            />
        </div>
    );
}
