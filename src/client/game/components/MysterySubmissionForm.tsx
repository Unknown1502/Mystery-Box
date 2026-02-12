import React, { useState } from 'react';

interface Props {
  onSubmit: (answer: string, category: string, hints: string[]) => void;
  disabled: boolean;
  submissionsRemaining: number;
}

export function MysterySubmissionForm({ onSubmit, disabled, submissionsRemaining }: Props) {
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [hint1, setHint1] = useState('');
  const [hint2, setHint2] = useState('');
  const [hint3, setHint3] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hints = [hint1, hint2, hint3].filter((h) => h.trim());
    if (answer && category && hints.length >= 3) {
      onSubmit(answer.toUpperCase().trim(), category.trim(), hints);
      
      // Reset form
      setAnswer('');
      setCategory('');
      setHint1('');
      setHint2('');
      setHint3('');
      setShowPreview(false);
    }
  };

  const maskPreview = (text: string) => {
    if (text.length <= 3) return text;
    return text[0] + '*'.repeat(text.length - 2) + text[text.length - 1];
  };

  const canSubmit = submissionsRemaining > 0 && !disabled;

  return (
    <div className="space-y-6">
      {/* Submission Guidelines */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
        <h4 className="font-bold text-blue-900 mb-2">📝 Submission Guidelines</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ Keep it clean and fun for everyone</li>
          <li>✅ Answers must be 3-50 characters</li>
          <li>✅ Provide 3 helpful (but not too obvious) hints</li>
          <li>✅ Best mysteries get voted to the top!</li>
        </ul>
        <div className="mt-3 font-bold text-blue-900">
          Remaining submissions: {submissionsRemaining}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-slate-700 text-sm font-bold mb-2">
            Mystery Answer *
          </label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            maxLength={50}
            placeholder="THE ANSWER TO YOUR MYSTERY"
            className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-lg font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            required
            disabled={!canSubmit}
          />
          <p className="text-xs text-slate-500 mt-1">{answer.length}/50 characters</p>
        </div>

        <div>
          <label className="block text-slate-700 text-sm font-bold mb-2">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-lg text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
            required
            disabled={!canSubmit}
          >
            <option value="">Select a category...</option>
            <option value="Reddit Meme">📱 Reddit Meme</option>
            <option value="Movie Quote">🎬 Movie Quote</option>
            <option value="Gaming">🎮 Gaming</option>
            <option value="TV Show">📺 TV Show</option>
            <option value="Music">🎵 Music</option>
            <option value="Internet Culture">🌐 Internet Culture</option>
            <option value="General Knowledge">📚 General Knowledge</option>
            <option value="Other">🎯 Other</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 text-sm font-bold mb-2">
            Hints (3 required) *
          </label>
          <div className="space-y-3">
            <textarea
              value={hint1}
              onChange={(e) => setHint1(e.target.value)}
              placeholder="Hint 1: A subtle clue... (e.g., 'This phrase is popular on r/wallstreetbets')"
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              rows={2}
              required
              disabled={!canSubmit}
            />
            <textarea
              value={hint2}
              onChange={(e) => setHint2(e.target.value)}
              placeholder="Hint 2: More specific... (e.g., 'Often said when stocks go up')"
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              rows={2}
              required
              disabled={!canSubmit}
            />
            <textarea
              value={hint3}
              onChange={(e) => setHint3(e.target.value)}
              placeholder="Hint 3: Almost giving it away... (e.g., 'Opposite of crashing')"
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              rows={2}
              required
              disabled={!canSubmit}
            />
          </div>
        </div>

        {/* Preview Toggle */}
        {answer && category && hint1 && hint2 && hint3 && (
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition-colors"
          >
            {showPreview ? '👁️ Hide Preview' : '👁️ Preview Mystery'}
          </button>
        )}

        {/* Preview */}
        {showPreview && answer && (
          <div className="bg-slate-800 rounded-2xl p-6 border-2 border-slate-600">
            <h4 className="text-green-400 font-bold mb-3">Preview:</h4>
            <div className="text-green-400 font-mono text-2xl mb-4 tracking-wider">
              {maskPreview(answer.toUpperCase())}
            </div>
            <div className="text-slate-400 text-sm">
              <p className="mb-1">📁 {category}</p>
              <p className="text-xs">💡 {hint1.substring(0, 40)}...</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-black text-xl py-6 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 disabled:cursor-not-allowed disabled:scale-100"
        >
          {disabled ? '⏳ Submitting...' : submissionsRemaining === 0 ? '🚫 Limit Reached' : '🚀 Submit Mystery'}
        </button>
      </form>
    </div>
  );
}
