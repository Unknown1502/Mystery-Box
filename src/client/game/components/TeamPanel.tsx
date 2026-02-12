import { useState } from 'react';
import { Team } from '../../../shared/types/realm';

interface Props {
  team: Team | null;
  onCreateTeam: (name: string, emblem: string) => void;
  onJoinTeam: (teamId: string) => void;
  onLeaveTeam: () => void;
}

export function TeamPanel({ team, onCreateTeam, onLeaveTeam }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [selectedEmblem, setSelectedEmblem] = useState('🎯');

  const emblems = ['🎯', '⚡', '🔥', '💎', '🌟', '🏆', '🚀', '💪', '🧠', '👑'];

  if (team) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{team.emblem}</span>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{team.name}</h3>
              <div className="text-sm text-slate-600">
                {team.members.length} members • {team.totalSolves} total solves
              </div>
            </div>
          </div>
          <button
            onClick={onLeaveTeam}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-semibold"
          >
            Leave Team
          </button>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-slate-700 mb-2">Team Members ({team.members.length})</h4>
          {team.members.map((member: string, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {index === 0 ? '👑' : index < 3 ? '⭐' : '👤'}
                </span>
                <span className="font-medium text-slate-700">{member}</span>
              </div>
              <div className="text-blue-600 font-semibold">Member</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-4">👥 Join a Team</h3>
      
      {!showCreate ? (
        <div className="space-y-4">
          <p className="text-slate-600">
            Team up with friends to compete on team leaderboards and earn collective achievements!
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Create New Team
          </button>
          <div className="text-center text-sm text-slate-500">or ask a friend for their team code</div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name..."
              maxLength={30}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Choose Emblem</label>
            <div className="grid grid-cols-5 gap-2">
              {emblems.map((emblem) => (
                <button
                  key={emblem}
                  onClick={() => setSelectedEmblem(emblem)}
                  className={`text-3xl p-3 rounded-xl border-2 transition-all ${
                    selectedEmblem === emblem
                      ? 'border-blue-500 bg-blue-50 scale-110'
                      : 'border-slate-300 hover:border-blue-300'
                  }`}
                >
                  {emblem}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowCreate(false)}
              className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (teamName.trim()) {
                  onCreateTeam(teamName, selectedEmblem);
                  setShowCreate(false);
                }
              }}
              disabled={!teamName.trim()}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              Create Team
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

