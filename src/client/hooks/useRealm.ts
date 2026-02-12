import { useState, useEffect, useCallback } from 'react';
import {
  MysteryState,
  UserState,
  LeaderboardEntry,
  EnhancedInitResponse,
  SubmitGuessResponse,
  Achievement,
  DailyTheme,
  ActivityEvent,
  MysterySubmission,
  SubmitMysteryResponse,
  VoteMysteryResponse,
  GetSubmissionsResponse,
} from '../../shared/types/realm';

// Haptic feedback helper
const triggerHaptic = (pattern: number | number[] = 50) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

export function useRealm() {
  const [mysteryState, setMysteryState] = useState<MysteryState | null>(null);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [revealedContent, setRevealedContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');

  // New state for enhanced features
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [dailyTheme, setDailyTheme] = useState<DailyTheme | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityEvent[]>([]);
  const [submissions, setSubmissions] = useState<MysterySubmission[]>([]);
  const [votesRemaining, setVotesRemaining] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [voting, setVoting] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    async function init() {
      try {
        console.log('🔍 Initializing Mystery Box...');
        const response = await fetch('/api/init', {
          method: 'GET',
        });

        console.log('📡 API Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ API Error:', errorText);
          throw new Error('Failed to initialize mystery');
        }

        const data: EnhancedInitResponse = await response.json();
        console.log('✅ Data loaded:', data);
        setMysteryState(data.mysteryState);
        setUserState(data.userState);
        setLeaderboard(data.leaderboard);
        setRevealedContent(data.revealedContent);
        setAchievements(data.achievements);
        setUnlockedAchievements(data.unlockedAchievements);
        setDailyTheme(data.dailyTheme);
        setRecentActivity(data.recentActivity);
        setSubmissions(data.topSubmissions);
        setVotesRemaining(5 - (data.userState.votesUsed || 0));
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    }

    void init();
  }, []);

  // Refresh activity feed periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/activity');
        if (response.ok) {
          const data = await response.json();
          setRecentActivity(data.events);
        }
      } catch (error) {
        console.error('Activity refresh error:', error);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const submitGuess = useCallback(
    async (guess: string) => {
      if (!userState || userState.guessesUsed >= 3) {
        setMessage('❌ No guesses remaining!');
        triggerHaptic([50, 50, 50]); // Error vibration
        return;
      }

      if (!guess || guess.trim().length === 0) {
        setMessage('❌ Please enter a guess');
        triggerHaptic([50, 50, 50]);
        return;
      }

      setLoading(true);
      setMessage('');
      triggerHaptic(50); // Tap feedback

      try {
        const response = await fetch('/api/submitGuess', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            guess: guess.trim(),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          setMessage(error.message || '❌ Failed to submit guess');
          triggerHaptic([100, 50, 100]); // Error pattern
          return;
        }

        const data: SubmitGuessResponse = await response.json();
        setMysteryState(data.mysteryState);

        // Check for new achievements
        const previousAchievements = new Set(userState.achievements || []);
        const newAchievementIds = (data.userState.achievements || []).filter(
          (id) => !previousAchievements.has(id)
        );

        if (newAchievementIds.length > 0) {
          const newAchievs = achievements.filter((a) => newAchievementIds.includes(a.id));
          setNewAchievements((prev) => [...prev, ...newAchievs]);
          triggerHaptic([200, 100, 200, 100, 300]); // Achievement pattern
        }

        setUserState(data.userState);
        setUnlockedAchievements(data.userState.achievements || []);
        setLeaderboard(data.leaderboard);
        setRevealedContent(data.revealedContent);
        setMessage(data.message || '');

        if (data.correct) {
          triggerHaptic([100, 50, 100, 50, 150]); // Success pattern
        } else {
          triggerHaptic(100); // Wrong guess
        }

        // Refresh activity
        const activityResponse = await fetch('/api/activity');
        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          setRecentActivity(activityData.events);
        }
      } catch (error) {
        console.error('Submit guess error:', error);
        setMessage('❌ An error occurred');
        triggerHaptic([100, 50, 100]);
      } finally {
        setLoading(false);
      }
    },
    [userState, achievements]
  );

  const submitMystery = useCallback(
    async (answer: string, category: string, hints: string[]) => {
      setSubmitting(true);
      triggerHaptic(50);

      try {
        const response = await fetch('/api/submitMystery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answer, category, hints }),
        });

        const data: SubmitMysteryResponse = await response.json();

        if (data.success) {
          setMessage('✅ Mystery submitted! Community will vote on it.');
          triggerHaptic([100, 50, 150]);

          // Refresh submissions
          const subResponse = await fetch('/api/submissions');
          if (subResponse.ok) {
            const subData: GetSubmissionsResponse = await subResponse.json();
            setSubmissions(subData.submissions);
            setVotesRemaining(subData.userVotesRemaining);
          }

          // Update user state if needed
          if (userState) {
            setUserState({
              ...userState,
              mysteriesSubmitted: (userState.mysteriesSubmitted || 0) + 1,
            });
          }
        } else {
          setMessage(data.message || '❌ Failed to submit mystery');
          triggerHaptic([100, 50, 100]);
        }
      } catch (error) {
        console.error('Submit mystery error:', error);
        setMessage('❌ Failed to submit mystery');
        triggerHaptic([100, 50, 100]);
      } finally {
        setSubmitting(false);
      }
    },
    [userState]
  );

  const voteMystery = useCallback(
    async (submissionId: string) => {
      setVoting(true);
      triggerHaptic(50);

      try {
        const response = await fetch('/api/voteMystery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ submissionId }),
        });

        const data: VoteMysteryResponse = await response.json();

        if (data.success) {
          setMessage('✅ Vote recorded!');
          triggerHaptic([100, 50, 100]);

          // Update submissions with new vote count
          setSubmissions((prev) =>
            prev.map((sub) =>
              sub.id === submissionId ? { ...sub, votes: data.newVoteCount } : sub
            )
          );

          setVotesRemaining((prev) => Math.max(0, prev - 1));

          // Update user state
          if (userState) {
            setUserState({
              ...userState,
              votesUsed: (userState.votesUsed || 0) + 1,
              totalVotesEver: (userState.totalVotesEver || 0) + 1,
            });
          }

          // Check for achievements
          const voteAchievement = achievements.find(
            (a) =>
              a.id === 'democratic_voter' &&
              !unlockedAchievements.includes(a.id) &&
              (userState?.totalVotesEver || 0) + 1 >= 10
          );

          if (voteAchievement) {
            setNewAchievements((prev) => [...prev, voteAchievement]);
            setUnlockedAchievements((prev) => [...prev, voteAchievement.id]);
            triggerHaptic([200, 100, 200, 100, 300]);
          }
        } else {
          setMessage(data.message || '❌ Failed to vote');
          triggerHaptic([100, 50, 100]);
        }
      } catch (error) {
        console.error('Vote error:', error);
        setMessage('❌ Failed to vote');
        triggerHaptic([100, 50, 100]);
      } finally {
        setVoting(false);
      }
    },
    [userState, achievements, unlockedAchievements]
  );

  const dismissAchievement = useCallback((achievementId: string) => {
    setNewAchievements((prev) => prev.filter((a) => a.id !== achievementId));
  }, []);

  return {
    // Original state
    mysteryState,
    userState,
    leaderboard,
    revealedContent,
    submitGuess,
    loading,
    message,

    // Enhanced features
    achievements,
    unlockedAchievements,
    dailyTheme,
    recentActivity,
    submissions,
    votesRemaining,
    submitting,
    voting,
    newAchievements,

    // Actions
    submitMystery,
    voteMystery,
    dismissAchievement,
  };
}
