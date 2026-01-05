// PLANEXA SETUP ASSISTANT - SetupFlow Container Component
// Implementation based on Section 3 of the specification

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProgressBar from './ProgressBar';
import AssistantIntro from './AssistantIntro';
import ChooseAI from './ChooseAI';
import ConnectTwilio from './ConnectTwilio';
import ConnectEmail from './ConnectEmail';
import ConnectCalendar from './ConnectCalendar';
import ChooseTone from './ChooseTone';
import ChooseTheme from './ChooseTheme';

// Step labels for progress bar
const STEP_LABELS = [
  'Intro',
  'IA',
  'Téléphone',
  'Courriel',
  'Calendrier',
  'Ton',
  'Thème',
  'Terminé'
];

// Step components (first 7 are implemented)
const STEP_COMPONENTS = [
  AssistantIntro,
  ChooseAI,
  ConnectTwilio,
  ConnectEmail,
  ConnectCalendar,
  ChooseTone,
  ChooseTheme,
  null  // Finish - placeholder
];

interface SetupFlowProps {
  onComplete?: () => void;
}

export default function SetupFlow({ onComplete }: SetupFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState<'guided' | 'manual'>('guided');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const totalSteps = STEP_LABELS.length;
  const CurrentStepComponent = STEP_COMPONENTS[currentStep];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      setCurrentStep(prev => prev + 1);
    } else {
      // Last step - complete the flow
      if (onComplete) {
        onComplete();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => new Set(prev).add(stepIndex));
    // Auto-advance after completion (for steps that support it)
    if (stepIndex === currentStep) {
      setTimeout(() => {
        handleNext();
      }, 1000);
    }
  };

  const handleStart = () => {
    handleNext();
  };

  const canGoNext = () => {
    // Intro step - can always proceed
    if (currentStep === 0) return true;
    
    // ChooseAI step - only if completed
    if (currentStep === 1) {
      return completedSteps.has(1);
    }
    
    // ConnectTwilio step - only if completed
    if (currentStep === 2) {
      return completedSteps.has(2);
    }
    
    // ConnectEmail step - can always proceed (can be skipped)
    if (currentStep === 3) {
      return true;
    }
    
    // ConnectCalendar step - can always proceed (can be skipped)
    if (currentStep === 4) {
      return true;
    }
    
    // ChooseTone step - can always proceed (can be skipped)
    if (currentStep === 5) {
      return true;
    }
    
    // ChooseTheme step - can always proceed (can be skipped)
    if (currentStep === 6) {
      return true;
    }
    
    // Future steps - always allow in manual mode, check completion in guided mode
    return mode === 'manual' || completedSteps.has(currentStep);
  };

  const canGoBack = () => {
    return currentStep > 0;
  };

  const isLastStep = () => {
    return currentStep === totalSteps - 1;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Mode Toggle */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-end">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mode:
            </span>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setMode('guided')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'guided'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Guidé
              </button>
              <button
                onClick={() => setMode('manual')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'manual'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Manuel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {currentStep > 0 && (
        <ProgressBar
          currentStep={currentStep + 1}
          totalSteps={totalSteps}
          stepLabels={STEP_LABELS}
        />
      )}

      {/* Main Content */}
      <div className={`max-w-6xl mx-auto px-6 py-8 ${currentStep > 0 ? 'pb-32' : ''}`}>
        {CurrentStepComponent ? (
          <CurrentStepComponent
            mode={mode}
            onComplete={
              currentStep === 1
                ? (provider: string, apiKey: string) => {
                    handleStepComplete(1);
                  }
                : currentStep === 2
                ? () => {
                    handleStepComplete(2);
                  }
                : currentStep === 3
                ? () => {
                    handleStepComplete(3);
                  }
                : currentStep === 4
                ? () => {
                    handleStepComplete(4);
                  }
                : currentStep === 5
                ? (tone: string, customDescription?: string) => {
                    handleStepComplete(5);
                  }
                : currentStep === 6
                ? (theme: string) => {
                    handleStepComplete(6);
                  }
                : undefined
            }
            onSkip={
              currentStep === 3
                ? () => {
                    handleStepComplete(3);
                  }
                : currentStep === 4
                ? () => {
                    handleStepComplete(4);
                  }
                : currentStep === 5
                ? () => {
                    handleStepComplete(5);
                  }
                : currentStep === 6
                ? () => {
                    handleStepComplete(6);
                  }
                : undefined
            }
            onStart={currentStep === 0 ? handleStart : undefined}
          />
        ) : (
          <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Cette étape sera implémentée dans une section future.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 text-center mt-2">
              Étape {currentStep + 1}: {STEP_LABELS[currentStep]}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      {currentStep > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={!canGoBack()}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Retour
            </button>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Étape {currentStep + 1} sur {totalSteps}
            </div>

            <button
              onClick={handleNext}
              disabled={!canGoNext()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
            >
              {isLastStep() ? 'Terminer' : 'Suivant'}
              {!isLastStep() && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
