import { MysterySubmission } from '../../../shared/types/realm';
import { EmptyState } from './EmptyState';

interface Props {
  submissions: MysterySubmission[];
  onVote: (submissionId: string) => void;
  onReport?: (submissionId: string) => void;
  votesRemaining: number;
  voting: boolean;
}

export function CommunitySubmissions({ submissions, onVote, onReport, votesRemaining, voting }: Props) {
  if (submissions.length === 0) {
    return (
      <EmptyState
        icon="🎯"
        title="No submissions yet"
        description="Be the first to create a mystery! Your submission could become tomorrow's challenge."
      />
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((sub, index) => (
        <div
          key={sub.id}
          className="flex gap-4 bg-gradient-to-r from-slate-50 to-white rounded-2xl p-5 border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
        >
          {/* Reddit-Style Voting Column */}
          <div className="flex flex-col items-center justify-center min-w-[60px]">
            <button
              onClick={() => onVote(sub.id)}
              disabled={voting || votesRemaining === 0}
              className="text-3xl hover:text-orange-600 transition-all active:scale-125 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Upvote this mystery"
            >
              ⬆️
            </button>
            <div className="text-2xl font-bold text-orange-600 my-1">
              {sub.votes}
            </div>
            <div className="text-xs text-slate-500 font-semibold">
              votes
            </div>
          </div>

          {/* Content Column */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                {index < 3 && (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-slate-100 text-slate-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {index === 0 ? '🥇 Top Pick' : index === 1 ? '🥈 Runner Up' : '🥉 Third Place'}
                  </span>
                )}
              </div>
              
              {onReport && (
                <button
                  onClick={() => onReport(sub.id)}
                  className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                  title="Report inappropriate content"
                >
                  🚩
                </button>
              )}
            </div>
            
            {/* Mystery Preview */}
            <div className="bg-slate-800 text-green-400 font-mono text-lg md:text-xl p-4 rounded-xl mb-3 shadow-inner">
              {maskAnswer(sub.answer)}
            </div>
            
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="font-semibold">📁 {sub.category}</span>
              <span>•</span>
              <span className="font-bold text-blue-600">by u/{sub.username}</span>
              <span>•</span>
              <span>{sub.hints.length} hints</span>
              {sub.votes >= 5 && (
                <>
                  <span>•</span>
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold text-xs">
                    ⭐ Featured
                  </span>
                </>
              )}
            </div>

            {/* Preview First Hint */}
            {sub.hints.length > 0 && (
              <div className="mt-3 text-sm text-slate-500 italic">
                💡 "{sub.hints[0]?.substring(0, 60)}{sub.hints[0]!.length > 60 ? '...' : ''}"
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Voting Info Footer */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-center">
        <p className="text-blue-800 font-semibold">
          💡 Top voted mysteries become official! You have <span className="font-bold text-xl">{votesRemaining}</span> vote{votesRemaining !== 1 ? 's' : ''} remaining.
        </p>
      </div>
    </div>
  );
}

function maskAnswer(answer: string): string {
  // Show first and last letter, mask middle with asterisks
  if (answer.length <= 3) return answer;

  const words = answer.split(' ');
  return words
    .map((word) => {
      if (word.length <= 2) return word;
      return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
    })
    .join(' ');
}
