import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import AvailabilityForm from '@/components/AvailabilityForm'
import BookingsList from '@/components/BookingsList'
import CopyButton from '@/components/CopyButton'

export const dynamic = 'force-dynamic';

const DEFAULT_USER_ID = 'demo-user'

async function getOrCreateUser() {
  let user = await prisma.user.findUnique({
    where: { id: DEFAULT_USER_ID },
    include: {
      availabilities: {
        orderBy: { dayOfWeek: 'asc' }
      },
      bookings: {
        orderBy: { startTime: 'desc' },
        take: 10
      }
    }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: DEFAULT_USER_ID,
        email: 'demo@planexa.ca',
        name: 'Utilisateur Démo',
        slug: 'demo',
        timezone: 'America/Montreal'
      },
      include: {
        availabilities: true,
        bookings: true
      }
    })
  }

  return user
}

export default async function DashboardPage() {
  const user = await getOrCreateUser()
  const bookingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${user.slug}`

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Planexa
            </Link>
            <div className="text-sm text-gray-600">
              Connecté en tant que: <span className="font-semibold">{user.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Tableau de bord
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Mes disponibilités</h2>
            <p className="text-gray-600 mb-6">
              Configurez les jours et heures où vous êtes disponible pour des rendez-vous.
            </p>
            <AvailabilityForm 
              userId={user.id} 
              existingAvailabilities={user.availabilities} 
            />
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Lien de réservation</h2>
              <p className="text-gray-600 mb-4">
                Partagez ce lien avec vos clients pour qu'ils puissent réserver un rendez-vous:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bookingUrl}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <CopyButton text={bookingUrl} />
              </div>
              <Link 
                href={`/${user.slug}`}
                target="_blank"
                className="inline-block mt-4 text-blue-600 hover:underline"
              >
                Voir la page de réservation →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Réservations récentes</h2>
              <BookingsList bookings={user.bookings} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
