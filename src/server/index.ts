import express from 'express';
import {
  SubmitGuessRequest,
  SubmitGuessResponse,
  SubmitMysteryRequest,
  SubmitMysteryResponse,
  VoteMysteryRequest,
  VoteMysteryResponse,
  GetSubmissionsResponse,
  GetActivityResponse,
  EnhancedInitResponse,
  ACHIEVEMENTS,
  getTodaysTheme,
} from '../shared/types/realm';
import { reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';
import {
  getMysteryState,
  getUserState,
  submitGuess,
  getLeaderboard,
  initializeMystery,
  resetDailyGuesses,
  generateRevealedContent,
  submitMystery,
  voteMystery,
  getTopSubmissions,
  getRecentActivity,
} from './core/realm';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

router.get<{ postId: string }, EnhancedInitResponse | { status: string; message: string }>(
  '/api/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      console.error('API Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const username = await reddit.getCurrentUsername();
      const userId = username ?? 'anonymous';

      await initializeMystery(postId);

      const [mysteryState, userState, leaderboard, recentActivity, topSubmissions] =
        await Promise.all([
          getMysteryState(postId),
          getUserState(postId, userId, username ?? 'anonymous'),
          getLeaderboard(postId),
          getRecentActivity(postId, 10),
          getTopSubmissions(postId, 5),
        ]);

      await resetDailyGuesses(postId, userId);

      const revealedContent = generateRevealedContent(
        mysteryState.mystery,
        mysteryState.totalGuesses
      );
      const dailyTheme = getTodaysTheme();

      res.json({
        type: 'init',
        postId: postId,
        username: username ?? 'anonymous',
        mysteryState,
        userState,
        leaderboard,
        revealedContent,
        achievements: ACHIEVEMENTS,
        unlockedAchievements: userState.achievements,
        dailyTheme,
        recentActivity,
        topSubmissions,
      });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

router.post<
  { postId: string },
  SubmitGuessResponse | { status: string; message: string },
  SubmitGuessRequest
>('/api/submitGuess', async (req, res): Promise<void> => {
  const { postId } = context;
  if (!postId) {
    res.status(400).json({
      status: 'error',
      message: 'postId is required',
    });
    return;
  }

  try {
    const username = await reddit.getCurrentUsername();
    const userId = username ?? 'anonymous';
    const { guess } = req.body;

    if (!guess || guess.trim().length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'Guess cannot be empty',
      });
      return;
    }

    const result = await submitGuess(postId, userId, username ?? 'anonymous', guess);

    if (!result.success) {
      res.status(400).json({
        status: 'error',
        message: result.message || 'Failed to submit guess',
      });
      return;
    }

    const [mysteryState, userState, leaderboard] = await Promise.all([
      getMysteryState(postId),
      getUserState(postId, userId, username ?? 'anonymous'),
      getLeaderboard(postId),
    ]);

    const revealedContent = generateRevealedContent(
      mysteryState.mystery,
      mysteryState.totalGuesses
    );

    res.json({
      type: 'submitGuess',
      success: true,
      correct: result.correct,
      mysteryState,
      userState,
      leaderboard,
      revealedContent,
      message: result.message || '',
    });
  } catch (error) {
    console.error(`API SubmitGuess Error for post ${postId}:`, error);
    let errorMessage = 'Unknown error during guess submission';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(400).json({ status: 'error', message: errorMessage });
  }
});
// ==================== COMMUNITY VOTING ENDPOINTS ====================

router.post<Record<string, never>, SubmitMysteryResponse, SubmitMysteryRequest>(
  '/api/submitMystery',
  async (req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({ success: false, message: 'postId is required' });
      return;
    }

    try {
      const username = await reddit.getCurrentUsername();
      const userId = username ?? 'anonymous';
      const { answer, category, hints } = req.body;

      if (!answer || !category || !hints || hints.length === 0) {
        res
          .status(400)
          .json({ success: false, message: 'Answer, category, and hints are required' });
        return;
      }

      const result = await submitMystery(
        postId,
        userId,
        username ?? 'anonymous',
        answer,
        category,
        hints
      );
      res.json(result);
    } catch (error) {
      console.error(`Submit Mystery Error:`, error);
      res.status(500).json({ success: false, message: 'Failed to submit mystery' });
    }
  }
);

router.post<Record<string, never>, VoteMysteryResponse, VoteMysteryRequest>(
  '/api/voteMystery',
  async (req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({ success: false, newVoteCount: 0, message: 'postId is required' });
      return;
    }

    try {
      const username = await reddit.getCurrentUsername();
      const userId = username ?? 'anonymous';
      const { submissionId } = req.body;

      if (!submissionId) {
        res
          .status(400)
          .json({ success: false, newVoteCount: 0, message: 'submissionId is required' });
        return;
      }

      const result = await voteMystery(postId, userId, username ?? 'anonymous', submissionId);
      res.json(result);
    } catch (error) {
      console.error(`Vote Mystery Error:`, error);
      res.status(500).json({ success: false, newVoteCount: 0, message: 'Failed to vote' });
    }
  }
);

router.get<Record<string, never>, GetSubmissionsResponse>(
  '/api/submissions',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({ submissions: [], userVotesRemaining: 0 });
      return;
    }

    try {
      const username = await reddit.getCurrentUsername();
      const userId = username ?? 'anonymous';

      const [submissions, userState] = await Promise.all([
        getTopSubmissions(postId, 10),
        getUserState(postId, userId, username ?? 'anonymous'),
      ]);

      res.json({
        submissions,
        userVotesRemaining: 5 - userState.votesUsed,
      });
    } catch (error) {
      console.error(`Get Submissions Error:`, error);
      res.status(500).json({ submissions: [], userVotesRemaining: 0 });
    }
  }
);

router.get<Record<string, never>, GetActivityResponse>(
  '/api/activity',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({ events: [] });
      return;
    }

    try {
      const events = await getRecentActivity(postId, 15);
      res.json({ events });
    } catch (error) {
      console.error(`Get Activity Error:`, error);
      res.status(500).json({ events: [] });
    }
  }
);
router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
