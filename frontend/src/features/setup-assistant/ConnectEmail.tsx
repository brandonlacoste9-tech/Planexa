// PLANEXA SETUP ASSISTANT - ConnectEmail Component
// Implementation based on Section 5 of the specification

import { useState } from 'react';
import { Check, AlertCircle, Loader2, Mail, ChevronDown, ChevronUp, X } from 'lucide-react';

interface ConnectEmailProps {
  mode?: 'guided' | 'manual';
  onComplete?: () => void;
  onSkip?: () => void;
}

type Provider = 'google' | 'microsoft' | 'imap' | null;
type ValidationState = 'idle' | 'loading' | 'success' | 'error';

interface ConnectedAccount {
  provider: Provider;
  name: string;
  email: string;
}

export default function ConnectEmail({ mode = 'guided', onComplete, onSkip }: ConnectEmailProps) {
  const [connectedAccount, setConnectedAccount] = useState<ConnectedAccount | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationState, setValidationState] = useState<ValidationState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // IMAP/SMTP fields
  const [imapHost, setImapHost] = useState('');
  const [imapPort, setImapPort] = useState('993');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleOAuthConnect = async (provider: 'google' | 'microsoft') => {
    setValidationState('loading');
    setErrorMessage('');

    try {
      // Placeholder OAuth flow - backend implementation comes in future section
      // In a real implementation, this would redirect to OAuth provider
      const response = await fetch(`/api/setup/oauth/${provider}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setConnectedAccount({
          provider,
          name: data.name || 'Utilisateur',
          email: data.email || ''
        });
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

  const handleTestEmail = async () => {
    if (!connectedAccount) return;

    setValidationState('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/setup/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: connectedAccount.provider,
          email: connectedAccount.email
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
        setErrorMessage(data.message || 'Le test de courriel a échoué.');
      }
    } catch (error) {
      setValidationState('error');
      setErrorMessage('Impossible d\'envoyer le courriel de test.');
    }
  };

  const handleTestImap = async () => {
    if (!imapHost || !smtpHost || !username || !password) {
      setValidationState('error');
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    setValidationState('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/setup/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'imap',
          email: username,
          imapHost,
          imapPort,
          smtpHost,
          smtpPort,
          password
        })
      });

      if (response.ok) {
        setValidationState('success');
        setConnectedAccount({
          provider: 'imap',
          name: username,
          email: username
        });
        if (onComplete) {
          setTimeout(() => onComplete(), 1500);
        }
      } else {
        const data = await response.json();
        setValidationState('error');
        setErrorMessage(data.message || 'La connexion IMAP/SMTP a échoué.');
      }
    } catch (error) {
      setValidationState('error');
      setErrorMessage('Impossible de tester la connexion.');
    }
  };

  const handleSave = () => {
    if (!imapHost || !smtpHost || !username || !password) {
      setValidationState('error');
      setErrorMessage('Veuillez remplir tous les champs.');
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
    setValidationState('idle');
    setErrorMessage('');
  };

  const guidedMessages = {
    intro: 'Parfait! Maintenant, on va connecter ton adresse courriel.\nC\'est ce qui permet à ton assistant de répondre automatiquement aux clients.',
    testing: 'Super! On va envoyer un petit courriel de test pour s\'assurer que tout fonctionne.',
    success: 'Excellent! Ton assistant pourra lire et envoyer des courriels.',
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
          Configuration Courriel
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Entre les informations de ton serveur courriel.
        </p>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Serveur IMAP
              </label>
              <input
                type="text"
                value={imapHost}
                onChange={(e) => setImapHost(e.target.value)}
                placeholder="imap.example.com"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Port IMAP
              </label>
              <input
                type="number"
                value={imapPort}
                onChange={(e) => setImapPort(e.target.value)}
                placeholder="993"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Serveur SMTP
              </label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                placeholder="smtp.example.com"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Port SMTP
              </label>
              <input
                type="number"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                placeholder="587"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ton@courriel.com"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mot de passe / App Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="..."
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
            disabled={!imapHost || !smtpHost || !username || !password}
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
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {connectedAccount.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {connectedAccount.email}
                </p>
                <span className="inline-block mt-1 text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                  {connectedAccount.provider === 'google' ? 'Google' : 
                   connectedAccount.provider === 'microsoft' ? 'Microsoft' : 
                   'IMAP/SMTP'}
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

          {validationState !== 'success' && (
            <button
              onClick={handleTestEmail}
              disabled={validationState === 'loading'}
              className="mt-4 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              {validationState === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Envoyer un courriel de test
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
          <span>Courriel de test envoyé avec succès!</span>
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
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-all"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Options avancées (IMAP/SMTP)
          </span>
          {showAdvanced ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 p-6 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Serveur IMAP
                </label>
                <input
                  type="text"
                  value={imapHost}
                  onChange={(e) => setImapHost(e.target.value)}
                  placeholder="imap.example.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Port IMAP
                </label>
                <input
                  type="number"
                  value={imapPort}
                  onChange={(e) => setImapPort(e.target.value)}
                  placeholder="993"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Serveur SMTP
                </label>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  placeholder="smtp.example.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Port SMTP
                </label>
                <input
                  type="number"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  placeholder="587"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ton@courriel.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mot de passe / App Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={handleTestImap}
              disabled={!imapHost || !smtpHost || !username || !password || validationState === 'loading'}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              {validationState === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Test en cours...
                </>
              ) : (
                'Tester la connexion'
              )}
            </button>
          </div>
        )}
      </div>

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
