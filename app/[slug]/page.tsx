import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BookingCalendar from '@/components/BookingCalendar'

export const dynamic = 'force-dynamic';

interface BookingPageProps {
  params: Promise<{ slug: string }>
}

async function getUser(slug: string) {
  const user = await prisma.user.findUnique({
    where: { slug },
    include: {
      availabilities: {
        orderBy: { dayOfWeek: 'asc' }
      }
    }
  })

  return user
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { slug } = await params
  const user = await getUser(slug)

  if (!user) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Réservez un rendez-vous avec {user.name}
              </h1>
              <p className="text-gray-600">
                Sélectionnez une date et une heure qui vous conviennent
              </p>
            </div>

            <BookingCalendar user={user} />
          </div>

          <div className="text-center mt-6 text-sm text-gray-600">
            <p>Propulsé par <span className="font-semibold text-blue-600">Planexa</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
