// PLANEXA SETUP ASSISTANT - AssistantIntro Component
// Implementation based on Section 3 of the specification

import { Sparkles } from 'lucide-react';

interface AssistantIntroProps {
  mode?: 'guided' | 'manual';
  onStart?: () => void;
}

export default function AssistantIntro({ mode = 'guided', onStart }: AssistantIntroProps) {
  const guidedText = (
    <>
      <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Bonjour! Je suis ton assistant Planexa.
      </p>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
        On va configurer ton système ensemble, étape par étape.
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Ça prend moins de cinq minutes.
      </p>
    </>
  );

  const manualText = (
    <p className="text-xl text-gray-800 dark:text-gray-200">
      Configuration rapide. Choisis une étape pour commencer.
    </p>
  );

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12">
        {/* Illustration Placeholder */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center mb-8">
          {mode === 'guided' ? guidedText : manualText}
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <button
            onClick={onStart}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Commencer
          </button>
        </div>
      </div>
    </div>
  );
}
