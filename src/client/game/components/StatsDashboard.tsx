interface StatsData {
  totalSolves: number;
  averageSolveTime: number;
  fastestSolve: number;
  accuracyRate: number;
  categoriesStats: { [category: string]: number };
  last7Days: { date: string; solves: number }[];
  totalPoints: number;
  seasonRank: number;
}

interface Props {
  stats: StatsData;
}

export function StatsDashboard({ stats }: Props) {
  const formatTime = (ms: number) => {
    if (ms < 60000) return `${Math.floor(ms / 1000)}s`;
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}m ${secs}s`;
  };

  const topCategories = Object.entries(stats.categoriesStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxSolves = Math.max(...stats.last7Days.map(d => d.solves), 1);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-slate-800 mb-6">📊 Your Stats Dashboard</h3>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="text-3xl font-bold text-blue-600">{stats.totalSolves}</div>
          <div className="text-sm text-slate-600">Total Solves</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="text-3xl font-bold text-green-600">{stats.accuracyRate.toFixed(1)}%</div>
          <div className="text-sm text-slate-600">Accuracy</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
          <div className="text-3xl font-bold text-purple-600">{formatTime(stats.fastestSolve)}</div>
          <div className="text-sm text-slate-600">Fastest Solve</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <div className="text-3xl font-bold text-yellow-600">#{stats.seasonRank}</div>
          <div className="text-sm text-slate-600">Season Rank</div>
        </div>
      </div>

      {/* 7-Day Activity */}
      <div className="mb-6">
        <h4 className="font-bold text-slate-700 mb-3">Last 7 Days Activity</h4>
        <div className="flex items-end gap-2 h-32 bg-slate-50 rounded-xl p-4">
          {stats.last7Days.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                style={{ height: `${(day.solves / maxSolves) * 100}%`, minHeight: day.solves > 0 ? '8px' : '4px' }}
                title={`${day.solves} solves`}
              />
              <div className="text-xs text-slate-500 mt-2">{day.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Categories */}
      <div>
        <h4 className="font-bold text-slate-700 mb-3">Top Categories</h4>
        <div className="space-y-2">
          {topCategories.map(([category, count], index) => (
            <div key={category} className="flex items-center gap-3">
              <div className="text-2xl">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📌'}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-700">{category}</span>
                  <span className="text-slate-600">{count} solves</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${(count / stats.totalSolves) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Average Solve Time */}
      <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="text-center">
          <div className="text-sm text-slate-600">Average Solve Time</div>
          <div className="text-2xl font-bold text-slate-800">{formatTime(stats.averageSolveTime)}</div>
        </div>
      </div>
    </div>
  );
}
