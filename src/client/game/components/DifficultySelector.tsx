import { DifficultyLevel, DIFFICULTY_CONFIG } from '../../../shared/types/realm';

interface Props {
  currentDifficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  userLevel: number;
}

export function DifficultySelector({ currentDifficulty, onDifficultyChange, userLevel }: Props) {
  const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];

  const canAccess = (diff: DifficultyLevel) => {
    if (diff === 'easy') return true;
    if (diff === 'medium') return userLevel >= 5;
    if (diff === 'hard') return userLevel >= 15;
    return false;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-4">⚡ Difficulty Level</h3>
      <div className="space-y-3">
        {difficulties.map((diff) => {
          const config = DIFFICULTY_CONFIG[diff];
          const accessible = canAccess(diff);
          const isActive = currentDifficulty === diff;

          return (
            <button
              key={diff}
              onClick={() => accessible && onDifficultyChange(diff)}
              disabled={!accessible}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                isActive
                  ? 'border-purple-500 bg-purple-50 ring-4 ring-purple-200'
                  : accessible
                  ? 'border-slate-300 hover:border-purple-300 bg-white'
                  : 'border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{config.emoji}</span>
                  <div>
                    <div className="font-bold text-slate-800">{config.label}</div>
                    <div className="text-sm text-slate-600">
                      {config.wordCount.min}-{config.wordCount.max} words
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-600">{config.pointValue} pts</div>
                  {!accessible && (
                    <div className="text-xs text-red-500">
                      Level {diff === 'medium' ? 5 : 15}+ required
                    </div>
                  )}
                  {isActive && (
                    <div className="text-xs text-green-600 mt-1">✓ Active</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="text-sm text-slate-700">
          <span className="font-semibold">Your Level:</span> {userLevel}
        </div>
        <div className="text-xs text-slate-600 mt-1">
          Solve more mysteries to unlock higher difficulties!
        </div>
      </div>
    </div>
  );
}
