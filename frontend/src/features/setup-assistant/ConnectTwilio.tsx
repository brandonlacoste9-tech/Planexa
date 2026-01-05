// PLANEXA SETUP ASSISTANT - ConnectTwilio Component
// Implementation based on Section 4 of the specification

import { useState } from 'react';
import { Check, AlertCircle, Loader2, ExternalLink, Phone, ChevronDown, ChevronUp } from 'lucide-react';

interface ConnectTwilioProps {
  mode?: 'guided' | 'manual';
  onComplete?: () => void;
}

type ValidationState = 'idle' | 'loading' | 'success' | 'error';

export default function ConnectTwilio({ mode = 'guided', onComplete }: ConnectTwilioProps) {
  const [accountSid, setAccountSid] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationState, setValidationState] = useState<ValidationState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Webhook URL is auto-generated (read-only)
  const webhookUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/webhook/twilio`
    : '/api/webhook/twilio';

  const handleTestCall = async () => {
    if (!accountSid || !authToken || !phoneNumber) {
      setValidationState('error');
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    setValidationState('loading');
    setErrorMessage('');

    try {
      // Placeholder API call - backend implementation comes in future section
      const response = await fetch('/api/setup/test-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sid: accountSid,
          token: authToken,
          phoneNumber: phoneNumber
        })
      });

      if (response.ok) {
        setValidationState('success');
        if (onComplete) {
          setTimeout(() => onComplete(), 1500);
        }
      } else {
        const data = await response.json();
        setValidationState('error');
        setErrorMessage(data.message || 'Le test d\'appel a échoué. Vérifie tes identifiants.');
      }
    } catch (error) {
      setValidationState('error');
      setErrorMessage('Impossible de tester l\'appel. Vérifie ta connexion.');
    }
  };

  const handleSave = () => {
    if (!accountSid || !authToken || !phoneNumber) {
      setValidationState('error');
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    // In manual mode, just mark as complete
    if (onComplete) {
      onComplete();
    }
  };

  const guidedMessages = {
    intro: 'Parfait! Maintenant, on va connecter ton numéro de téléphone.\nSi tu n\'en as pas encore un, tu peux en acheter un ici.\nÇa prend moins d\'une minute.',
    testing: 'Super! On va tester ton numéro pour s\'assurer que tout fonctionne.',
    success: 'Excellent! Ton assistant pourra répondre aux appels.',
    error: 'Hmm… on dirait que ça ne fonctionne pas.\nOn peut réessayer ensemble.'
  };

  const getCurrentMessage = () => {
    if (validationState === 'success') return guidedMessages.success;
    if (validationState === 'error') return guidedMessages.error;
    if (accountSid && authToken && phoneNumber) return guidedMessages.testing;
    return guidedMessages.intro;
  };

  if (mode === 'manual') {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Configuration Twilio
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Account SID
            </label>
            <input
              type="text"
              value={accountSid}
              onChange={(e) => setAccountSid(e.target.value)}
              placeholder="AC..."
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Auth Token
            </label>
            <input
              type="password"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              placeholder="..."
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Numéro Twilio
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1..."
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {validationState === 'error' && (
            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={!accountSid || !authToken || !phoneNumber}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
          >
            Enregistrer
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
        <p className="text-lg text-gray-800 dark:text-gray-200 whitespace-pre-line">
          {getCurrentMessage()}
        </p>
      </div>

      {/* Main Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
        {/* Account SID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Twilio Account SID
          </label>
          <input
            type="text"
            value={accountSid}
            onChange={(e) => setAccountSid(e.target.value)}
            placeholder="AC..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Auth Token */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Twilio Auth Token
          </label>
          <input
            type="password"
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
            placeholder="..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Numéro Twilio
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Webhook URL (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            URL du webhook
          </label>
          <input
            type="text"
            value={webhookUrl}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Cette URL sera utilisée par Twilio pour recevoir les appels
          </p>
        </div>

        {/* Success/Error States */}
        {validationState === 'success' && (
          <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
            <Check className="w-5 h-5" />
            <span>Test réussi! Ton numéro est connecté.</span>
          </div>
        )}

        {validationState === 'error' && (
          <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://www.twilio.com/console/phone-numbers/search"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all"
          >
            <Phone className="w-5 h-5" />
            Acheter un numéro Twilio
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={handleTestCall}
            disabled={!accountSid || !authToken || !phoneNumber || validationState === 'loading'}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            {validationState === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Test en cours...
              </>
            ) : (
              <>
                <Phone className="w-5 h-5" />
                Tester l'appel
              </>
            )}
          </button>
        </div>

        {/* Advanced Options Toggle */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
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
            <div className="mt-4 space-y-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
              {/* Provider Selection (Disabled) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fournisseur
                </label>
                <select
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                >
                  <option>Twilio (par défaut)</option>
                  <option disabled>Telnyx (bientôt disponible)</option>
                  <option disabled>Plivo (bientôt disponible)</option>
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic">
                  Les autres fournisseurs seront disponibles dans une version future
                </p>
              </div>

              {/* SIP Settings (Disabled) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Paramètres SIP
                </label>
                <input
                  type="text"
                  disabled
                  placeholder="Non disponible pour l'instant"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Fallback Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Numéro de secours
                </label>
                <input
                  type="tel"
                  disabled
                  placeholder="Non disponible pour l'instant"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Voice Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Voix de l'assistant
                </label>
                <select
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                >
                  <option>Voix par défaut</option>
                  <option disabled>Voix féminine</option>
                  <option disabled>Voix masculine</option>
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic">
                  Cette fonctionnalité sera disponible prochainement
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
