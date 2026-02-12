interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ 
  icon = '📭', 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) => {
  return (
    <div className="text-center py-12 px-6">
      <div className="text-7xl mb-4 animate-bounce-subtle">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-2">
        {title}
      </h3>
      <p className="text-slate-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-xl transition-all hover:scale-105"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
