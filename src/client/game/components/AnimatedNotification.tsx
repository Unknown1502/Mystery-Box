import { useEffect, useState } from 'react';

interface Props {
  show: boolean;
  message: string;
  type: 'success' | 'achievement' | 'hint' | 'powerup';
  onComplete?: () => void;
}

export function AnimatedNotification({ show, message, type,onComplete }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
      icon: '🎉',
      border: 'border-green-300',
    },
    achievement: {
      bg: 'bg-gradient-to-r from-yellow-500 to-orange-600',
      icon: '🏆',
      border: 'border-yellow-300',
    },
    hint: {
      bg: 'bg-gradient-to-r from-blue-500 to-purple-600',
      icon: '💡',
      border: 'border-blue-300',
    },
    powerup: {
      bg: 'bg-gradient-to-r from-purple-500 to-pink-600',
      icon: '⚡',
      border: 'border-purple-300',
    },
  };

  const style = styles[type];

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
      <div
        className={`${style.bg} ${style.border} border-4 rounded-2xl p-6 shadow-2xl text-white max-w-md animate-pulse-slow`}
      >
        <div className="flex items-center gap-4">
          <span className="text-6xl animate-bounce">{style.icon}</span>
          <div>
            <div className="font-bold text-2xl mb-1">{type.toUpperCase()}!</div>
            <div className="text-lg">{message}</div>
          </div>
        </div>
      </div>

      {/* Confetti Effect */}
      {type === 'success' && (
        <div className="confetti-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][
                  Math.floor(Math.random() * 5)
                ],
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes bounce-in {
          0% {
            transform: translate(-50%, -100px);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, 10px);
          }
          100% {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          pointer-events: none;
          z-index: 100;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall 3s linear;
        }
      `}</style>
    </div>
  );
}
