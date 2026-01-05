// PLANEXA SETUP ASSISTANT - ChooseTheme Component
// Implementation based on Section 8 of the specification

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ChooseThemeProps {
  mode?: 'guided' | 'manual';
  onComplete?: (theme: string) => void;
  onSkip?: () => void;
}

type ThemeType = 'light' | 'dark' | 'midnight' | 'high-contrast' | null;

interface ThemeOption {
  id: ThemeType;
  icon: string;
  name: string;
  description: string;
  previewColors: {
    bg: string;
    card: string;
    text: string;
    accent: string;
  };
}

const themeOptions: ThemeOption[] = [
  {
    id: 'light',
    icon: '🌞',
    name: 'Clair',
    description: 'Lumineux, propre, facile à lire.',
    previewColors: {
      bg: 'bg-gray-50',
      card: 'bg-white',
      text: 'text-gray-900',
      accent: 'bg-blue-500'
    }
  },
  {
    id: 'dark',
    icon: '🌙',
    name: 'Sombre',
    description: 'Doux pour les yeux, idéal le soir.',
    previewColors: {
      bg: 'bg-gray-900',
      card: 'bg-gray-800',
      text: 'text-gray-100',
      accent: 'bg-blue-500'
    }
  },
  {
    id: 'midnight',
    icon: '🌌',
    name: 'Minuit',
    description: 'Contraste élevé, ambiance premium.',
    previewColors: {
      bg: 'bg-slate-950',
      card: 'bg-slate-900',
      text: 'text-slate-100',
      accent: 'bg-cyan-400'
    }
  },
  {
    id: 'high-contrast',
    icon: '⚫⚪',
    name: 'Haut contraste',
    description: 'Lisibilité maximale, accessibilité renforcée.',
    previewColors: {
      bg: 'bg-white',
      card: 'bg-black',
      text: 'text-white',
      accent: 'bg-yellow-400'
    }
  }
];

export default function ChooseTheme({ mode = 'guided', onComplete, onSkip }: ChooseThemeProps) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('light');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSelectTheme = (theme: ThemeType) => {
    setSelectedTheme(theme);
  };

  const handleContinue = () => {
    if (onComplete) {
      onComplete(selectedTheme || 'light');
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else if (onComplete) {
      onComplete('light'); // Default to light theme
    }
  };

  const guidedMessages = {
    intro: 'Parfait! Maintenant, on va choisir l\'apparence de ton espace.\nTu peux rester simple ou choisir un style plus contrasté.',
    selected: 'Super! Ton espace va maintenant utiliser ce thème.'
  };

  if (mode === 'manual') {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Configuration du Thème
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Choisis ton thème visuel.
        </p>

        <div className="space-y-4 mb-6">
          {themeOptions.map(theme => (
            <button
              key={theme.id}
              onClick={() => handleSelectTheme(theme.id)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedTheme === theme.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{theme.icon}</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {theme.name}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {theme.description}
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
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
          {selectedTheme ? guidedMessages.selected : guidedMessages.intro}
        </p>
      </div>

      {/* Explanation */}
      <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
        Choisis le thème visuel de ton espace Planexa.
      </p>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {themeOptions.map(theme => (
          <button
            key={theme.id}
            onClick={() => handleSelectTheme(theme.id)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedTheme === theme.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{theme.icon}</span>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                {theme.name}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {theme.description}
            </p>
            
            {/* Visual Preview */}
            <div className={`${theme.previewColors.bg} p-4 rounded-lg border border-gray-200 dark:border-gray-700`}>
              <div className={`${theme.previewColors.card} ${theme.previewColors.text} p-3 rounded-lg mb-2`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 ${theme.previewColors.accent} rounded-full`}></div>
                  <div className={`h-2 ${theme.previewColors.accent} rounded w-16`}></div>
                </div>
                <div className={`h-1 ${theme.previewColors.text} opacity-50 rounded w-full mb-1`}></div>
                <div className={`h-1 ${theme.previewColors.text} opacity-30 rounded w-3/4`}></div>
              </div>
            </div>
          </button>
        ))}
      </div>

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
            {/* Accent Color Picker (Disabled) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Couleur d'accent
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  disabled
                  defaultValue="#2563eb"
                  className="w-16 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-not-allowed opacity-50"
                />
                <input
                  type="text"
                  disabled
                  value="#2563eb"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic">
                Personnalisation bientôt disponible.
              </p>
            </div>

            {/* Font Size Slider (Disabled) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Taille de police
              </label>
              <input
                type="range"
                disabled
                min="12"
                max="20"
                defaultValue="16"
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-not-allowed opacity-50"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Petite</span>
                <span>Moyenne</span>
                <span>Grande</span>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic">
                Option bientôt disponible.
              </p>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center pt-2">
              Les options de personnalisation avancée arrivent bientôt.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleContinue}
          disabled={!selectedTheme}
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
