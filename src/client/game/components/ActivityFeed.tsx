import { ActivityEvent } from '../../../shared/types/realm';

interface Props {
  events?: ActivityEvent[];
}

export function ActivityFeed({ events = [] }: Props) {
  if (events.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          📢 Community Activity
        </h3>
        <p className="text-purple-200 text-sm">No activity yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        📢 Live Activity
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {events.map((event) => (
          <div key={event.id} className="bg-black/20 rounded-lg p-3 text-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-lg">{event.icon}</span>
              <span className="text-purple-100 font-semibold">{event.username}</span>
              <span className="text-purple-300">{event.message}</span>
            </div>
            <div className="text-purple-400 text-xs mt-1">{getTimeAgo(event.timestamp)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
