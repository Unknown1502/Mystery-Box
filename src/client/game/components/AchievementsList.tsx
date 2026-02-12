import { Achievement } from '../../../shared/types/realm';

interface Props {
  achievements: Achievement[];
  unlocked: string[];
}

export function AchievementsList({ achievements, unlocked }: Props) {
  const unlockedSet = new Set(unlocked);
  const categories = ['solving', 'participation', 'community', 'special'] as const;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        🏆 Achievements ({unlocked.length}/{achievements.length})
      </h3>

      {categories.map((category) => {
        const categoryAchievements = achievements.filter((a) => a.category === category);
        if (categoryAchievements.length === 0) return null;

        return (
          <div key={category} className="mb-4">
            <h4 className="text-purple-200 font-semibold text-sm mb-2 capitalize">{category}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {categoryAchievements.map((achievement) => {
                const isUnlocked = unlockedSet.has(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50'
                        : 'bg-black/20 border-gray-600/30'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`text-2xl ${!isUnlocked && 'opacity-30 grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-semibold text-sm ${isUnlocked ? 'text-yellow-100' : 'text-gray-400'}`}
                        >
                          {achievement.name}
                        </div>
                        <div
                          className={`text-xs ${isUnlocked ? 'text-yellow-200' : 'text-gray-500'}`}
                        >
                          {achievement.description}
                        </div>
                      </div>
                      {isUnlocked && <div className="text-green-400 text-lg">✓</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
