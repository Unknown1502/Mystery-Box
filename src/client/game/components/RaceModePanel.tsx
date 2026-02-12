import { useState, useEffect } from 'react';

interface RaceParticipant {
  username: string;
  progress: number; // 0-100%
  finished: boolean;
  time?: number;
}

interface Props {
  isActive: boolean;
  participants: RaceParticipant[];
  timeLimit: number; // seconds
  onJoinRace: () => void;
  onLeaveRace: () => void;
  userProgress: number;
}

export function RaceModePanel({ isActive, participants, timeLimit, onJoinRace, onLeaveRace, userProgress }: Props) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setTimeRemaining((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.finished && !b.finished) return -1;
    if (!a.finished && b.finished) return 1;
    return b.progress - a.progress;
  });

  if (!isActive) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">🏁 Race Mode</h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🏎️</div>
          <p className="text-slate-600 mb-6">
            Compete in real-time! Solve the mystery faster than other players.
          </p>
          <button
            onClick={onJoinRace}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg rounded-xl hover:from-green-600 hover:to-blue-600 transition-all shadow-lg"
          >
            Join Next Race
          </button>
          <div className="mt-4 text-sm text-slate-500">
            Races start when 3+ players join
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-500">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800">🏁 RACE IN PROGRESS</h3>
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-red-600">{formatTime(timeRemaining)}</div>
          <button
            onClick={onLeaveRace}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
          >
            Leave
          </button>
        </div>
      </div>

      {/* Your Progress */}
      <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-400">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-slate-800">Your Progress</span>
          <span className="text-blue-600 font-bold">{userProgress}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${userProgress}%` }}
          />
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-2">
        <h4 className="font-bold text-slate-700 mb-3">Live Standings ({participants.length} racers)</h4>
        {sortedParticipants.map((participant, index) => (
          <div
            key={participant.username}
            className={`p-3 rounded-lg border-2 flex items-center justify-between ${
              participant.finished
                ? 'bg-green-50 border-green-300'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {index === 0 && participant.finished ? '🥇' : index === 1 && participant.finished ? '🥈' : index === 2 && participant.finished ? '🥉' : '🏃'}
              </span>
              <div>
                <div className="font-bold text-slate-800">{participant.username}</div>
                {participant.finished && participant.time && (
                  <div className="text-xs text-green-600">
                    Finished in {formatTime(participant.time)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!participant.finished && (
                <div className="w-24 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${participant.progress}%` }}
                  />
                </div>
              )}
              <div className="font-bold text-slate-600 text-sm">
                {participant.finished ? '✓ Done' : `${participant.progress}%`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {timeRemaining === 0 && (
        <div className="mt-4 p-4 bg-red-50 rounded-xl border-2 border-red-300 text-center">
          <div className="font-bold text-red-700 text-lg">⏰ Time's Up!</div>
          <div className="text-sm text-slate-600 mt-1">Results will be shown shortly</div>
        </div>
      )}
    </div>
  );
}
