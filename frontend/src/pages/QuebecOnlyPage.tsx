import { useState, useEffect } from 'react';
import { MapPin, Heart, ArrowLeft, Mail } from 'lucide-react';

// ============================================================================
// PLANEXO - Québec-Only Access Page ⚜️
// Premium, animated page for users outside Québec
// Montréal-crafted • Region-sovereign • Mythic texture
// ============================================================================

export default function QuebecOnlyPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className={`relative max-w-lg w-full text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Fleur de lys icon with animation */}
        <div className="mb-8">
          <div className="relative w-28 h-28 mx-auto">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 blur-xl opacity-40 animate-pulse-slow" />
            {/* Main icon */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl animate-float-gentle">
              <span className="text-6xl filter drop-shadow-lg">⚜️</span>
            </div>
            {/* Subtle shimmer */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Main message */}
        <h1 className={`text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Planexo, c'est pour le Québec
        </h1>

        <p className={`text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Notre plateforme est présentement disponible seulement pour les gens du Québec.
          <span className="block mt-2 text-blue-600 dark:text-blue-400 font-medium">
            C'est comme ça qu'on bâtit quelque chose de local, pour notre monde à nous.
          </span>
        </p>

        {/* Location card */}
        <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200/50 dark:border-slate-700/50 mb-8 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
            <MapPin className="w-5 h-5" />
            <span className="font-semibold">Villes desservies</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {['Montréal', 'Québec', 'Laval', 'Longueuil', 'Gatineau', 'Sherbrooke', 'Trois-Rivières'].map((city, index) => (
              <span
                key={city}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200/50 dark:border-blue-700/50 transition-transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {city}
              </span>
            ))}
          </div>
        </div>

        {/* Why Quebec */}
        <div className={`text-sm text-slate-500 dark:text-slate-400 mb-8 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-red-500 animate-heartbeat" />
            <span>Fait avec amour à Montréal</span>
          </div>
          <p className="text-slate-400 dark:text-slate-500">
            On construit Planexo pour notre monde d'abord.
            <br />
            D'autres régions vont suivre bientôt.
          </p>
        </div>

        {/* Contact */}
        <div className={`transition-all duration-700 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <a
            href="mailto:bonjour@planexo.ca"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all hover:scale-105 hover:shadow-lg shadow-blue-500/25"
          >
            <Mail className="w-4 h-4" />
            Nous écrire
          </a>
        </div>

        {/* Back button */}
        <div className={`mt-6 transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>

        {/* Footer */}
        <div className={`mt-12 pt-8 border-t border-slate-200/50 dark:border-slate-700/50 transition-all duration-700 delay-800 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center gap-3 text-slate-400 dark:text-slate-500 text-sm">
            <span className="animate-pulse-slow">⚜️</span>
            <span className="font-medium">Planexo</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="animate-maple">Fait au Québec 🍁</span>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(1.1); }
        }
        @keyframes maple {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; }
        .animate-float-gentle { animation: float-gentle 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
        .animate-heartbeat { animation: heartbeat 2s ease-in-out infinite; }
        .animate-maple { animation: maple 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
