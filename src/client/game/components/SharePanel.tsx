import { useState } from 'react';

interface Props {
  streak: number;
  totalSolves: number;
  recentAchievement?: string;
  onShare: (type: 'streak' | 'solve' | 'achievement', data: any) => void;
}

export function SharePanel({ streak, totalSolves, recentAchievement, onShare }: Props) {
  const [sharing, setSharing] = useState(false);
  const [shareType, setShareType] = useState<'streak' | 'solve' | 'achievement' | null>(null);

  const handleShare = async (type: 'streak' | 'solve' | 'achievement') => {
    setSharing(true);
    setShareType(type);
    await onShare(type, { streak, totalSolves, achievement: recentAchievement });
    setSharing(false);
    setShareType(null);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-4">📢 Share Your Progress</h3>
      
      <div className="space-y-3">
        {/* Share Streak */}
        {streak > 0 && (
          <button
            onClick={() => handleShare('streak')}
            disabled={sharing}
            className="w-full p-4 rounded-xl border-2 border-orange-300 bg-orange-50 hover:bg-orange-100 transition-all text-left disabled:opacity-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔥</span>
                <div>
                  <div className="font-bold text-slate-800">Share Your Streak</div>
                  <div className="text-sm text-slate-600">{streak} day{streak !== 1 ? 's' : ''} and counting!</div>
                </div>
              </div>
              <div className="text-orange-600 font-semibold">
                {sharing && shareType === 'streak' ? '...' : 'Post →'}
              </div>
            </div>
          </button>
        )}

        {/* Share Milestone */}
        {totalSolves > 0 && totalSolves % 10 === 0 && (
          <button
            onClick={() => handleShare('solve')}
            disabled={sharing}
            className="w-full p-4 rounded-xl border-2 border-green-300 bg-green-50 hover:bg-green-100 transition-all text-left disabled:opacity-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                <div>
                  <div className="font-bold text-slate-800">Milestone Achievement</div>
                  <div className="text-sm text-slate-600">Solved {totalSolves} mysteries!</div>
                </div>
              </div>
              <div className="text-green-600 font-semibold">
                {sharing && shareType === 'solve' ? '...' : 'Post →'}
              </div>
            </div>
          </button>
        )}

        {/* Share Recent Achievement */}
        {recentAchievement && (
          <button
            onClick={() => handleShare('achievement')}
            disabled={sharing}
            className="w-full p-4 rounded-xl border-2 border-purple-300 bg-purple-50 hover:bg-purple-100 transition-all text-left disabled:opacity-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏆</span>
                <div>
                  <div className="font-bold text-slate-800">New Badge Unlocked!</div>
                  <div className="text-sm text-slate-600">{recentAchievement}</div>
                </div>
              </div>
              <div className="text-purple-600 font-semibold">
                {sharing && shareType === 'achievement' ? '...' : 'Post →'}
              </div>
            </div>
          </button>
        )}
      </div>

      <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="text-sm text-slate-600 text-center">
          <span className="font-semibold">💡 Pro Tip:</span> Share your achievements to inspire others and grow the community!
        </div>
      </div>

      {/* Social Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalSolves}</div>
          <div className="text-xs text-slate-600">Total Achievements</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{streak}🔥</div>
          <div className="text-xs text-slate-600">Current Streak</div>
        </div>
      </div>
    </div>
  );
}
