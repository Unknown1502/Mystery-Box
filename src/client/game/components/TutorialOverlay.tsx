import { useState } from 'react';

interface TutorialOverlayProps {
  onComplete: () => void;
}

export const TutorialOverlay = ({ onComplete }: TutorialOverlayProps) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: '🎯 Welcome to Mystery Box!',
      description: 'A daily puzzle game where the community creates the content. Let me show you how it works!',
      icon: '👋'
    },
    {
      title: '🎮 Solve Daily Mysteries',
      description: 'Each day, a new mystery appears with hidden letters. Guess the answer and help your community by revealing more letters for everyone!',
      icon: '🔍'
    },
    {
      title: '✨ Create Your Own',
      description: 'Think you can stump the community? Create your own mysteries! The best ones get voted to become tomorrow\'s challenge.',
      icon: '🎨'
    },
    {
      title: '🗳️ Vote & Win Badges',
      description: 'Vote for your favorite community submissions. Top creators earn special badges: Bronze, Silver, Gold, and Diamond!',
      icon: '🏆'
    }
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg mx-4 p-8 animate-scale-in">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <div className="text-7xl mb-4 animate-bounce-subtle">
            {currentStep?.icon}
          </div>
          <h2 className="text-3xl font-black text-slate-800">
            {currentStep?.title}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {currentStep?.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 bg-slate-200 text-slate-700 font-bold py-4 px-6 rounded-xl hover:bg-slate-300 transition-colors"
            >
              ← Back
            </button>
          )}
          <button
            onClick={() => {
              if (isLastStep) {
                onComplete();
              } else {
                setStep(step + 1);
              }
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-xl transition-all hover:scale-105"
          >
            {isLastStep ? '🎯 Start Playing!' : 'Next →'}
          </button>
        </div>

        {/* Skip */}
        <button
          onClick={onComplete}
          className="w-full text-center text-slate-500 text-sm mt-4 hover:text-slate-700 transition-colors"
        >
          Skip tutorial
        </button>
      </div>
    </div>
  );
};
