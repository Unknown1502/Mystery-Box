import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CelebrationOverlayProps {
  show: boolean;
  onClose: () => void;
  mysteryAnswer: string;
  solveTime?: string;
  points?: number;
}

export const CelebrationOverlay = ({ 
  show, 
  onClose, 
  mysteryAnswer,
  solveTime = '2m 34s',
  points = 100 
}: CelebrationOverlayProps) => {
  
  useEffect(() => {
    if (show) {
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      // Auto-close after 5 seconds
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-8 rounded-3xl shadow-2xl max-w-md mx-4 animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl font-bold transition-colors"
        >
          ×
        </button>

        {/* Celebration content */}
        <div className="text-center space-y-6">
          {/* Trophy */}
          <div className="text-8xl animate-bounce-subtle">
            🏆
          </div>

          {/* Title */}
          <h2 className="text-4xl font-black text-white drop-shadow-lg">
            MYSTERY SOLVED!
          </h2>

          {/* Answer */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
            <p className="text-sm text-white/80 uppercase tracking-wider font-semibold mb-2">
              The Answer Was
            </p>
            <p className="text-3xl font-black text-white drop-shadow-md break-words">
              {mysteryAnswer}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-white/70 uppercase tracking-wide mb-1">
                Time
              </p>
              <p className="text-2xl font-bold text-white">
                {solveTime}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-white/70 uppercase tracking-wide mb-1">
                Points
              </p>
              <p className="text-2xl font-bold text-white">
                +{points}
              </p>
            </div>
          </div>

          {/* Encouragement */}
          <p className="text-lg text-white/90 font-medium">
            Come back tomorrow for a new mystery! 🎯
          </p>

          {/* Share button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement share functionality
            }}
            className="w-full bg-white text-orange-600 font-bold py-4 px-6 rounded-xl text-lg hover:bg-orange-50 transition-colors shadow-lg hover:shadow-xl"
          >
            Share Your Win 🎉
          </button>
        </div>
      </div>
    </div>
  );
};
