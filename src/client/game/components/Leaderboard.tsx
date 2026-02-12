import { LeaderboardEntry } from '../../../shared/types/realm';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUser: string;
}

export function Leaderboard({ entries, currentUser }: LeaderboardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
      <h2 className="text-2xl font-bold mb-4 text-white">🏆 Top Detectives</h2>
      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-purple-300 text-center py-4">No solvers yet. Be the first!</p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.username}
              className={`
                flex items-center justify-between p-4 rounded-xl transition-all
                ${entry.username === currentUser ? 'bg-purple-500/30 border-2 border-purple-400' : 'bg-white/5'}
              `}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`
                  font-bold text-xl
                  ${entry.rank === 1 ? 'text-yellow-400' : ''}
                  ${entry.rank === 2 ? 'text-gray-300' : ''}
                  ${entry.rank === 3 ? 'text-orange-400' : ''}
                  ${entry.rank > 3 ? 'text-purple-300' : ''}
                `}
                >
                  {entry.rank === 1 ? '👑' : `#${entry.rank}`}
                </span>
                <div>
                  <div className="font-medium text-white">{entry.username}</div>
                  {entry.streak > 0 && (
                    <div className="text-xs text-orange-300">🔥 {entry.streak} day streak</div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-bold text-lg">{entry.correctGuesses}</div>
                <div className="text-xs text-purple-300">solved</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
