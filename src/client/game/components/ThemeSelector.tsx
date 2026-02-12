import { ThemeMode } from '../../../shared/types/realm';

interface Props {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: Props) {
  const themes: { mode: ThemeMode; name: string; description: string; icon: string; preview: string }[] = [
    {
      mode: 'light',
      name: 'Light Mode',
      description: 'Clean and bright interface',
      icon: '☀️',
      preview: 'bg-gradient-to-br from-slate-50 to-slate-100',
    },
    {
      mode: 'dark',
      name: 'Dark Mode',
      description: 'Easy on the eyes',
      icon: '🌙',
      preview: 'bg-gradient-to-br from-slate-800 to-slate-900',
    },
    {
      mode: 'reddit',
      name: 'Reddit Orange',
      description: 'Classic Reddit colors',
      icon: '🔶',
      preview: 'bg-gradient-to-br from-orange-500 to-red-600',
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-slate-800 mb-4">🎨 Theme</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.mode}
            onClick={() => onThemeChange(theme.mode)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              currentTheme === theme.mode
                ? 'border-blue-500 ring-4 ring-blue-200 scale-105'
                : 'border-slate-300 hover:border-blue-300'
            }`}
          >
            <div className={`w-full h-24 ${theme.preview} rounded-lg mb-3`} />
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{theme.icon}</span>
              <span className="font-bold text-slate-800">{theme.name}</span>
            </div>
            <div className="text-sm text-slate-600">{theme.description}</div>
            {currentTheme === theme.mode && (
              <div className="mt-2 text-xs font-semibold text-blue-600">✓ Active</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
