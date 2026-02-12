import { Season, Event } from '../../../shared/types/realm';

interface Props {
  currentSeason?: Season;
  activeEvent?: Event;
  userSeasonPoints: number;
  userSeasonRank: number;
}

export function SeasonPanel({ currentSeason, activeEvent, userSeasonPoints, userSeasonRank }: Props) {
  const calculateProgress = () => {
    if (!currentSeason) return 0;
    const total = currentSeason.endDate - currentSeason.startDate;
    const elapsed = Date.now() - currentSeason.startDate;
    return Math.min((elapsed / total) * 100, 100);
  };

  const getDaysRemaining = () => {
    if (!currentSeason) return 0;
    return Math.max(0, Math.ceil((currentSeason.endDate - Date.now()) / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-6">
      {/* Active Event Banner */}
      {activeEvent && (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 shadow-xl text-white border-2 border-yellow-300 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🎉</span>
              <div>
                <div className="text-sm font-semibold opacity-90">SPECIAL EVENT</div>
                <div className="text-2xl font-bold">{activeEvent.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{activeEvent.multiplier}x</div>
              <div className="text-sm opacity-90">Points</div>
            </div>
          </div>
          <div className="text-sm opacity-90 mb-2">{activeEvent.description}</div>
          <div className="flex items-center gap-2 text-sm">
            <span>⏰</span>
            <span>
              Ends {new Date(activeEvent.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      {/* Current Season */}
      {currentSeason && (
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-slate-600">Current Season</div>
              <h3 className="text-2xl font-bold text-slate-800">{currentSeason.name}</h3>
              <div className="text-sm text-slate-600 mt-1">{currentSeason.theme}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">#{userSeasonRank}</div>
              <div className="text-sm text-slate-600">Your Rank</div>
            </div>
          </div>

          {/* Season Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Season Progress</span>
              <span>{getDaysRemaining()} days left</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>

          {/* Season Points */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
              <div className="text-3xl font-bold text-indigo-600">{userSeasonPoints}</div>
              <div className="text-sm text-slate-600">Season Points</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">TOP {Math.ceil((userSeasonRank / 100) * 100)}%</div>
              <div className="text-sm text-slate-600">Global Rank</div>
            </div>
          </div>

          {/* Rewards */}
          {currentSeason.rewards && currentSeason.rewards.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-700 mb-3">🎁 Season Rewards</h4>
              <div className="space-y-2">
                {currentSeason.rewards.map((reward, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <span className="text-2xl">
                      {index === 0 ? '👑' : index === 1 ? '💎' : '⭐'}
                    </span>
                    <span className="text-slate-700">{reward}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Categories */}
          {currentSeason.specialCategories && currentSeason.specialCategories.length > 0 && (
            <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="text-sm font-semibold text-purple-800 mb-2">
                🌟 Bonus Categories This Season:
              </div>
              <div className="flex flex-wrap gap-2">
                {currentSeason.specialCategories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-semibold"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Season Active */}
      {!currentSeason && !activeEvent && (
        <div className="bg-slate-50 rounded-xl p-8 text-center border-2 border-slate-200">
          <div className="text-6xl mb-4">🎮</div>
          <div className="text-xl font-bold text-slate-700 mb-2">No Active Season</div>
          <div className="text-slate-600">Check back soon for the next seasonal event!</div>
        </div>
      )}
    </div>
  );
}
