import { Achievement } from '../../../shared/types/realm';

interface Props {
  achievement: Achievement;
  onDismiss: () => void;
}

export function AchievementNotification({ achievement, onDismiss }: Props) {
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-2xl p-4 max-w-sm border-2 border-yellow-300">
        <div className="flex items-start gap-3">
          <div className="text-4xl">{achievement.icon}</div>
          <div className="flex-1">
            <div className="text-white font-bold text-lg">Achievement Unlocked!</div>
            <div className="text-yellow-100 font-semibold">{achievement.name}</div>
            <div className="text-yellow-50 text-sm mt-1">{achievement.description}</div>
          </div>
          <button
            onClick={onDismiss}
            className="text-white hover:text-yellow-100 transition"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
