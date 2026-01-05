// PLANEXA SETUP ASSISTANT - ChooseAI Component
// Implementation based on Section 2 of the specification

import { useState } from 'react';
import { Check, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

interface ChooseAIProps {
  mode?: 'guided' | 'manual';
  onComplete?: (provider: string, apiKey: string) => void;
}

type Provider = 'deepseek' | 'gemini' | 'openai';
type ValidationState = 'idle' | 'loading' | 'success' | 'error';

const providers = [
  {
    id: 'deepseek' as Provider,
    label: 'DeepSeek (Recommandé)',
    description: 'Rapide, abordable, excellent pour les appels et les courriels.',
    badge: 'Meilleur rapport qualité-prix',
    docsUrl: 'https://platform.deepseek.com/api-keys'
  },
  {
    id: 'gemini' as Provider,
    label: 'Gemini (Google)',
    description: 'Idéal pour la voix, la transcription et l\'écosystème Google.',
    docsUrl: 'https://makersuite.google.com/app/apikey'
  },
  {
    id: 'openai' as Provider,
    label: 'OpenAI',
    description: 'Option premium pour le langage naturel.',
    docsUrl: 'https://platform.openai.com/api-keys'
  }
];

export default function ChooseAI({ mode = 'guided', onComplete }: ChooseAIProps) {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [validationState, setValidationState] = useState<ValidationState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleTestKey = async () => {
    if (!selectedProvider || !apiKey) return;

    setValidationState('loading');
    setErrorMessage('');

    try {
      // Placeholder API call - backend implementation comes in Section 4
      const response = await fetch('/api/setup/validate-ai-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          apiKey: apiKey
        })
      });

      if (response.ok) {
        setValidationState('success');
        if (onComplete) {
          onComplete(selectedProvider, apiKey);
        }
      } else {
        const data = await response.json();
        setValidationState('error');
        setErrorMessage(data.message || 'Cette clé ne fonctionne pas.');
      }
    } catch (error) {
      setValidationState('error');
      setErrorMessage('Impossible de vérifier la clé. Vérifie ta connexion.');
    }
  };

  const guidedMessages = {
    intro: 'Choisissons ton fournisseur d\'IA. Je peux t\'expliquer les différences si tu veux.',
    selected: 'Parfait! Entre ta clé API ici, et je vais vérifier si tout fonctionne.',
    success: 'Excellent! Ton assistant est prêt à travailler.',
    error: 'Hmm… cette clé ne fonctionne pas. On peut réessayer ensemble.'
  };

  if (mode === 'manual') {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Configuration du fournisseur IA
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fournisseur
            </label>
            <select
              value={selectedProvider || ''}
              onChange={(e) => setSelectedProvider(e.target.value as Provider)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Sélectionner un fournisseur</option>
              {providers.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.label}
                </option>
              ))}
            </select>
          </div>

          {selectedProvider && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Clé API
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          )}

          {validationState === 'success' && (
            <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
              <Check className="w-5 h-5" />
              <span>Clé validée avec succès</span>
            </div>
          )}

          {validationState === 'error' && (
            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            onClick={handleTestKey}
            disabled={!selectedProvider || !apiKey || validationState === 'loading'}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            {validationState === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Vérification...
              </>
            ) : (
              'Enregistrer'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Guided Mode
  return (
    <div className="max-w-3xl mx-auto p-8">
      {/* Guided Intro Message */}
      <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
        <p className="text-lg text-gray-800 dark:text-gray-200">
          {!selectedProvider ? guidedMessages.intro : 
           validationState === 'success' ? guidedMessages.success :
           validationState === 'error' ? guidedMessages.error :
           guidedMessages.selected}
        </p>
      </div>

      {/* Provider Selection */}
      <div className="space-y-4 mb-8">
        {providers.map(provider => (
          <button
            key={provider.id}
            onClick={() => setSelectedProvider(provider.id)}
            className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
              selectedProvider === provider.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedProvider === provider.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selectedProvider === provider.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {provider.label}
                </h3>
              </div>
              {provider.badge && (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                  {provider.badge}
                </span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3 ml-8">
              {provider.description}
            </p>
            <a
              href={provider.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-8 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              Comment obtenir une clé API
              <ExternalLink className="w-3 h-3" />
            </a>
          </button>
        ))}
      </div>

      {/* API Key Input */}
      {selectedProvider && (
        <div className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Clé API
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {validationState === 'success' && (
            <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
              <Check className="w-5 h-5" />
              <span>Clé validée avec succès!</span>
            </div>
          )}

          {validationState === 'error' && (
            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            onClick={handleTestKey}
            disabled={!apiKey || validationState === 'loading'}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            {validationState === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Vérification en cours...
              </>
            ) : (
              'Tester la clé'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
