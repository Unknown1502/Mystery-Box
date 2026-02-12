import { UserState } from '../../../shared/types/realm';

interface UserStatsProps {
  userState: UserState;
  mysteryState?: unknown; // Not used, kept for compatibility
}

export function UserStats({ userState }: UserStatsProps) {
  const guessesRemaining = 3 - userState.guessesUsed;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-sm text-purple-300">Detective</p>
          <p className="text-lg font-bold text-white">{userState.username}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-purple-300">Guesses Left</p>
          <p
            className={`text-2xl font-bold ${
              guessesRemaining > 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {guessesRemaining}/3
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-purple-300">Solved</p>
          <p className="text-2xl font-bold text-yellow-400">{userState.correctGuesses}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-purple-300">🔥 Streak</p>
          <p className="text-2xl font-bold text-orange-400">{userState.streak}</p>
        </div>
      </div>
    </div>
  );
}
