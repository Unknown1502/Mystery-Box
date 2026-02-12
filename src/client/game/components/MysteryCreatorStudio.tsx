import { useState } from 'react';
import { DifficultyLevel, DIFFICULTY_CONFIG } from '../../../shared/types/realm';

interface Props {
  onCreateMystery: (mystery: {
    answer: string;
    category: string;
    hints: string[];
    difficulty: DifficultyLevel;
  }) => void;
  submitting: boolean;
  canSubmit: boolean;
}

const categoryTemplates = [
  { name: 'Movie Quote', icon: '🎬', placeholder: 'MAY THE FORCE BE WITH YOU' },
  { name: 'Famous Quote', icon: '📚', placeholder: 'TO BE OR NOT TO BE' },
  { name: 'Song Lyrics', icon: '🎵', placeholder: 'NEVER GONNA GIVE YOU UP' },
  { name: 'Book Title', icon: '📖', placeholder: 'HARRY POTTER AND THE SORCERERS STONE' },
  { name: 'TV Show', icon: '📺', placeholder: 'BREAKING BAD' },
  { name: 'Historical Fact', icon: '🏛️', placeholder: 'THE FIRST MOON LANDING WAS IN 1969' },
  { name: 'Programming', icon: '💻', placeholder: 'HELLO WORLD' },
  { name: 'Reddit Culture', icon: '🔶', placeholder: 'THANKS FOR THE GOLD KIND STRANGER' },
  { name: 'Custom', icon: '✨', placeholder: 'Your own category!' },
];

export function MysteryCreatorStudio({ onCreateMystery, submitting, canSubmit }: Props) {
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [hints, setHints] = useState(['', '', '']);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [preview, setPreview] = useState('');

  const selectedTemplate = categoryTemplates.find(t => t.name === category);

  const generatePreview = () => {
    if (!answer) return '';
    const words = answer.toUpperCase().split(' ');
    return words.map(word => '_'.repeat(word.length)).join(' ');
  };

  const updatePreview = () => {
    setPreview(generatePreview());
  };

  const wordCount = answer.trim().split(/\s+/).filter(w => w).length;
  const estimatedDiff: DifficultyLevel = 
    wordCount <= 5 ? 'easy' : wordCount <= 8 ? 'medium' : 'hard';

  const handleSubmit = () => {
    if (!answer.trim() || !category.trim() || hints.filter(h => h.trim()).length < 2) {
      alert('Please fill in answer, category, and at least 2 hints!');
      return;
    }

    onCreateMystery({
      answer: answer.toUpperCase().trim(),
      category: category === 'Custom' ? customCategory : category,
      hints: hints.filter(h => h.trim()),
      difficulty,
    });

    // Reset form
    setAnswer('');
    setCategory('');
    setCustomCategory('');
    setHints(['', '', '']);
    setPreview('');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-yellow-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-4">✍️ Mystery Creator Studio</h3>

      {!canSubmit && (
        <div className="mb-4 p-4 bg-red-50 rounded-xl border border-red-200">
          <div className="text-sm text-red-700">
            ⚠️ You've reached your weekly submission limit (3). More slots unlock weekly!
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            1️⃣ Choose Category Template
          </label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {categoryTemplates.map((template) => (
              <button
                key={template.name}
                onClick={() => setCategory(template.name)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  category === template.name
                    ? 'border-yellow-500 bg-yellow-50 scale-105'
                    : 'border-slate-300 hover:border-yellow-300 bg-white'
                }`}
              >
                <div className="text-3xl mb-1">{template.icon}</div>
                <div className="text-xs font-semibold text-slate-700">{template.name}</div>
              </button>
            ))}
          </div>
          
          {category === 'Custom' && (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom category..."
              className="mt-3 w-full px-4 py-2 rounded-lg border-2 border-slate-300 focus:border-yellow-500 focus:outline-none"
            />
          )}
        </div>

        {/* Answer Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            2️⃣ Enter the Answer
          </label>
          <input
            type="text"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              updatePreview();
            }}
            placeholder={selectedTemplate?.placeholder || 'Type the mystery answer...'}
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-yellow-500 focus:outline-none text-lg font-mono"
          />
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>{wordCount} words • Suggested: {estimatedDiff}</span>
            <span>{answer.length}/100</span>
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div className="p-6 bg-slate-100 rounded-xl border-2 border-slate-300">
            <div className="text-sm font-semibold text-slate-600 mb-2">👁️ Preview:</div>
            <div className="text-2xl font-mono font-bold text-slate-700 tracking-wider text-center">
              {preview}
            </div>
          </div>
        )}

        {/* Hints */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            3️⃣ Create Hints (at least 2)
          </label>
          <div className="space-y-2">
            {hints.map((hint, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-2xl">{['💡', '⚡', '🎯'][index]}</span>
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => {
                    const newHints = [...hints];
                    newHints[index] = e.target.value;
                    setHints(newHints);
                  }}
                  placeholder={`Hint ${index + 1} (${index < 2 ? 'required' : 'optional'})`}
                  maxLength={150}
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 focus:border-yellow-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            4️⃣ Set Difficulty
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((diff) => {
              const config = DIFFICULTY_CONFIG[diff];
              return (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    difficulty === diff
                      ? 'border-yellow-500 bg-yellow-50 scale-105'
                      : 'border-slate-300 hover:border-yellow-300 bg-white'
                  }`}
                >
                  <div className="text-3xl mb-1">{config.emoji}</div>
                  <div className="font-bold text-slate-700">{config.label}</div>
                  <div className="text-xs text-slate-600">{config.pointValue} pts</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting || !answer.trim() || !category.trim()}
          className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {submitting ? '⏳ Submitting...' : '🚀 Submit Mystery for Review'}
        </button>

        <div className="text-xs text-slate-500 text-center">
          Your submission will be reviewed by the community and moderators before going live.
        </div>
      </div>
    </div>
  );
}
