import { Router } from 'express';
import prisma from '../lib/prisma';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);
const router = Router();

// GET /api/event-types - List available services
router.get('/event-types', async (req, res) => {
    try {
        const eventTypes = await prisma.eventType.findMany({
            where: { isActive: true },
            include: { user: { select: { name: true, avatarUrl: true } } }
        });
        res.json(eventTypes);
    } catch (error) {
        console.error('Error fetching event types:', error);
        res.status(500).json({ error: 'Failed to fetch event types' });
    }
});

// POST /api/bookings - Create a new booking
router.post('/bookings', async (req, res) => {
    const { eventTypeId, startTime, attendeeName, attendeeEmail, notes } = req.body;

    if (!eventTypeId || !startTime || !attendeeName || !attendeeEmail) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Fetch event type to get duration and userId
        const eventType = await prisma.eventType.findUnique({
            where: { id: eventTypeId }
        });

        if (!eventType) {
            return res.status(404).json({ error: 'Event type not found' });
        }

        const start = new Date(startTime);
        const end = new Date(start.getTime() + eventType.duration * 60000);

        const booking = await prisma.booking.create({
            data: {
                startTime: start,
                endTime: end,
                attendeeName,
                attendeeEmail,
                notes,
                eventTypeId,
                userId: eventType.userId,
                status: 'CONFIRMED'
            }
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// POST /api/seed - Initialize DB with default data (Protected by simple header check if needed, or open for MVP)
router.post('/seed', async (req, res) => {
    try {
        // 1. Check if ANY user exists
        const userCount = await prisma.user.count();
        if (userCount > 0) {
            return res.status(400).json({ message: 'Database already seeded' });
        }

        // 2. Create Default Organization
        const org = await prisma.organization.create({
            data: {
                name: 'Planexa Demo Org',
                plan: 'PERSONAL'
            }
        });

        // 3. Create Default User
        const user = await prisma.user.create({
            data: {
                email: 'demo@planexa.io',
                name: 'Dr. Tristan (Démo)',
                passwordHash: 'hashed_secret', // Placeholder
                role: 'OWNER',
                organizationId: org.id,
                bio: 'Spécialiste en Planification Stratégique',
                language: 'fr-CA'
            }
        });

        // 4. Create Event Types
        await prisma.eventType.createMany({
            data: [
                {
                    title: 'Consultation Initiale',
                    slug: 'consultation-30min',
                    description: 'Discussion préliminaire pour évaluer vos besoins.',
                    duration: 30,
                    userId: user.id,
                    isActive: true,
                    color: '#4F46E5' // Indigo
                },
                {
                    title: 'Planification Complète',
                    slug: 'planning-60min',
                    description: 'Séance de travail intensive.',
                    duration: 60,
                    userId: user.id,
                    isActive: true,
                    color: '#10B981' // Emerald
                }
            ]
        });

        res.json({ message: 'Seeding complete! User and EventTypes created.' });

    } catch (error: any) {
        console.error('Seeding error:', error);
        
        // Auto-heal: If table missing, run db push
        if (error.code === 'P2021' || (error.message && error.message.includes('table'))) { // P2021 is "table does not exist"
            try {
                console.log('Tables missing, attempting to migrate...');
                await execAsync('npx prisma db push --accept-data-loss');
                console.log('Migration successful. Please retry seeding.');
                return res.status(503).json({ error: 'Database migrated. Please retry request.' });
            } catch (migrateError: any) {
                console.error('Migration failed:', migrateError);
                return res.status(500).json({ error: 'Migration failed', details: migrateError.message });
            }
        }

        res.status(500).json({ 
            error: 'Seeding failed', 
            message: error.message, 
            code: error.code,
            meta: error.meta
        });
    }
});

export default router;
