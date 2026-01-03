import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* En-tête */}
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Bienvenue sur Planexa
          </h1>
          <p className="text-xl text-gray-700 mb-12">
            L'outil de planification de rendez-vous simple et efficace, entièrement en français
          </p>

          {/* Cards de fonctionnalités */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">📅</div>
              <h2 className="text-2xl font-semibold mb-4">Pour les professionnels</h2>
              <p className="text-gray-600 mb-6">
                Configurez vos disponibilités et partagez votre lien de réservation
              </p>
              <Link 
                href="/dashboard"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Accéder au tableau de bord
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">🔗</div>
              <h2 className="text-2xl font-semibold mb-4">Pour les clients</h2>
              <p className="text-gray-600 mb-6">
                Réservez un rendez-vous en quelques clics
              </p>
              <Link 
                href="/demo"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Voir un exemple
              </Link>
            </div>
          </div>

          {/* Fonctionnalités */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-left">
            <h3 className="text-2xl font-semibold mb-6 text-center">Fonctionnalités principales</h3>
            <ul className="grid md:grid-cols-2 gap-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>Interface entièrement en français canadien</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>Gestion des disponibilités flexible</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>Lien de réservation personnalisé</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>Notifications par courriel</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>Format de date français canadien</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>Design épuré et moderne</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
