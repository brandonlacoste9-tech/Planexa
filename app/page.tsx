import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFF1E1]" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between h-16 px-6 lg:px-10">
        <img src="/assets/Logo-CDE6P79p.svg" alt="Planexa" className="h-9 lg:h-12" />
        <div className="hidden lg:flex gap-4">
          <a href="https://www.facebook.com/profile.php?id=61558578759650" target="_blank">
            <svg width="28" height="28" viewBox="0 0 35 35" fill="none"><g clipPath="url(#fb)"><path d="M34.4 17.7C34.4 8.3 26.8 0.8 17.5 0.8C8.1 0.8 0.5 8.3 0.5 17.7C0.5 25.7 6 32.3 13.4 34.2V22.9H9.9V17.7H13.4V15.5C13.4 9.7 16 7 21.6 7C22.7 7 24.6 7.2 25.3 7.5V12.2C24.9 12.1 24.2 12.1 23.4 12.1C20.6 12.1 19.5 13.1 19.5 15.9V17.7H25.1L24.1 22.9H19.5V34.5C27.9 33.5 34.4 26.4 34.4 17.7Z" fill="#252122"/><path d="M24.1 22.9L25.1 17.7H19.5V15.9C19.5 13.1 20.6 12.1 23.4 12.1C24.2 12.1 24.9 12.1 25.3 12.2V7.5C24.6 7.2 22.7 7 21.6 7C16 7 13.4 9.7 13.4 15.5V17.7H9.9V22.9H13.4V34.2C14.7 34.5 16.1 34.7 17.5 34.7C18.2 34.7 18.8 34.6 19.5 34.5V22.9H24.1Z" fill="#FFF1E1"/></g><defs><clipPath id="fb"><rect width="33.9" height="33.9" fill="white" transform="translate(0.5 0.8)"/></clipPath></defs></svg>
          </a>
          <a href="https://www.instagram.com/planexa.ca" target="_blank">
            <svg width="28" height="28" viewBox="0 0 35 35" fill="none"><g clipPath="url(#ig)"><rect x="2" y="2" width="31" height="31" rx="8" fill="#252122"/><circle cx="17.5" cy="17.5" r="9" stroke="#FFF1E1" strokeWidth="2"/><circle cx="27" cy="8" r="1.5" fill="#FFF1E1"/></g><defs><clipPath id="ig"><rect width="35" height="35" fill="white"/></clipPath></defs></svg>
          </a>
        </div>
        <div className="hidden lg:flex gap-4 items-center">
          <Link href="/dashboard" className="text-[#252122] font-semibold hover:underline">Tableau de bord</Link>
          <Link href="/dashboard" className="bg-[#252122] text-[#FFF1E1] px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-800 transition">Commencer</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 lg:px-20 pt-12 pb-24 lg:pt-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-6xl lg:text-8xl font-extrabold text-[#252122] leading-tight">
              You plan,<br />We execute
            </h1>
            <p className="text-[#252122]/70 text-lg lg:text-xl mt-6 mb-8 max-w-xl">
              Planifiez vos rendez-vous professionnels en quelques clics. Partagez votre lien et laissez vos clients réserver.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/dashboard" className="bg-[#252122] text-[#FFF1E1] px-8 py-3.5 rounded-full font-semibold text-lg hover:bg-gray-800 transition text-center">
                Créer mon lien de réservation
              </Link>
              <Link href="/demo" className="border-2 border-[#252122] text-[#252122] px-8 py-3.5 rounded-full font-semibold text-lg hover:bg-[#252122] hover:text-[#FFF1E1] transition text-center">
                Voir une démo
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-[#252122]/5 rounded-2xl aspect-square flex items-center justify-center text-4xl">
                  {i === 1 ? '📅' : i === 2 ? '🔗' : i === 3 ? '👥' : '⚡'}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#252122] mb-6">Notre mission</h2>
          <p className="text-[#252122]/70 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Simplifier la planification de rendez-vous pour les professionnels québécois. 
            Une plateforme pensée et construite ici, pour les entrepreneurs d&apos;ici.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-[#FFF1E1] rounded-2xl p-8">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-[#252122] mb-3">Simple</h3>
              <p className="text-[#252122]/70">Créez votre lien en 2 minutes. Pas de formation nécessaire.</p>
            </div>
            <div className="bg-[#FFF1E1] rounded-2xl p-8">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-[#252122] mb-3">Rapide</h3>
              <p className="text-[#252122]/70">Vos clients réservent en 30 secondes. Synchronisation instantanée.</p>
            </div>
            <div className="bg-[#FFF1E1] rounded-2xl p-8">
              <div className="text-3xl mb-4">🇫🇷</div>
              <h3 className="text-xl font-bold text-[#252122] mb-3">100% Québécois</h3>
              <p className="text-[#252122]/70">Interface en français, fuseau horaire de Montréal, hébergé au Canada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-[#FFF1E1]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#252122] text-center mb-16">Comment ça fonctionne</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Créez votre compte', desc: 'Inscrivez-vous gratuitement et configurez votre profil professionnel en quelques minutes.' },
              { step: '2', title: 'Définissez vos disponibilités', desc: 'Choisissez vos plages horaires, types de rendez-vous et durée. Connectez votre calendrier.' },
              { step: '3', title: 'Partagez votre lien', desc: 'Envoyez votre lien unique à vos clients. Ils réservent en un clic, vous recevez une confirmation.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-[#252122] text-[#FFF1E1] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">{item.step}</div>
                <h3 className="text-xl font-bold text-[#252122] mb-3">{item.title}</h3>
                <p className="text-[#252122]/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#252122] text-center mb-4">Forfaits</h2>
          <p className="text-[#252122]/70 text-center mb-16 text-lg">Du gratuit au tout-inclus. Parfait pour les indépendants comme pour les équipes.</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="border-2 border-[#252122]/10 rounded-2xl p-8 hover:border-[#252122]/30 transition">
              <h3 className="text-lg font-semibold text-[#252122]/60 uppercase tracking-wide mb-2">GRATUIT</h3>
              <div className="text-4xl font-extrabold text-[#252122] mb-6">0$<span className="text-lg font-normal text-[#252122]/60">/mois</span></div>
              <ul className="space-y-3 mb-8">
                {['1 type de rendez-vous', '1 calendrier connecté', 'Lien de réservation', 'Page booking personnalisée'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-[#252122]/80">✓ {f}</li>
                ))}
              </ul>
              <Link href="/dashboard" className="block text-center border-2 border-[#252122] text-[#252122] py-3 rounded-full font-semibold hover:bg-[#252122] hover:text-[#FFF1E1] transition">Commencer</Link>
            </div>
            <div className="border-2 border-[#252122] rounded-2xl p-8 relative bg-[#252122] text-[#FFF1E1]">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFF1E1] text-[#252122] text-xs font-bold px-4 py-1 rounded-full border-2 border-[#252122]">Populaire</span>
              <h3 className="text-lg font-semibold text-[#FFF1E1]/60 uppercase tracking-wide mb-2 mt-2">PRO</h3>
              <div className="text-4xl font-extrabold text-[#FFF1E1] mb-6">49$<span className="text-lg font-normal text-[#FFF1E1]/60">/mois</span></div>
              <ul className="space-y-3 mb-8">
                {['Rendez-vous illimités', '6 calendriers', 'Rappels SMS + courriel', 'Paiements intégrés (Stripe)', 'Visio Google Meet / Zoom', 'Formulaires personnalisés'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-[#FFF1E1]/80">✓ {f}</li>
                ))}
              </ul>
              <Link href="/dashboard" className="block text-center bg-[#FFF1E1] text-[#252122] py-3 rounded-full font-semibold hover:bg-[#FFF1E1]/90 transition">Essai gratuit</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[#252122] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#FFF1E1] mb-6">Prêt à simplifier vos rendez-vous?</h2>
          <p className="text-[#FFF1E1]/70 text-lg mb-10">Rejoignez les professionnels québécois qui gagnent du temps chaque semaine.</p>
          <Link href="/dashboard" className="inline-block bg-[#FFF1E1] text-[#252122] px-12 py-4 rounded-full font-bold text-lg hover:bg-[#FFF1E1]/90 transition">
            Commencer gratuitement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-[#252122] text-center border-t border-[#FFF1E1]/10">
        <Link href="mailto:info@planexa.ca" className="text-[#FFF1E1]/60 text-sm hover:text-[#FFF1E1] transition">info@planexa.ca</Link>
        <p className="text-[#FFF1E1]/40 text-sm mt-2">Planexa © {new Date().getFullYear()} — Planification de rendez-vous • Québec</p>
      </footer>
    </div>
  );
}
