import { Badge, BadgeType, TITLES } from '../../../shared/types/realm';

interface Props {
  badges: Badge[];
  unlockedBadges: BadgeType[];
  activeTitle?: string;
  onSelectTitle: (badgeId: BadgeType) => void;
}

export function BadgesDisplay({ badges, unlockedBadges, activeTitle, onSelectTitle }: Props) {
  const rarityColors = {
    common: 'border-slate-400 bg-slate-50',
    rare: 'border-blue-400 bg-blue-50',
    epic: 'border-purple-400 bg-purple-50',
    legendary: 'border-yellow-400 bg-yellow-50',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-slate-800 mb-6">🏆 Badges & Titles</h3>
      
      {activeTitle && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl border-2 border-yellow-400">
          <div className="text-sm text-slate-600">Your Active Title:</div>
          <div className="text-2xl font-bold text-yellow-700">✨ {activeTitle}</div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          const isActive = TITLES[badge.id] === activeTitle;

          return (
            <button
              key={badge.id}
              onClick={() => isUnlocked && onSelectTitle(badge.id)}
              disabled={!isUnlocked}
              className={`p-4 rounded-xl border-2 transition-all ${
                isUnlocked
                  ? `${rarityColors[badge.rarity]} hover:scale-105 cursor-pointer ${
                      isActive ? 'ring-4 ring-blue-500' : ''
                    }`
                  : 'bg-slate-100 border-slate-300 opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="text-center">
                <div
                  className={`text-5xl mb-2 ${isUnlocked ? '' : 'grayscale'}`}
                >
                  {badge.icon}
                </div>
                <div className={`font-bold ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                  {badge.name}
                </div>
                <div className="text-xs text-slate-600 mt-1">{badge.description}</div>
                {isUnlocked && (
                  <div className="mt-2">
                    <div className="text-xs font-semibold text-blue-600">
                      Title: {TITLES[badge.id]}
                    </div>
                    {isActive && (
                      <div className="text-xs text-green-600 mt-1">✓ Active</div>
                    )}
                  </div>
                )}
                {!isUnlocked && (
                  <div className="mt-2 text-xs text-slate-500">🔒 {badge.requirement}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
