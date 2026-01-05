// PLANEXA SETUP ASSISTANT - ConnectCalendar Component
// Implementation based on Section 6 of the specification

import { useState } from 'react';
import { Check, AlertCircle, Loader2, Calendar, ChevronDown, ChevronUp, X } from 'lucide-react';

interface ConnectCalendarProps {
  mode?: 'guided' | 'manual';
  onComplete?: () => void;
  onSkip?: () => void;
}

type Provider = 'google' | 'microsoft' | null;
type ValidationState = 'idle' | 'loading' | 'success' | 'error';

interface CalendarItem {
  id: string;
  name: string;
  isPrimary?: boolean;
}

interface ConnectedAccount {
  provider: Provider;
  name: string;
  email: string;
  calendars: CalendarItem[];
}

export default function ConnectCalendar({ mode = 'guided', onComplete, onSkip }: ConnectCalendarProps) {
  const [connectedAccount, setConnectedAccount] = useState<ConnectedAccount | null>(null);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationState, setValidationState] = useState<ValidationState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [calendarId, setCalendarId] = useState(''); // For manual mode

  const handleOAuthConnect = async (provider: 'google' | 'microsoft') => {
    setValidationState('loading');
    setErrorMessage('');

    try {
      // Placeholder OAuth flow - backend implementation comes in future section
      const response = await fetch(`/api/setup/oauth/${provider}/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        const calendars: CalendarItem[] = data.calendars || [
          { id: 'primary', name: 'Calendrier principal', isPrimary: true },
          { id: 'work', name: 'Travail' },
          { id: 'personal', name: 'Personnel' }
        ];
        
        setConnectedAccount({
          provider,
          name: data.name || 'Utilisateur',
          email: data.email || '',
          calendars
        });
        
        // Set primary calendar as default
        const primaryCalendar = calendars.find(c => c.isPrimary) || calendars[0];
        setSelectedCalendarId(primaryCalendar.id);
        setValidationState('idle');
      } else {
        setValidationState('error');
        setErrorMessage('Impossible de se connecter. Réessaye plus tard.');
      }
    } catch (error) {
      setValidationState('error');
      setErrorMessage('Erreur de connexion. Vérifie ta connexion internet.');
    }
  };

  const handleTestSync = async () => {
    if (!connectedAccount || !selectedCalendarId) {
      setValidationState('error');
      setErrorMessage('Veuillez sélectionner un calendrier.');
      return;
    }

    setValidationState('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/setup/test-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: connectedAccount.provider,
          calendarId: selectedCalendarId
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
        setErrorMessage(data.message || 'Le test de synchronisation a échoué.');
      }
    } catch (error) {
      setValidationState('error');
      setErrorMessage('Impossible de tester la synchronisation.');
    }
  };

  const handleSave = () => {
    if (!calendarId) {
      setValidationState('error');
      setErrorMessage('Veuillez entrer un identifiant de calendrier.');
      return;
    }

    if (onComplete) {
      onComplete();
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else if (onComplete) {
      onComplete();
    }
  };

  const handleDisconnect = () => {
    setConnectedAccount(null);
    setSelectedCalendarId('');
    setValidationState('idle');
    setErrorMessage('');
  };

  const guidedMessages = {
    intro: 'Parfait! Maintenant, on va connecter ton calendrier.\nÇa va permettre à ton assistant de réserver des rendez-vous sans conflit.',
    testing: 'Super! On va tester la synchronisation pour s\'assurer que tout fonctionne.',
    success: 'Excellent! Ton assistant pourra gérer ta disponibilité.',
    error: 'Hmm… on dirait que ça ne fonctionne pas.\nOn peut réessayer ensemble.'
  };

  const getCurrentMessage = () => {
    if (validationState === 'success') return guidedMessages.success;
    if (validationState === 'error') return guidedMessages.error;
    if (connectedAccount) return guidedMessages.testing;
    return guidedMessages.intro;
  };

  if (mode === 'manual') {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Configuration Calendrier
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Entre l'identifiant de ton calendrier.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Calendar ID
            </label>
            <input
              type="text"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              placeholder="primary ou calendar@group.calendar.google.com"
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
            disabled={!calendarId}
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

      {/* Connected Account Display */}
      {connectedAccount && (
        <div className="mb-6 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {connectedAccount.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {connectedAccount.email}
                </p>
                <span className="inline-block mt-1 text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                  {connectedAccount.provider === 'google' ? 'Google Calendar' : 'Microsoft Calendar'}
                </span>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Calendar Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Calendrier principal
            </label>
            <select
              value={selectedCalendarId}
              onChange={(e) => setSelectedCalendarId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {connectedAccount.calendars.map(calendar => (
                <option key={calendar.id} value={calendar.id}>
                  {calendar.name} {calendar.isPrimary && '(Principal)'}
                </option>
              ))}
            </select>
          </div>

          {validationState !== 'success' && (
            <button
              onClick={handleTestSync}
              disabled={!selectedCalendarId || validationState === 'loading'}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              {validationState === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Test en cours...
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  Tester la synchronisation
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Success/Error States */}
      {validationState === 'success' && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
          <Check className="w-5 h-5" />
          <span>Synchronisation réussie!</span>
        </div>
      )}

      {validationState === 'error' && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* OAuth Buttons (if not connected) */}
      {!connectedAccount && (
        <div className="space-y-4 mb-6">
          <button
            onClick={() => handleOAuthConnect('google')}
            disabled={validationState === 'loading'}
            className="w-full p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Se connecter avec Google
            </span>
          </button>

          <button
            onClick={() => handleOAuthConnect('microsoft')}
            disabled={validationState === 'loading'}
            className="w-full p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#F25022" d="M1 1h10v10H1z"/>
              <path fill="#00A4EF" d="M13 1h10v10H13z"/>
              <path fill="#7FBA00" d="M1 13h10v10H1z"/>
              <path fill="#FFB900" d="M13 13h10v10H13z"/>
            </svg>
            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Se connecter avec Microsoft
            </span>
          </button>
        </div>
      )}

      {/* Advanced Options Toggle */}
      {connectedAccount && (
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
            <div className="mt-4 space-y-4 p-6 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
              {/* Calendar List */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tous les calendriers
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {connectedAccount.calendars.map(calendar => (
                    <div
                      key={calendar.id}
                      className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        disabled
                        checked={calendar.id === selectedCalendarId}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {calendar.name}
                      </span>
                      {calendar.isPrimary && (
                        <span className="ml-auto text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                          Principal
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
                  La sélection multiple sera disponible dans une version future
                </p>
              </div>

              {/* Create Dedicated Calendar (Disabled) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Créer un calendrier dédié Planexa
                </label>
                <button
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed text-left"
                >
                  Non disponible pour l'instant
                </button>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic">
                  Cette fonctionnalité sera disponible prochainement
                </p>
              </div>

              {/* Ignore Busy Events (Disabled) */}
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    disabled
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Ignorer les événements marqués comme 'Occupé'
                  </span>
                </label>
                <p className="mt-1 ml-7 text-xs text-gray-500 dark:text-gray-400 italic">
                  Cette option sera disponible prochainement
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skip Button */}
      {!connectedAccount && (
        <div className="mt-6 text-center">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
          >
            Je veux sauter cette étape.
          </button>
        </div>
      )}
    </div>
  );
}
