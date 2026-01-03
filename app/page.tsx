import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Planexa
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Simplifiez la planification de vos rendez-vous
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Partagez votre disponibilité, laissez vos clients choisir un créneau et recevez des confirmations automatiques.
            Tout en français canadien.
          </p>
        </div>

        {/* Fonctionnalités */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-primary-600 text-3xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-3">Définissez vos disponibilités</h3>
            <p className="text-gray-600">
              Configurez vos horaires disponibles par jour de la semaine selon votre emploi du temps.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-primary-600 text-3xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold mb-3">Partagez votre lien</h3>
            <p className="text-gray-600">
              Obtenez un lien unique à partager avec vos clients pour qu&apos;ils réservent facilement.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-primary-600 text-3xl mb-4">✉️</div>
            <h3 className="text-xl font-semibold mb-3">Recevez des confirmations</h3>
            <p className="text-gray-600">
              Vous et vos clients recevez automatiquement des courriels de confirmation en français.
            </p>
          </div>
        </div>

        {/* Démo */}
        <div className="text-center bg-white p-12 rounded-lg shadow-lg max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Essayez la démo</h2>
          <p className="text-gray-600 mb-8">
            Découvrez comment vos clients peuvent réserver un rendez-vous avec vous.
          </p>
          <Link
            href="/reserver/marie-tremblay"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Voir la page de réservation
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Exemple de lien : planexa.com/reserver/marie-tremblay
          </p>
        </div>

        {/* Pied de page */}
        <div className="text-center mt-16 text-gray-500">
          <p>Planexa - Outil de planification en français canadien</p>
        </div>
      </div>
    </main>
  );
}
