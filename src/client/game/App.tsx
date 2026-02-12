import { useState, useEffect } from 'react';
import { useRealm } from '../hooks/useRealm';
import { Leaderboard } from './components/Leaderboard';
import { ActivityFeed } from './components/ActivityFeed';
import { MysterySubmissionForm } from './components/MysterySubmissionForm';
import { CommunitySubmissions } from './components/CommunitySubmissions';
import { LetterRevealDisplay } from './components/LetterRevealDisplay';
import { CelebrationOverlay } from './components/CelebrationOverlay';
import { CreatorSpotlight } from './components/CreatorSpotlight';
import { TutorialOverlay } from './components/TutorialOverlay';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { REVEAL_LEVELS, MAX_MYSTERY_SUBMISSIONS_PER_USER } from '../../shared/types/realm';

export const App = () => {
  const {
    mysteryState,
    userState,
    leaderboard,
    submitGuess,
    loading,
    message,
    recentActivity,
    submissions,
    votesRemaining,
    submitting,
    voting,
    submitMystery,
    voteMystery,
  } = useRealm();

  const [guessInput, setGuessInput] = useState('');
  const [activeTab, setActiveTab] = useState<'game' | 'submit' | 'leaderboard'>('game');
  const [showCelebration, setShowCelebration] = useState(false);
  const [justSolved, setJustSolved] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Show tutorial for first-time users
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('mysterybox_tutorial_seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem('mysterybox_tutorial_seen', 'true');
    setShowTutorial(false);
  };

  // Show celebration when user solves the mystery
  useEffect(() => {
    if (userState?.hasCorrectGuess && !justSolved) {
      setShowCelebration(true);
      setJustSolved(true);
    }
  }, [userState?.hasCorrectGuess, justSolved]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900">
        <div className="text-xl font-semibold text-white">🔍 Loading Mystery Box...</div>
      </div>
    );
  }

  if (!mysteryState || !userState) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900">
        <div className="text-xl font-semibold text-red-300">Failed to load mystery data</div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (guessInput.trim()) {
      void submitGuess(guessInput);
      setGuessInput('');
    }
  };

  const currentRevealLevel = REVEAL_LEVELS[mysteryState.currentRevealLevel] || REVEAL_LEVELS[0]!;
  const nextRevealLevel = REVEAL_LEVELS[mysteryState.currentRevealLevel + 1];
  const progressToNext =
    nextRevealLevel && currentRevealLevel
      ? ((mysteryState.totalGuesses - currentRevealLevel.threshold) /
          (nextRevealLevel.threshold - currentRevealLevel.threshold)) *
        100
      : 100;

  const canGuess = userState.guessesUsed < 3 && !userState.hasCorrectGuess;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-slate-50 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header - Mobile Optimized */}
        <div className="text-center py-6 md:py-8">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-2">
            🎯 Mystery Box
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-6">
            Solve community-created mysteries together
          </p>
          
          {/* Simplified Tab Navigation - Large Touch Targets */}
          <div className="flex gap-3 justify-center mb-6">
            <button 
              onClick={() => setActiveTab('game')} 
              className={`flex-1 max-w-[140px] py-4 px-6 rounded-2xl font-bold text-lg transition-all ${
                activeTab === 'game' 
                  ? 'bg-blue-600 text-white shadow-xl scale-105' 
                  : 'bg-white text-slate-700 hover:bg-slate-100 shadow'
              }`}
            >
              🎮 Play
            </button>
            <button 
              onClick={() => setActiveTab('submit')} 
              className={`flex-1 max-w-[140px] py-4 px-6 rounded-2xl font-bold text-lg transition-all ${
                activeTab === 'submit' 
                  ? 'bg-orange-600 text-white shadow-xl scale-105' 
                  : 'bg-white text-slate-700 hover:bg-slate-100 shadow'
              }`}
            >
              ✨ Create
            </button>
            <button 
              onClick={() => setActiveTab('leaderboard')} 
              className={`flex-1 max-w-[140px] py-4 px-6 rounded-2xl font-bold text-lg transition-all ${
                activeTab === 'leaderboard' 
                  ? 'bg-purple-600 text-white shadow-xl scale-105' 
                  : 'bg-white text-slate-700 hover:bg-slate-100 shadow'
              }`}
            >
              🏆 Top
            </button>
          </div>
        </div>

        {/* GAME TAB - Mobile Optimized */}
        {activeTab === 'game' && (
          <div className="space-y-6">
            {/* Main Game Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">
              {/* Category Badge */}
              <div className="text-center mb-6">
                <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-full mb-4">
                  <span className="text-white font-bold text-lg">📁 {mysteryState.mystery.category}</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-2">
                  What is this {mysteryState.mystery.category}?
                </h2>
                <p className="text-slate-600 text-lg">Fill in the blanks to reveal the answer</p>
              </div>

              {/* Mystery Display - Mobile Optimized */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 md:p-10 mb-8 border-4 border-blue-100 shadow-inner">
                <LetterRevealDisplay 
                  answer={mysteryState.mystery.answer}
                  revealPercentage={currentRevealLevel?.revealPercentage || 25}
                  hasUserSolved={userState.hasCorrectGuess}
                />
              </div>

              {/* Community Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-base md:text-lg font-semibold text-slate-700 mb-3">
                  <span>🌍 {mysteryState.totalGuesses} guesses</span>
                  <span>✨ {currentRevealLevel?.description}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 shadow"
                    style={{ width: `${Math.min(progressToNext, 100)}%` }}
                  />
                </div>
                {nextRevealLevel && (
                  <div className="text-sm text-slate-500 mt-2 text-center">
                    Next hint unlocks at {nextRevealLevel.threshold} guesses
                  </div>
                )}
              </div>

              {/* Input Area - LARGE MOBILE BUTTONS */}
              {userState.hasCorrectGuess ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-4 border-green-400 rounded-2xl p-8 text-center">
                  <div className="text-7xl mb-4">🎉</div>
                  <div className="text-green-800 font-bold text-3xl mb-3">Correct!</div>
                  <div className="text-slate-700 text-xl mb-2">The answer was:</div>
                  <div className="text-green-700 font-bold text-3xl mb-4">{mysteryState.mystery.answer}</div>
                  <div className="text-slate-600 text-lg">Come back tomorrow for a new mystery!</div>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Type your answer here..."
                    disabled={!canGuess}
                    className="w-full px-6 py-5 md:py-6 rounded-2xl bg-slate-50 border-4 border-slate-300 text-slate-800 placeholder-slate-400 text-xl md:text-2xl font-semibold focus:outline-none focus:border-blue-500 disabled:opacity-50 mb-4"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!canGuess || !guessInput.trim()}
                    className="w-full py-6 md:py-7 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl md:text-2xl rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl active:scale-95"
                  >
                    Submit Answer ({3 - userState.guessesUsed} tries left)
                  </button>

                  {message && (
                    <div
                      className={`mt-4 text-center py-4 px-6 rounded-2xl font-bold text-lg ${
                        message.includes('✅') || message.includes('🎉')
                          ? 'bg-green-100 text-green-800 border-2 border-green-400'
                          : 'bg-red-100 text-red-800 border-2 border-red-400'
                      }`}
                    >
                      {message}
                    </div>
                  )}
                </div>
              )}

              {/* Hints Section */}
              {mysteryState.mystery.hints.length > 0 && (
                <div className="mt-8 pt-8 border-t-4 border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">💡 Hints</h3>
                  <div className="space-y-3">
                    {mysteryState.mystery.hints.map((hint, index) => {
                      const unlocked = mysteryState.currentRevealLevel >= index + 1;
                      const unlockThreshold = REVEAL_LEVELS[index + 1]?.threshold || 50;
                      const guessesNeeded = Math.max(0, unlockThreshold - mysteryState.totalGuesses);
                      
                      return (
                        <div
                          key={index}
                          className={`p-5 rounded-2xl text-lg font-semibold ${
                            unlocked
                              ? 'bg-yellow-100 text-slate-800 border-4 border-yellow-400'
                              : 'bg-slate-100 text-slate-400 border-4 border-slate-200'
                          }`}
                        >
                          {unlocked ? (
                            <span>{hint}</span>
                          ) : (
                            <span>🔒 Unlocks at {unlockThreshold} guesses ({guessesNeeded} more needed)</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats - Mobile Friendly */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-5 text-center shadow-lg">
                <div className="text-3xl font-bold text-blue-600">{userState.guessesUsed}/3</div>
                <div className="text-slate-600 font-semibold text-sm mt-1">Tries Used</div>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-lg">
                <div className="text-3xl font-bold text-green-600">{userState.correctGuesses}</div>
                <div className="text-slate-600 font-semibold text-sm mt-1">Solved</div>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-lg">
                <div className="text-3xl font-bold text-orange-600">{userState.streak} 🔥</div>
                <div className="text-slate-600 font-semibold text-sm mt-1">Streak</div>
              </div>
            </div>

            {/* Recent Activity Feed */}
            {recentActivity && recentActivity.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 mb-4">🔥 Recent Activity</h3>
                <ActivityFeed events={recentActivity.slice(0, 5)} />
              </div>
            )}
          </div>
        )}

        {/* SUBMIT/CREATE TAB - User Contributions Focus */}
        {activeTab === 'submit' && (
          <div className="space-y-6">
            {/* User Content Showcase - PROMINENT */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 text-white text-center shadow-2xl">
              <div className="text-5xl mb-3">✨</div>
              <h2 className="text-3xl font-bold mb-2">Create Your Mystery!</h2>
              <p className="text-lg opacity-90">
                Mysteries created by players like you make this game amazing
              </p>
            </div>

            {/* Submission Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
              <MysterySubmissionForm
                onSubmit={async (answer: string, category: string, hints: string[]) => {
                  try {
                    await submitMystery(answer, category, hints);
                  } catch (error) {
                    console.error('Submission error:', error);
                  }
                }}
                disabled={submitting}
                submissionsRemaining={MAX_MYSTERY_SUBMISSIONS_PER_USER - (userState.mysteriesSubmitted || 0)}
              />
            </div>

            {/* Community Submissions with Reddit-Style Voting */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-800">
                  🗳️ Vote for Tomorrow's Mystery
                </h3>
                <div className="bg-blue-100 px-4 py-2 rounded-full">
                  <span className="text-blue-700 font-bold">{votesRemaining} votes left</span>
                </div>
              </div>
              <CommunitySubmissions
                submissions={submissions}
                onVote={async (submissionId: string) => {
                  try {
                    await voteMystery(submissionId);
                  } catch (error) {
                    console.error('Vote error:', error);
                  }
                }}
                votesRemaining={votesRemaining}
                voting={voting}
              />
            </div>
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🏆</div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Top Detectives</h2>
              <p className="text-slate-600">Community hall of fame</p>
            </div>
            <Leaderboard entries={leaderboard} currentUser={userState.username} />
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-slate-500 mt-8 mb-4">
          <p className="text-sm">New mystery daily at midnight UTC</p>
          <p className="text-xs mt-1">Created with ❤️ for Reddit</p>
        </div>
      </div>

      {/* Celebration Overlay - Shows when mystery is solved */}
      <CelebrationOverlay
        show={showCelebration}
        onClose={() => setShowCelebration(false)}
        mysteryAnswer={mysteryState.answer}
        points={userState.points}
      />

      {/* Tutorial Overlay - Shows on first visit */}
      {showTutorial && (
        <TutorialOverlay onComplete={handleTutorialComplete} />
      )}
    </div>
  );
};
