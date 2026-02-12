interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'text';
  count?: number;
}

export const LoadingSkeleton = ({ type = 'card', count = 1 }: LoadingSkeletonProps) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === 'card') {
    return (
      <>
        {items.map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded"></div>
              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'list') {
    return (
      <>
        {items.map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl animate-pulse">
            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="space-y-3 animate-pulse">
      {items.map((i) => (
        <div key={i} className="h-4 bg-slate-200 rounded"></div>
      ))}
    </div>
  );
};
