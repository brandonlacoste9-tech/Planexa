// PLANEXA SETUP ASSISTANT - ChooseTone Component
// Implementation based on Section 7 of the specification

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ChooseToneProps {
  mode?: 'guided' | 'manual';
  onComplete?: (tone: string, customDescription?: string) => void;
  onSkip?: () => void;
}

type ToneType = 'warm' | 'professional' | 'direct' | 'enthusiastic' | 'serious' | 'custom' | null;

interface ToneOption {
  id: ToneType;
  icon: string;
  name: string;
  description: string;
  example: string;
}

const toneOptions: ToneOption[] = [
  {
    id: 'warm',
    icon: '😊',
    name: 'Chaleureux / Amical',
    description: 'Doux, accueillant, proche, typiquement québécois.',
    example: 'Allô! Merci d\'avoir écrit. Je regarde ça tout de suite.'
  },
  {
    id: 'professional',
    icon: '🧑‍💼',
    name: 'Professionnel / Neutre',
    description: 'Clair, poli, formel, idéal pour entreprises.',
    example: 'Bonjour, merci pour votre message. Je vous reviens rapidement.'
  },
  {
    id: 'direct',
    icon: '⚡',
    name: 'Direct / Efficace',
    description: 'Court, précis, va droit au but.',
    example: 'Reçu. Je m\'en occupe.'
  },
  {
    id: 'enthusiastic',
    icon: '✨',
    name: 'Enthousiaste / Énergique',
    description: 'Positif, motivant, dynamique.',
    example: 'Super nouvelle! Je m\'occupe de ça immédiatement!'
  },
  {
    id: 'serious',
    icon: '🧘',
    name: 'Sérieux / Calme',
    description: 'Stable, posé, rassurant.',
    example: 'Merci pour votre message. Je vais traiter votre demande.'
  }
];

export default function ChooseTone({ mode = 'guided', onComplete, onSkip }: ChooseToneProps) {
  const [selectedTone, setSelectedTone] = useState<ToneType>('warm');
  const [customDescription, setCustomDescription] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSelectTone = (tone: ToneType) => {
    setSelectedTone(tone);
    if (tone !== 'custom') {
      setCustomDescription('');
    }
  };

  const handleContinue = () => {
    if (selectedTone === 'custom' && !customDescription.trim()) {
      return;
    }
    if (onComplete) {
      onComplete(
        selectedTone || 'warm',
        selectedTone === 'custom' ? customDescription : undefined
      );
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else if (onComplete) {
      onComplete('warm'); // Default to warm tone
    }
  };

  const guidedMessages = {
    intro: 'Parfait! Maintenant, on va choisir comment ton assistant parle.\nTu peux rester simple ou choisir un style plus personnalisé.',
    selected: 'Super choix! Ton assistant va maintenant parler dans ce style.'
  };

  if (mode === 'manual') {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Configuration du Ton
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Choisis un ton ou écris le tien.
        </p>

        <div className="space-y-4 mb-6">
          {toneOptions.map(tone => (
            <button
              key={tone.id}
              onClick={() => handleSelectTone(tone.id)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedTone === tone.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{tone.icon}</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {tone.name}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tone.description}
              </p>
            </button>
          ))}

          <button
            onClick={() => handleSelectTone('custom')}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              selectedTone === 'custom'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎨</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                Personnalisé
              </span>
            </div>
          </button>
        </div>

        {selectedTone === 'custom' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Décris le ton que tu veux
            </label>
            <textarea
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              placeholder="Exemple: Amical mais professionnel, avec une touche d'humour québécois..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
              Exemple généré: "Allô! Merci pour votre message. Je vais m'en occuper rapidement."
            </p>
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={selectedTone === 'custom' && !customDescription.trim()}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
        >
          Enregistrer
        </button>
      </div>
    );
  }

  // Guided Mode
  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Guided Intro Message */}
      <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
        <p className="text-lg text-gray-800 dark:text-gray-200 whitespace-pre-line">
          {selectedTone && selectedTone !== null ? guidedMessages.selected : guidedMessages.intro}
        </p>
      </div>

      {/* Explanation */}
      <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
        Choisis le ton que ton assistant va utiliser lorsqu'il parle à tes clients.
      </p>

      {/* Tone Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {toneOptions.map(tone => (
          <button
            key={tone.id}
            onClick={() => handleSelectTone(tone.id)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedTone === tone.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 hover:shadow-sm'
            }`}
          >
            <div className="text-4xl mb-3">{tone.icon}</div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {tone.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {tone.description}
            </p>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                "{tone.example}"
              </p>
            </div>
          </button>
        ))}

        {/* Custom Tone Card */}
        <button
          onClick={() => handleSelectTone('custom')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            selectedTone === 'custom'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 hover:shadow-sm'
          }`}
        >
          <div className="text-4xl mb-3">🎨</div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Personnalisé
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Crée ton propre style de communication.
          </p>
        </button>
      </div>

      {/* Custom Tone Input */}
      {selectedTone === 'custom' && (
        <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Décris le ton que tu veux
          </label>
          <textarea
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            placeholder="Exemple: Amical mais professionnel, avec une touche d'humour québécois..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
            Exemple généré: "Allô! Merci pour votre message. Je vais m'en occuper rapidement."
          </p>
        </div>
      )}

      {/* Advanced Options Toggle */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-all"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Options avancées
          </span>
          {showAdvanced ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 p-6 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Niveau de formalité
              </label>
              <input
                type="range"
                disabled
                min="0"
                max="100"
                defaultValue="50"
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-not-allowed opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Niveau d'humour
              </label>
              <input
                type="range"
                disabled
                min="0"
                max="100"
                defaultValue="30"
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-not-allowed opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Niveau d'énergie
              </label>
              <input
                type="range"
                disabled
                min="0"
                max="100"
                defaultValue="60"
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-not-allowed opacity-50"
              />
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center">
              Fonctionnalités avancées bientôt disponibles.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleContinue}
          disabled={selectedTone === 'custom' && !customDescription.trim()}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
        >
          Continuer
        </button>

        <button
          onClick={handleSkip}
          className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all"
        >
          Je veux sauter cette étape.
        </button>
      </div>
    </div>
  );
}
