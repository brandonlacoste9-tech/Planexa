import { useState } from 'react';
import {
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Shield,
  Sparkles,
  Check,
  ArrowRight,
  Play,
  Star,
  Users,
  Zap,
  Globe,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';

// ============================================================================
// PLANEXO LANDING PAGE
// Premium, Quebec-first AI scheduling assistant
// ============================================================================

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans transition-colors duration-300">
      {/* ================================================================== */}
      {/* NAVIGATION */}
      {/* ================================================================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Planexo
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                FAQ
              </a>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-primary)] transition-colors"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors">
                Sign In
              </button>
              <button className="px-5 py-2.5 bg-[var(--accent-color)] text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Free Trial
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
            <div className="px-6 py-4 space-y-4">
              <a href="#features" className="block text-sm font-medium">Features</a>
              <a href="#how-it-works" className="block text-sm font-medium">How It Works</a>
              <a href="#pricing" className="block text-sm font-medium">Pricing</a>
              <a href="#faq" className="block text-sm font-medium">FAQ</a>
              <div className="pt-4 border-t border-[var(--border-color)] space-y-3">
                <button className="w-full px-4 py-2 text-sm font-medium border border-[var(--border-color)] rounded-xl">
                  Sign In
                </button>
                <button className="w-full px-4 py-2.5 bg-[var(--accent-color)] text-white rounded-xl font-semibold">
                  Free Trial
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ================================================================== */}
      {/* HERO SECTION */}
      {/* ================================================================== */}
      <section className="pt-32 pb-20 px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Nouveau — Assistant IA pour entreprises québécoises</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Ton assistant qui
              <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                répond pour toi
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
              Planexo gère tes appels, tes courriels et ton calendrier automatiquement. 
              Tu te concentres sur ce qui compte vraiment.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button className="group w-full sm:w-auto px-8 py-4 bg-[var(--accent-color)] text-white rounded-2xl font-semibold text-lg hover:opacity-90 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2">
                Commencer gratuitement
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group w-full sm:w-auto px-8 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl font-semibold text-lg hover:bg-[var(--bg-primary)] transition-all flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Voir la démo
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-[var(--bg-primary)]"
                    />
                  ))}
                </div>
                <span>+2,500 entreprises</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-1">4.9/5 sur Google</span>
              </div>
            </div>
          </div>

          {/* Hero Image / Demo */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] shadow-2xl overflow-hidden">
              {/* Mock App Header */}
              <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center text-sm text-[var(--text-secondary)]">
                  planexo.ca — Tableau de bord
                </div>
              </div>
              {/* Mock Dashboard */}
              <div className="p-8 grid md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="bg-[var(--bg-primary)] rounded-2xl p-6 border border-[var(--border-color)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-green-500/10">
                      <Phone className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">Appels aujourd'hui</span>
                  </div>
                  <div className="text-3xl font-bold">47</div>
                  <div className="text-sm text-green-500 mt-1">+12% cette semaine</div>
                </div>
                <div className="bg-[var(--bg-primary)] rounded-2xl p-6 border border-[var(--border-color)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-blue-500/10">
                      <Mail className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">Courriels traités</span>
                  </div>
                  <div className="text-3xl font-bold">156</div>
                  <div className="text-sm text-blue-500 mt-1">98% réponse auto</div>
                </div>
                <div className="bg-[var(--bg-primary)] rounded-2xl p-6 border border-[var(--border-color)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-purple-500/10">
                      <Calendar className="w-5 h-5 text-purple-500" />
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">Rendez-vous</span>
                  </div>
                  <div className="text-3xl font-bold">23</div>
                  <div className="text-sm text-purple-500 mt-1">Cette semaine</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* TRUSTED BY */}
      {/* ================================================================== */}
      <section className="py-16 px-6 lg:px-8 border-y border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-[var(--text-secondary)] mb-8">
            Utilisé par des entreprises de confiance au Québec
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            {['Desjardins', 'Hydro-Québec', 'SAQ', 'Metro', 'Jean Coutu', 'Videotron'].map((company) => (
              <div key={company} className="text-xl font-bold text-[var(--text-secondary)]">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FEATURES SECTION */}
      {/* ================================================================== */}
      <section id="features" className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Fonctionnalités
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tout ce dont tu as besoin
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Un assistant complet qui travaille 24/7 pour toi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/50 transition-all hover:shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Réception d'appels IA</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Ton assistant répond aux appels, prend les messages, et réserve des rendez-vous automatiquement. Plus jamais d'appels manqués.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/50 transition-all hover:shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Gestion des courriels</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                L'IA lit, trie et répond à tes courriels. Elle identifie les demandes importantes et te fait un résumé chaque jour.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/50 transition-all hover:shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Calendrier intelligent</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Synchronisation automatique avec Google et Microsoft. L'assistant évite les conflits et optimise ton emploi du temps.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/50 transition-all hover:shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ton style, ton ton</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Personnalise la voix de ton assistant. Chaleureux, professionnel, ou direct — il parle comme tu veux.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/50 transition-all hover:shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Rappels automatiques</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                SMS et courriels de rappel envoyés automatiquement. Réduis les no-shows de 80% sans lever le petit doigt.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/50 transition-all hover:shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Données au Québec</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Tes données restent ici. Serveurs à Montréal, conformité avec les lois québécoises et canadiennes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* HOW IT WORKS */}
      {/* ================================================================== */}
      <section id="how-it-works" className="py-24 px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Simple comme bonjour
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Prêt en 5 minutes
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Pas besoin d'être un expert. Notre assistant te guide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="text-8xl font-bold text-[var(--accent-color)]/10 absolute -top-4 -left-2">1</div>
              <div className="relative p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-color)] text-white flex items-center justify-center font-bold text-xl mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Crée ton compte</h3>
                <p className="text-[var(--text-secondary)]">
                  Inscris-toi en 30 secondes avec ton courriel. Aucune carte de crédit requise pour l'essai.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="text-8xl font-bold text-[var(--accent-color)]/10 absolute -top-4 -left-2">2</div>
              <div className="relative p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-color)] text-white flex items-center justify-center font-bold text-xl mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">Configure ton assistant</h3>
                <p className="text-[var(--text-secondary)]">
                  Notre assistant guidé te pose quelques questions et connecte tes outils (téléphone, courriel, calendrier).
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="text-8xl font-bold text-[var(--accent-color)]/10 absolute -top-4 -left-2">3</div>
              <div className="relative p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-color)] text-white flex items-center justify-center font-bold text-xl mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Laisse-le travailler</h3>
                <p className="text-[var(--text-secondary)]">
                  Ton assistant commence immédiatement. Tu reçois des résumés et tu gardes le contrôle total.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* TESTIMONIALS */}
      {/* ================================================================== */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Témoignages
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ce qu'ils en disent
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg mb-6 leading-relaxed">
                « Planexo a changé ma vie. Je manquais des appels chaque jour. Maintenant, mon assistant répond à ma place et je ne perds plus de clients. »
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
                <div>
                  <div className="font-bold">Marie-Claude Tremblay</div>
                  <div className="text-sm text-[var(--text-secondary)]">Dentiste, Montréal</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg mb-6 leading-relaxed">
                « L'intégration avec mon calendrier Google est parfaite. Les rappels automatiques ont réduit mes no-shows de 75%. Incroyable! »
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-cyan-400" />
                <div>
                  <div className="font-bold">Jean-François Gagnon</div>
                  <div className="text-sm text-[var(--text-secondary)]">Coach sportif, Québec</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg mb-6 leading-relaxed">
                « Enfin un outil qui comprend le français québécois! Mon assistant parle à mes clients comme je le ferais moi-même. Merci Planexo! »
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-400" />
                <div>
                  <div className="font-bold">Sophie Lavoie</div>
                  <div className="text-sm text-[var(--text-secondary)]">Avocate, Sherbrooke</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* PRICING */}
      {/* ================================================================== */}
      <section id="pricing" className="py-24 px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Tarifs simples
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Un prix, tout inclus
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Pas de frais cachés. Pas de surprise. Annule quand tu veux.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
              <div className="text-sm font-medium text-[var(--text-secondary)] mb-2">Débutant</div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">49$</span>
                <span className="text-[var(--text-secondary)]">/mois</span>
              </div>
              <p className="text-[var(--text-secondary)] mb-6">
                Parfait pour commencer et tester l'assistant.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  '100 appels/mois',
                  '500 courriels/mois',
                  'Calendrier synchronisé',
                  'Rappels automatiques',
                  'Support par courriel',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl border border-[var(--border-color)] font-semibold hover:bg-[var(--bg-secondary)] transition-colors">
                Commencer
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[var(--accent-color)] to-blue-700 text-white relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full">
                Plus populaire
              </div>
              <div className="text-sm font-medium text-blue-100 mb-2">Professionnel</div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">99$</span>
                <span className="text-blue-100">/mois</span>
              </div>
              <p className="text-blue-100 mb-6">
                Pour les entreprises qui veulent tout automatiser.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Appels illimités',
                  'Courriels illimités',
                  'Calendrier multi-usagers',
                  'Rappels SMS + courriel',
                  'Personnalisation du ton',
                  'Support prioritaire',
                  'Analytiques avancées',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl bg-white text-[var(--accent-color)] font-semibold hover:bg-blue-50 transition-colors">
                Commencer
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
              <div className="text-sm font-medium text-[var(--text-secondary)] mb-2">Entreprise</div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">Sur mesure</span>
              </div>
              <p className="text-[var(--text-secondary)] mb-6">
                Solutions personnalisées pour grandes équipes.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Tout du plan Pro',
                  'Intégrations sur mesure',
                  'API dédiée',
                  'Gestionnaire de compte',
                  'SLA garanti',
                  'Formation équipe',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl border border-[var(--border-color)] font-semibold hover:bg-[var(--bg-secondary)] transition-colors">
                Nous écrire
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FAQ */}
      {/* ================================================================== */}
      <section id="faq" className="py-24 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-[var(--text-secondary)]">
              Tu as des questions? On a les réponses.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "Comment fonctionne l'assistant téléphonique?",
                answer: "Ton assistant utilise l'intelligence artificielle pour répondre aux appels. Il comprend les demandes, prend des messages, et peut même réserver des rendez-vous automatiquement selon ta disponibilité."
              },
              {
                question: "Est-ce que mes données sont sécurisées?",
                answer: "Absolument. Toutes tes données sont hébergées sur des serveurs à Montréal. Nous sommes conformes aux lois québécoises et canadiennes sur la protection des données."
              },
              {
                question: "Puis-je personnaliser les réponses de l'assistant?",
                answer: "Oui! Tu peux choisir parmi plusieurs tons (chaleureux, professionnel, direct) ou créer ton propre style. L'assistant s'adapte à ta personnalité."
              },
              {
                question: "Combien de temps prend la configuration?",
                answer: "Environ 5 minutes. Notre assistant guidé te pose quelques questions simples et connecte tes outils. Pas besoin d'être un expert en technologie."
              },
              {
                question: "Puis-je annuler mon abonnement?",
                answer: "Oui, tu peux annuler à tout moment depuis ton tableau de bord. Aucun engagement, aucun frais d'annulation. Tu gardes accès jusqu'à la fin de ta période payée."
              },
              {
                question: "Est-ce que l'assistant parle vraiment français québécois?",
                answer: "Oui! Planexo est conçu au Québec, pour le Québec. L'assistant comprend et utilise le français québécois naturellement. Pas de traduction bizarre ou de ton robotique."
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--text-secondary)] transition-transform ${
                      activeFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-5 text-[var(--text-secondary)]">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FINAL CTA */}
      {/* ================================================================== */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-[var(--accent-color)] to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à reprendre ton temps?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Rejoins les milliers d'entreprises québécoises qui utilisent Planexo pour automatiser leur quotidien.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="group w-full sm:w-auto px-8 py-4 bg-white text-[var(--accent-color)] rounded-2xl font-semibold text-lg hover:bg-blue-50 transition-all shadow-xl flex items-center justify-center gap-2">
              Commencer gratuitement
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 border-2 border-white/30 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              Parler à un expert
            </button>
          </div>
          <p className="mt-8 text-sm text-blue-200">
            Essai gratuit de 14 jours • Aucune carte de crédit requise • Annule quand tu veux
          </p>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FOOTER */}
      {/* ================================================================== */}
      <footer className="py-16 px-6 lg:px-8 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">Planexo</span>
              </div>
              <p className="text-[var(--text-secondary)] mb-4">
                L'assistant IA qui gère tes appels, tes courriels et ton calendrier.
              </p>
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Globe className="w-4 h-4" />
                <span>Fait au Québec 🍁</span>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold mb-4">Produit</h4>
              <ul className="space-y-3 text-[var(--text-secondary)]">
                <li><a href="#features" className="hover:text-[var(--text-primary)] transition-colors">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-[var(--text-primary)] transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-[var(--text-primary)] transition-colors">Intégrations</a></li>
                <li><a href="#" className="hover:text-[var(--text-primary)] transition-colors">API</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold mb-4">Entreprise</h4>
              <ul className="space-y-3 text-[var(--text-secondary)]">
                <li><a href="#" className="hover:text-[var(--text-primary)] transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-[var(--text-primary)] transition-colors">Blogue</a></li>
                <li><a href="#" className="hover:text-[var(--text-primary)] transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-[var(--text-primary)] transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold mb-4">Légal</h4>
              <ul className="space-y-3 text-[var(--text-secondary)]">
                <li><a href="#" className="hover:text-[var(--text-primary)] transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-[var(--text-primary)] transition-colors">Conditions d'utilisation</a></li>
                <li><a href="#" className="hover:text-[var(--text-primary)] transition-colors">Sécurité</a></li>
                <li><a href="#" className="hover:text-[var(--text-primary)] transition-colors">RGPD</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--text-secondary)]">
              © 2026 Planexo. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
