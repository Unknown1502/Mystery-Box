import { redis } from '@devvit/web/server';
import {
  MysteryState,
  UserState,
  LeaderboardEntry,
  MysteryContent,
  MAX_GUESSES_PER_DAY,
  REVEAL_LEVELS,
  MYSTERY_POOL,
} from '../../shared/types/realm';

// Select a daily mystery based on date
function selectDailyMystery(date: string): MysteryContent {
  const dateHash = date.split('-').reduce((acc, val) => acc + parseInt(val, 10), 0);
  const index = dateHash % MYSTERY_POOL.length;
  return MYSTERY_POOL[index] || MYSTERY_POOL[0]!;
}

// Initialize mystery for a post
export async function initializeMystery(postId: string): Promise<void> {
  const mysteryKey = `mystery:${postId}`;
  const exists = await redis.get(`${mysteryKey}:initialized`);

  if (!exists) {
    const today = new Date().toISOString().split('T')[0] || '';
    const mystery = selectDailyMystery(today);

    const initialState: MysteryState = {
      mystery,
      totalGuesses: 0,
      correctGuessers: [],
      firstSolver: null,
      firstSolverTime: null,
      lastReset: Date.now(),
      dailyDate: today,
      currentRevealLevel: 0,
    };

    await redis.set(`${mysteryKey}:state`, JSON.stringify(initialState));
    await redis.set(`${mysteryKey}:initialized`, 'true');
    await redis.set(`${mysteryKey}:userIds`, JSON.stringify([]));
  }
}

// Get current mystery state
export async function getMysteryState(postId: string): Promise<MysteryState> {
  const mysteryKey = `mystery:${postId}`;
  const stateStr = await redis.get(`${mysteryKey}:state`);

  if (!stateStr) {
    throw new Error('Mystery not initialized');
  }

  const state: MysteryState = JSON.parse(stateStr);

  // Check if we need to reset for a new day
  const today = new Date().toISOString().split('T')[0] || '';
  if (state.dailyDate !== today) {
    const mystery = selectDailyMystery(today);
    state.mystery = mystery;
    state.totalGuesses = 0;
    state.correctGuessers = [];
    state.firstSolver = null;
    state.firstSolverTime = null;
    state.lastReset = Date.now();
    state.dailyDate = today;
    state.currentRevealLevel = 0;

    await redis.set(`${mysteryKey}:state`, JSON.stringify(state));
  }

  return state;
}

// Get or create user state
export async function getUserState(
  postId: string,
  userId: string,
  username: string
): Promise<UserState> {
  const userKey = `mystery:${postId}:user:${userId}`;
  const mysteryKey = `mystery:${postId}`;
  const stateStr = await redis.get(userKey);

  if (!stateStr) {
    const newState: UserState = {
      userId,
      username,
      guessesUsed: 0,
      correctGuesses: 0,
      lastGuessDate: new Date().toISOString().split('T')[0] || '',
      streak: 0,
      lastGuess: null,
      hasCorrectGuess: false,
      achievements: [],
      mysteriesSubmitted: 0,
      votesUsed: 0,
      totalVotesEver: 0,
    };
    await redis.set(userKey, JSON.stringify(newState));

    const userIdsStr = await redis.get(`${mysteryKey}:userIds`);
    const userIds: string[] = userIdsStr ? JSON.parse(userIdsStr) : [];
    if (!userIds.includes(userId)) {
      userIds.push(userId);
      await redis.set(`${mysteryKey}:userIds`, JSON.stringify(userIds));
    }

    return newState;
  }

  return JSON.parse(stateStr);
}

// Reset daily guesses for a user
export async function resetDailyGuesses(postId: string, userId: string): Promise<void> {
  const userKey = `mystery:${postId}:user:${userId}`;
  const stateStr = await redis.get(userKey);

  if (stateStr) {
    const userState: UserState = JSON.parse(stateStr);
    const today = new Date().toISOString().split('T')[0] || '';

    if (userState.lastGuessDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      // Update streak
      if (userState.lastGuessDate === yesterday && userState.hasCorrectGuess) {
        userState.streak += 1;
      } else if (userState.lastGuessDate !== yesterday) {
        userState.streak = 0;
      }

      // Reset daily stats
      userState.guessesUsed = 0;
      userState.lastGuessDate = today;
      userState.lastGuess = null;
      userState.hasCorrectGuess = false;

      await redis.set(userKey, JSON.stringify(userState));
    }
  }
}

// Generate revealed content based on current progress
export function generateRevealedContent(mystery: MysteryContent, totalGuesses: number): string {
  // Find current reveal level
  let currentLevel = REVEAL_LEVELS[0]!;
  for (const level of REVEAL_LEVELS) {
    if (totalGuesses >= level.threshold) {
      currentLevel = level;
    }
  }

  if (mystery.type === 'word') {
    const answer = mystery.answer;
    const revealPercentage = currentLevel.revealPercentage;

    if (revealPercentage === 0) {
      // Show only underscores and spaces
      return answer.replace(/[A-Z]/gi, '_');
    }

    // Reveal a percentage of letters
    const lettersToReveal = Math.floor((answer.replace(/\s/g, '').length * revealPercentage) / 100);
    const letterIndices: number[] = [];

    // Get all letter positions
    for (let i = 0; i < answer.length; i++) {
      const char = answer[i];
      if (char && char.match(/[A-Z]/i)) {
        letterIndices.push(i);
      }
    }

    // Randomly select letters to reveal
    const shuffled = letterIndices.sort(() => Math.random() - 0.5);
    const revealedIndices = new Set(shuffled.slice(0, lettersToReveal));

    // Build revealed string
    return answer
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        return revealedIndices.has(i) ? char : '_';
      })
      .join('');
  }

  // For images, return blur level or pixelation level
  return `Pixelation: ${100 - currentLevel.revealPercentage}%`;
}

// Submit a guess
export async function submitGuess(
  postId: string,
  userId: string,
  username: string,
  guess: string
): Promise<{ success: boolean; correct: boolean; message?: string }> {
  const userKey = `mystery:${postId}:user:${userId}`;
  const mysteryKey = `mystery:${postId}`;

  const userStateStr = await redis.get(userKey);
  if (!userStateStr) {
    return { success: false, correct: false, message: 'User not initialized' };
  }

  const userState: UserState = JSON.parse(userStateStr);

  // Check if user already solved it
  if (userState.hasCorrectGuess) {
    return { success: false, correct: true, message: 'You already solved this mystery!' };
  }

  // Check guess limit
  if (userState.guessesUsed >= MAX_GUESSES_PER_DAY) {
    return { success: false, correct: false, message: 'Daily guess limit reached' };
  }

  const mysteryStateStr = await redis.get(`${mysteryKey}:state`);
  if (!mysteryStateStr) {
    return { success: false, correct: false, message: 'Mystery not initialized' };
  }

  const mysteryState: MysteryState = JSON.parse(mysteryStateStr);

  // Normalize and check guess
  const normalizedGuess = guess.trim().toUpperCase();
  const normalizedAnswer = mysteryState.mystery.answer.toUpperCase();
  const isCorrect = normalizedGuess === normalizedAnswer;

  // Update user state
  userState.guessesUsed += 1;
  userState.lastGuess = guess;

  if (isCorrect) {
    userState.hasCorrectGuess = true;
    userState.correctGuesses += 1;

    const solveTime = Date.now() - mysteryState.lastReset;
    const isFirstSolver = !mysteryState.firstSolver;

    // Update mystery state
    mysteryState.totalGuesses += 1;

    if (isFirstSolver) {
      mysteryState.firstSolver = username;
      mysteryState.firstSolverTime = solveTime;
    }

    if (!mysteryState.correctGuessers.includes(username)) {
      mysteryState.correctGuessers.push(username);
    }

    // Update reveal level
    for (let i = REVEAL_LEVELS.length - 1; i >= 0; i--) {
      if (mysteryState.totalGuesses >= REVEAL_LEVELS[i]!.threshold) {
        mysteryState.currentRevealLevel = i;
        break;
      }
    }

    // Save state
    await Promise.all([
      redis.set(`${mysteryKey}:state`, JSON.stringify(mysteryState)),
      redis.set(userKey, JSON.stringify(userState)),
    ]);

    // Check for achievements
    await checkAndUnlockAchievements(postId, userId, userState, {
      justSolved: true,
      solveTime,
      isFirstSolver,
    });

    // Add activity event
    await addActivityEvent(postId, {
      type: 'solve',
      username,
      message: isFirstSolver ? 'solved it FIRST! 👑' : 'solved the mystery!',
      icon: isFirstSolver ? '👑' : '✅',
    });

    return {
      success: true,
      correct: true,
      message: isFirstSolver ? '🎉 You solved it first!' : '✅ Correct!',
    };
  } else {
    // Wrong guess
    mysteryState.totalGuesses += 1;

    // Update reveal level
    for (let i = REVEAL_LEVELS.length - 1; i >= 0; i--) {
      if (mysteryState.totalGuesses >= REVEAL_LEVELS[i]!.threshold) {
        mysteryState.currentRevealLevel = i;
        break;
      }
    }

    await Promise.all([
      redis.set(`${mysteryKey}:state`, JSON.stringify(mysteryState)),
      redis.set(userKey, JSON.stringify(userState)),
    ]);

    // Add activity event (throttled - only every 10th guess to avoid spam)
    if (mysteryState.totalGuesses % 10 === 0) {
      await addActivityEvent(postId, {
        type: 'guess',
        username,
        message: 'made a guess',
        icon: '🤔',
      });
    }

    return { success: true, correct: false, message: '❌ Not quite! Try again.' };
  }
}

// Get leaderboard
export async function getLeaderboard(postId: string): Promise<LeaderboardEntry[]> {
  const mysteryKey = `mystery:${postId}`;

  const userIdsStr = await redis.get(`${mysteryKey}:userIds`);
  const userIds: string[] = userIdsStr ? JSON.parse(userIdsStr) : [];
  const userStates: UserState[] = [];

  for (const userId of userIds) {
    const userKey = `${mysteryKey}:user:${userId}`;
    const stateStr = await redis.get(userKey);
    if (stateStr) {
      userStates.push(JSON.parse(stateStr));
    }
  }

  const sorted = userStates
    .sort((a, b) => {
      // First sort by correct guesses
      if (b.correctGuesses !== a.correctGuesses) {
        return b.correctGuesses - a.correctGuesses;
      }
      // Then by streak
      return b.streak - a.streak;
    })
    .slice(0, 10)
    .map((user, index) => ({
      username: user.username,
      correctGuesses: user.correctGuesses,
      streak: user.streak,
      rank: index + 1,
    }));

  return sorted;
}

// ==================== ACHIEVEMENT SYSTEM ====================

import { ACHIEVEMENTS, ActivityEvent, MysterySubmission } from '../../shared/types/realm';

export async function checkAndUnlockAchievements(
  postId: string,
  userId: string,
  userState: UserState,
  context?: {
    justSolved?: boolean;
    solveTime?: number;
    isFirstSolver?: boolean;
  }
): Promise<string[]> {
  const newlyUnlocked: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    // Skip if already unlocked
    if (userState.achievements.includes(achievement.id)) {
      continue;
    }

    let shouldUnlock = false;

    switch (achievement.requirement.type) {
      case 'total_solves':
        shouldUnlock = userState.correctGuesses >= (achievement.requirement.threshold || 0);
        break;

      case 'streak':
        shouldUnlock = userState.streak >= (achievement.requirement.threshold || 0);
        break;

      case 'first_solve':
        shouldUnlock = context?.isFirstSolver === true;
        break;

      case 'speed_solve':
        if (context?.justSolved && context?.solveTime) {
          shouldUnlock = context.solveTime <= (achievement.requirement.timeLimit || Infinity);
        }
        break;

      case 'submit_mystery':
        shouldUnlock = userState.mysteriesSubmitted >= (achievement.requirement.threshold || 0);
        break;

      case 'vote':
        shouldUnlock = userState.totalVotesEver >= (achievement.requirement.threshold || 0);
        break;
    }

    if (shouldUnlock) {
      newlyUnlocked.push(achievement.id);
      userState.achievements.push(achievement.id);

      // Add activity event
      await addActivityEvent(postId, {
        type: 'achievement',
        username: userState.username,
        message: `unlocked "${achievement.name}"`,
        icon: achievement.icon,
      });
    }
  }

  // Save updated state if achievements were unlocked
  if (newlyUnlocked.length > 0) {
    const userKey = `mystery:${postId}:user:${userId}`;
    await redis.set(userKey, JSON.stringify(userState));
  }

  return newlyUnlocked;
}

// ==================== COMMUNITY VOTING SYSTEM ====================

export async function submitMystery(
  postId: string,
  userId: string,
  username: string,
  answer: string,
  category: string,
  hints: string[]
): Promise<{ success: boolean; submission?: MysterySubmission; message: string }> {
  const userState = await getUserState(postId, userId, username);

  // Check submission limit (3 per week)
  const weekKey = `submissions:${postId}:week:${getWeekIdentifier()}`;
  const weeklySubmissionsStr = await redis.get(weekKey);
  const weeklySubmissions: string[] = weeklySubmissionsStr ? JSON.parse(weeklySubmissionsStr) : [];

  const userWeeklyCount = weeklySubmissions.filter(
    (sub) => JSON.parse(sub).userId === userId
  ).length;

  if (userWeeklyCount >= 3) {
    return {
      success: false,
      message: 'You can only submit 3 mysteries per week. Try again next week!',
    };
  }

  // Create submission
  const submission: MysterySubmission = {
    id: `sub_${Date.now()}_${userId}`,
    userId,
    username,
    answer: answer.toUpperCase().trim(),
    category,
    hints,
    votes: 0,
    voters: [],
    submittedAt: Date.now(),
    status: 'pending',
  };

  // Save submission
  const submissionsKey = `mystery:${postId}:submissions`;
  const submissionsStr = await redis.get(submissionsKey);
  const submissions: MysterySubmission[] = submissionsStr ? JSON.parse(submissionsStr) : [];
  submissions.push(submission);
  await redis.set(submissionsKey, JSON.stringify(submissions));

  // Add to weekly tracking
  weeklySubmissions.push(JSON.stringify(submission));
  await redis.set(weekKey, JSON.stringify(weeklySubmissions), {
    expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // Update user state
  userState.mysteriesSubmitted++;
  const userKey = `mystery:${postId}:user:${userId}`;
  await redis.set(userKey, JSON.stringify(userState));

  // Check for achievement
  await checkAndUnlockAchievements(postId, userId, userState);

  // Add activity event
  await addActivityEvent(postId, {
    type: 'submission',
    username,
    message: `submitted a mystery in "${category}"`,
    icon: '✍️',
  });

  return {
    success: true,
    submission,
    message: 'Mystery submitted successfully! Community will vote on it.',
  };
}

export async function voteMystery(
  postId: string,
  userId: string,
  username: string,
  submissionId: string
): Promise<{ success: boolean; newVoteCount: number; message: string }> {
  const userState = await getUserState(postId, userId, username);

  // Check vote limit (5 per day)
  if (userState.votesUsed >= 5) {
    return {
      success: false,
      newVoteCount: 0,
      message: "You've used all 5 votes today. Come back tomorrow!",
    };
  }

  // Get submissions
  const submissionsKey = `mystery:${postId}:submissions`;
  const submissionsStr = await redis.get(submissionsKey);
  if (!submissionsStr) {
    return {
      success: false,
      newVoteCount: 0,
      message: 'No submissions found',
    };
  }

  const submissions: MysterySubmission[] = JSON.parse(submissionsStr);
  const submission = submissions.find((s) => s.id === submissionId);

  if (!submission) {
    return {
      success: false,
      newVoteCount: 0,
      message: 'Submission not found',
    };
  }

  // Check if already voted
  if (submission.voters.includes(userId)) {
    return {
      success: false,
      newVoteCount: submission.votes,
      message: 'You already voted for this mystery!',
    };
  }

  // Add vote
  submission.votes++;
  submission.voters.push(userId);

  // Save updated submissions
  await redis.set(submissionsKey, JSON.stringify(submissions));

  // Update user state
  userState.votesUsed++;
  userState.totalVotesEver++;
  const userKey = `mystery:${postId}:user:${userId}`;
  await redis.set(userKey, JSON.stringify(userState));

  // Check for achievement
  await checkAndUnlockAchievements(postId, userId, userState);

  // Add activity event
  await addActivityEvent(postId, {
    type: 'vote',
    username,
    message: `voted on a mystery`,
    icon: '🗳️',
  });

  return {
    success: true,
    newVoteCount: submission.votes,
    message: 'Vote recorded! Thanks for participating.',
  };
}

export async function getTopSubmissions(
  postId: string,
  limit: number = 5
): Promise<MysterySubmission[]> {
  const submissionsKey = `mystery:${postId}:submissions`;
  const submissionsStr = await redis.get(submissionsKey);

  if (!submissionsStr) {
    return [];
  }

  const submissions: MysterySubmission[] = JSON.parse(submissionsStr);

  return submissions
    .filter((s) => s.status === 'pending')
    .sort((a, b) => b.votes - a.votes)
    .slice(0, limit);
}

// ==================== ACTIVITY FEED ====================

export async function addActivityEvent(
  postId: string,
  event: Omit<ActivityEvent, 'id' | 'timestamp'>
): Promise<void> {
  const activityKey = `mystery:${postId}:activity`;
  const activityStr = await redis.get(activityKey);
  const events: ActivityEvent[] = activityStr ? JSON.parse(activityStr) : [];

  const newEvent: ActivityEvent = {
    ...event,
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  };

  events.unshift(newEvent); // Add to beginning

  // Keep only last 50 events
  const trimmed = events.slice(0, 50);

  await redis.set(activityKey, JSON.stringify(trimmed));
}

export async function getRecentActivity(
  postId: string,
  limit: number = 10
): Promise<ActivityEvent[]> {
  const activityKey = `mystery:${postId}:activity`;
  const activityStr = await redis.get(activityKey);

  if (!activityStr) {
    return [];
  }

  const events: ActivityEvent[] = JSON.parse(activityStr);
  return events.slice(0, limit);
}

// ==================== HELPER FUNCTIONS ====================

function getWeekIdentifier(): string {
  const now = new Date();
  const year = now.getFullYear();
  const week = getWeekNumber(now);
  return `${year}-W${week}`;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
