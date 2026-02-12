interface CreatorBadgeProps {
  submissionCount: number;
  size?: 'sm' | 'md' | 'lg';
}

export const CreatorBadge = ({ submissionCount, size = 'md' }: CreatorBadgeProps) => {
  const getBadge = () => {
    if (submissionCount >= 50) {
      return { emoji: '💎', name: 'Diamond Creator', color: 'from-cyan-400 to-blue-500' };
    } else if (submissionCount >= 20) {
      return { emoji: '🥇', name: 'Gold Creator', color: 'from-yellow-400 to-orange-500' };
    } else if (submissionCount >= 10) {
      return { emoji: '🥈', name: 'Silver Creator', color: 'from-gray-300 to-gray-400' };
    } else if (submissionCount >= 5) {
      return { emoji: '🥉', name: 'Bronze Creator', color: 'from-orange-800 to-yellow-700' };
    }
    return null;
  };

  const badge = getBadge();
  if (!badge) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <div 
      className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${badge.color} text-white rounded-full font-bold shadow-lg ${sizeClasses[size]} animate-shimmer`}
      title={`${badge.name} - ${submissionCount} mysteries created`}
    >
      <span>{badge.emoji}</span>
      <span>{badge.name}</span>
    </div>
  );
};
