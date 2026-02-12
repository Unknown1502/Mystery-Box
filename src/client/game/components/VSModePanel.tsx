import { useState } from 'react';
import { Challenge } from '../../../shared/types/realm';

interface Props {
  challenges: Challenge[];
  userRecord: { wins: number; losses: number };
  recentMatches: Array<{ opponent: string; result: 'win' | 'loss'; date: number }>;
  onCreateChallenge: (username: string) => void;
  onRespondChallenge: (challengeId: string, accept: boolean) => void;
}

export function VSModePanel({ challenges, userRecord, recentMatches, onCreateChallenge, onRespondChallenge }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [targetUsername, setTargetUsername] = useState('');

  const pendingChallenges = challenges.filter(c => c.status === 'pending');
  const activeFights = challenges.filter(c => c.status === 'active');

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">⚔️ VS Mode</h3>
          <div className="text-sm text-slate-600">
            {userRecord.wins}W - {userRecord.losses}L
          </div>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
        >
          {showCreate ? 'Cancel' : '+ Challenge'}
        </button>
      </div>

      {showCreate && (
        <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Challenge a Player
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={targetUsername}
              onChange={(e) => setTargetUsername(e.target.value)}
              placeholder="Enter username..."
              className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 focus:border-red-500 focus:outline-none"
            />
            <button
              onClick={() => {
                if (targetUsername.trim()) {
                  onCreateChallenge(targetUsername);
                  setTargetUsername('');
                  setShowCreate(false);
                }
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Pending Challenges */}
      {pendingChallenges.length > 0 && (
        <div className="mb-6">
          <h4 className="font-bold text-slate-700 mb-3">Incoming Challenges</h4>
          <div className="space-y-2">
            {pendingChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-300 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-800">
                    🥊 {challenge.challenger} challenges you!
                  </div>
                  <div className="text-sm text-slate-600">
                    {new Date(challenge.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onRespondChallenge(challenge.id, true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onRespondChallenge(challenge.id, false)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Challenges */}
      {activeFights.length > 0 && (
        <div className="mb-6">
          <h4 className="font-bold text-slate-700 mb-3">Active Duels</h4>
          <div className="space-y-2">
            {activeFights.map((challenge) => (
              <div
                key={challenge.id}
                className="p-4 bg-blue-50 rounded-xl border border-blue-300"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-800">
                    {challenge.challenger} ⚔️ {challenge.challenged}
                  </div>
                  <div className="text-sm text-blue-600 font-semibold animate-pulse">
                    IN PROGRESS
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Matches */}
      {recentMatches.length > 0 && (
        <div>
          <h4 className="font-bold text-slate-700 mb-3">Recent Matches</h4>
          <div className="space-y-2">
            {recentMatches.slice(0, 5).map((match, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${
                  match.result === 'win'
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-semibold">{match.opponent}</span>
                    {' - '}
                    <span className={match.result === 'win' ? 'text-green-600' : 'text-red-600'}>
                      {match.result === 'win' ? 'Victory' : 'Defeat'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(match.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {challenges.length === 0 && recentMatches.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <div className="text-4xl mb-2">🎯</div>
          <div>No active challenges. Challenge someone to start!</div>
        </div>
      )}
    </div>
  );
}

