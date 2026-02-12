import { MysterySubmission } from '../../../shared/types/realm';
import { CreatorBadge } from './CreatorBadge';

interface CreatorSpotlightProps {
  topCreator: {
    username: string;
    submissionCount: number;
    totalUpvotes: number;
    topMystery?: MysterySubmission;
  } | null;
}

export const CreatorSpotlight = ({ topCreator }: CreatorSpotlightProps) => {
  if (!topCreator) {
    return (
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">👤</div>
        <p className="text-slate-600">Be the first creator of the day!</p>
        <p className="text-sm text-slate-500 mt-2">Submit a mystery below</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl p-6 shadow-xl text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">⭐ Creator of the Day</h3>
        <CreatorBadge submissionCount={topCreator.submissionCount} size="sm" />
      </div>
      
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-4xl">👤</div>
          <div>
            <p className="text-2xl font-black">u/{topCreator.username}</p>
            <p className="text-white/80 text-sm">Top contributor today</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{topCreator.submissionCount}</div>
            <div className="text-xs text-white/70">Mysteries Created</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{topCreator.totalUpvotes}</div>
            <div className="text-xs text-white/70">Total Upvotes</div>
          </div>
        </div>

        {topCreator.topMystery && (
          <div className="mt-4 bg-white/10 rounded-lg p-3">
            <p className="text-xs text-white/70 mb-1">Most Popular Mystery:</p>
            <p className="font-bold text-sm">"{topCreator.topMystery.answer}"</p>
            <p className="text-xs text-white/80 mt-1">⬆️ {topCreator.topMystery.votes} upvotes</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-white/90">
          🎯 Create mysteries to earn your creator badge!
        </p>
      </div>
    </div>
  );
};
