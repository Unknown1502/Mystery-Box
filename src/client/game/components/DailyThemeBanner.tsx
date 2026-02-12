import { DailyTheme } from '../../../shared/types/realm';

interface Props {
  theme: DailyTheme;
}

export function DailyThemeBanner({ theme }: Props) {
  return (
    <div
      className="rounded-xl p-4 mb-6 border-2 shadow-lg"
      style={{
        backgroundColor: `${theme.color}15`,
        borderColor: theme.color,
      }}
    >
      <div className="flex items-center gap-3">
        <div className="text-4xl">{theme.emoji}</div>
        <div className="flex-1">
          <div className="text-white font-bold text-lg">{theme.name}</div>
          <div className="text-purple-200 text-sm">{theme.description}</div>
        </div>
        <div
          className="px-3 py-1 rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: theme.color }}
        >
          Today
        </div>
      </div>
    </div>
  );
}
