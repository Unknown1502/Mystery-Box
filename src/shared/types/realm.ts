export const MAX_GUESSES_PER_DAY = 3;
export const MAX_MYSTERY_SUBMISSIONS_PER_USER = 3; // Per week
export const MAX_VOTES_PER_USER = 5; // Per voting period

export type MysteryType = 'word' | 'image';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type PowerUpType = 'reveal_letter' | 'skip_hint' | 'fifty_fifty';
export type BadgeType = 'first_blood' | 'speed_demon' | 'scholar' | 'perfect_week' | 'team_player' | 'mystery_master' | 'streak_keeper' | 'contributor' | 'vote_master' | 'challenger';
export type ThemeMode = 'light' | 'dark' | 'reddit';

export interface MysteryContent {
  type: MysteryType;
  answer: string; // The correct answer
  category: string; // e.g., "Reddit Meme", "Famous Quote", "Movie"
  imageUrl?: string; // For image mysteries
  hints: string[]; // Hints to reveal at milestones
  difficulty?: DifficultyLevel;
  pointValue?: number;
  timeLimit?: number; // seconds for race mode
}

export interface PowerUp {
  type: PowerUpType;
  name: string;
  description: string;
  cost: number; // in points
  icon: string;
}

export interface Badge {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Team {
  id: string;
  name: string;
  members: string[]; // usernames
  totalSolves: number;
  createdAt: number;
  emblem: string;
}

export interface Challenge {
  id: string;
  challenger: string;
  challenged: string;
  mysteryId: string;
  status: 'pending' | 'active' | 'completed' | 'declined';
  winner?: string;
  createdAt: number;
  completedAt?: number;
}

export interface RevealLevel {
  threshold: number; // Total guesses needed
  description: string;
  revealPercentage: number; // 0-100
}

export const REVEAL_LEVELS: RevealLevel[] = [
  { threshold: 0, description: 'Mystery Hidden', revealPercentage: 25 }, // Start with 25% (first letters + some random)
  { threshold: 10, description: 'First Clue', revealPercentage: 35 },
  { threshold: 25, description: 'Getting Warmer', revealPercentage: 50 },
  { threshold: 50, description: 'Almost There', revealPercentage: 70 },
  { threshold: 100, description: 'Final Reveal', revealPercentage: 90 },
];

export interface MysteryState {
  mystery: MysteryContent;
  totalGuesses: number;
  correctGuessers: string[]; // Usernames who guessed correctly
  firstSolver: string | null;
  firstSolverTime: number | null;
  lastReset: number;
  dailyDate: string;
  currentRevealLevel: number; // Index in REVEAL_LEVELS
}

export interface UserState {
  userId: string;
  username: string;
  guessesUsed: number;
  correctGuesses: number; // Total across all days
  lastGuessDate: string;
  streak: number;
  lastGuess: string | null;
  hasCorrectGuess: boolean; // For current mystery
  achievements: string[]; // Achievement IDs unlocked
  mysteriesSubmitted: number;
  votesUsed: number;
  totalVotesEver: number;
  points: number; // Currency for power-ups
  powerUpsUsed: { [key: string]: number };
  badges: BadgeType[];
  title?: string; // Active display title
  teamId?: string;
  totalSolveTime: number; // milliseconds
  fastestSolve: number; // milliseconds
  theme: ThemeMode;
  activeChallenges: string[]; // Challenge IDs
  challengesWon: number;
  challengesLost: number;
  seasonPoints: number;
}

export interface LeaderboardEntry {
  username: string;
  correctGuesses: number;
  streak: number;
  rank: number;
  fastestSolveTime?: number; // Milliseconds
}

export interface InitResponse {
  type: 'init';
  postId: string;
  username: string;
  mysteryState: MysteryState;
  userState: UserState;
  leaderboard: LeaderboardEntry[];
  revealedContent: string; // What the user can currently see
}

export interface SubmitGuessRequest {
  guess: string;
}

export interface SubmitGuessResponse {
  type: 'submitGuess';
  success: boolean;
  correct: boolean;
  mysteryState: MysteryState;
  userState: UserState;
  leaderboard: LeaderboardEntry[];
  revealedContent: string;
  message?: string;
}

// Daily mystery pool - Add more as needed for longer rotation
export const MYSTERY_POOL = [
  // Reddit Culture
  {
    type: 'word' as MysteryType,
    answer: 'THE NARWHAL BACONS AT MIDNIGHT',
    category: 'Classic Reddit',
    hints: [
      "A secret phrase from Reddit's early days",
      'Involves a marine animal',
      'Used to identify fellow Redditors in public',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'THANKS FOR THE GOLD KIND STRANGER',
    category: 'Reddit Awards',
    hints: [
      'Common response to receiving awards',
      'Shows gratitude to anonymous donors',
      'A Reddit cliché phrase',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'REDDIT HUG OF DEATH',
    category: 'Reddit Culture',
    hints: [
      'What happens when Reddit breaks a website',
      'Too much traffic is the cause',
      'An accidental DDoS from popularity',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'TODAY I LEARNED',
    category: 'Reddit Acronym',
    hints: [
      'Popular subreddit about facts',
      'Three letter acronym T_L',
      'Share interesting information',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'ASK ME ANYTHING',
    category: 'Reddit Format',
    hints: [
      'Q&A session format',
      'Celebrities often do these',
      'Three word phrase, first letters A M A',
    ],
  },
  // Internet Culture
  {
    type: 'word' as MysteryType,
    answer: 'RICKROLL',
    category: 'Internet Meme',
    hints: ['A classic internet prank', 'Never gonna give you up', 'Involves a famous 80s singer'],
  },
  {
    type: 'word' as MysteryType,
    answer: 'TO BE OR NOT TO BE',
    category: 'Famous Quote',
    hints: ["Shakespeare's most famous line", 'From the play Hamlet', 'A question about existence'],
  },
  {
    type: 'word' as MysteryType,
    answer: 'MAY THE FORCE BE WITH YOU',
    category: 'Movie Quote',
    hints: ['Iconic sci-fi franchise blessing', 'Jedi say this phrase', 'From Star Wars'],
  },
  {
    type: 'word' as MysteryType,
    answer: 'WINTER IS COMING',
    category: 'TV Quote',
    hints: ["House Stark's words", 'Warning about the future', 'Game of Thrones phrase'],
  },
  {
    type: 'word' as MysteryType,
    answer: 'LOREM IPSUM DOLOR SIT AMET',
    category: 'Famous Text',
    hints: ['Placeholder text designers use', 'Latin-sounding dummy text', 'Starts with L_R_M'],
  },
  // Fun & Games
  {
    type: 'word' as MysteryType,
    answer: 'THE CAKE IS A LIE',
    category: 'Gaming Meme',
    hints: ['Portal video game phrase', 'About a promised dessert', 'Means false promises'],
  },
  {
    type: 'word' as MysteryType,
    answer: 'ALL YOUR BASE ARE BELONG TO US',
    category: 'Gaming Meme',
    hints: [
      'Broken English translation',
      'From Zero Wing game',
      'Classic gaming meme from the 90s',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'DO A BARREL ROLL',
    category: 'Gaming Quote',
    hints: ['Star Fox command', "Peppy's advice", 'Also a Google easter egg'],
  },
  {
    type: 'word' as MysteryType,
    answer: 'HODOR',
    category: 'TV Character',
    hints: ['One word vocabulary', 'Game of Thrones gentle giant', 'Hold the door origin'],
  },
  {
    type: 'word' as MysteryType,
    answer: 'PRESS F TO PAY RESPECTS',
    category: 'Gaming Meme',
    hints: [
      'From Call of Duty funeral scene',
      'Became a tribute meme',
      'Keyboard action to show mourning',
    ],
  },
  // ==================== REDDIT MEME RIDDLES ====================
  {
    type: 'word' as MysteryType,
    answer: 'THIS IS THE WAY',
    category: 'Reddit Meme',
    hints: [
      'Popular Star Wars series catchphrase',
      'Mandalorian saying',
      'Often spammed in comment chains',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'AND MY AXE',
    category: 'Reddit Meme',
    hints: [
      'Lord of the Rings reference',
      'Gimli offers his weapon',
      'Added to random comment chains',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'STONKS',
    category: 'Reddit Meme',
    hints: [
      'Intentional misspelling about stocks',
      'Shows stonk market gains',
      'From wallstreetbets culture',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'TO THE MOON',
    category: 'Reddit Meme',
    hints: [
      'Cryptocurrency and stock phrase',
      'Predicting massive price increases',
      'Popular in WSB and crypto subs',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'WE LIKE THE STOCK',
    category: 'Reddit Meme',
    hints: [
      'GameStop saga phrase',
      'Wallstreetbets rallying cry',
      'About holding investments',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'DIAMOND HANDS',
    category: 'Reddit Meme',
    hints: [
      'Refusing to sell despite losses',
      'Wallstreetbets term 💎🙌',
      'Opposite of paper hands',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'APES TOGETHER STRONG',
    category: 'Reddit Meme',
    hints: [
      'WSB community motto',
      'From Planet of the Apes',
      'About retail investor unity',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'THIS GUY REDDITS',
    category: 'Reddit Meme',
    hints: [
      'Acknowledging someone knows Reddit',
      'Silicon Valley reference',
      'This guy _____s format',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'NICE',
    category: 'Reddit Meme',
    hints: [
      'Response to the number 69',
      'One word response',
      'Creates comment chains',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'I ALSO CHOOSE THIS GUYS DEAD WIFE',
    category: 'Reddit Meme',
    hints: [
      'Dark humor legendary comment',
      'From an AskReddit thread',
      'Most infamous Reddit response',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'INSTRUCTIONS UNCLEAR',
    category: 'Reddit Meme',
    hints: [
      'When following directions goes wrong',
      'Usually followed by absurd outcome',
      'Common joke format',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'FOUND THE MOBILE USER',
    category: 'Reddit Meme',
    hints: [
      'When someone types R slash wrong',
      'Capital R gives it away',
      'Desktop vs mobile joke',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'USERNAME CHECKS OUT',
    category: 'Reddit Meme',
    hints: [
      "When someone's name matches their comment",
      'Points out fitting usernames',
      'Common Reddit observation',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'THEY DID THE MATH',
    category: 'Reddit Meme',
    hints: [
      'Appreciating complex calculations',
      'Often links to subreddit',
      'Followed by monster math',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'OUR BATTLE WILL BE LEGENDARY',
    category: 'Reddit Meme',
    hints: [
      'Kung Fu Panda reference',
      'Before an epic showdown',
      'Dramatic confrontation phrase',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'IS THIS LOSS',
    category: 'Reddit Meme',
    hints: [
      'Webcomic about miscarriage',
      'Four panel format',
      'Most referenced comic strip',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'PERFECTLY BALANCED AS ALL THINGS SHOULD BE',
    category: 'Reddit Meme',
    hints: [
      'Thanos philosophy',
      'About equilibrium',
      'Avengers villain quote',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'YOU HAVE BEEN BANNED FROM PYONGYANG',
    category: 'Reddit Meme',
    hints: [
      'Moderator joke',
      'North Korea reference',
      'Commentary ban threat',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'HELLO THERE',
    category: 'Reddit Meme',
    hints: [
      'Star Wars prequel quote',
      'General Kenobi greeting',
      'Always gets specific response',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'GENERAL KENOBI',
    category: 'Reddit Meme',
    hints: [
      'Response to Hello There',
      'General Grievous line',
      'Prequel meme chain',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'I AM THE SENATE',
    category: 'Reddit Meme',
    hints: [
      'Palpatine declaration',
      'Star Wars prequel',
      'Power grab moment',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'IRONIC',
    category: 'Reddit Meme',
    hints: [
      'One word Palpatine response',
      'About tragic irony',
      'Prequel meme',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'DELETE THIS NEPHEW',
    category: 'Reddit Meme',
    hints: [
      'NBA meme response',
      'When someone posts cringe',
      'Disapproving uncle energy',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'SIR THIS IS A WENDYS',
    category: 'Reddit Meme',
    hints: [
      'Response to rants',
      'The Office reference',
      'Wrong place for this speech',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'WE DID IT REDDIT',
    category: 'Reddit Meme',
    hints: [
      'Celebrating achievement',
      'Sometimes used ironically',
      'When Reddit accomplishes something',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'PLAY STUPID GAMES WIN STUPID PRIZES',
    category: 'Reddit Meme',
    hints: [
      'About consequences',
      'Foolish actions get results',
      'Common Reddit wisdom',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'TECHNICALLY CORRECT THE BEST KIND OF CORRECT',
    category: 'Reddit Meme',
    hints: [
      'Futurama quote',
      'About pedantic accuracy',
      'Bureaucrat line',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'BIG IF TRUE',
    category: 'Reddit Meme',
    hints: [
      'Skeptical response',
      'Would be significant',
      'Three word phrase',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'THANKS I HATE IT',
    category: 'Reddit Meme',
    hints: [
      'Subreddit about cursed content',
      'Abbreviated as TIHI',
      'Expressing disgust',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'THATS WHAT SHE SAID',
    category: 'Reddit Meme',
    hints: [
      'The Office joke',
      'Michael Scott classic',
      'Innuendo punchline',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'NO YOU',
    category: 'Reddit Meme',
    hints: [
      'Ultimate comeback',
      'Reverse uno card',
      'Two word response',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'DANK MEMES CANT MELT STEEL BEAMS',
    category: 'Reddit Meme',
    hints: [
      'Jet fuel parody',
      'Conspiracy theory joke',
      'About dank memes',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'RETURN TO MONKE',
    category: 'Reddit Meme',
    hints: [
      'Anti-modernity joke',
      'Reject humanity',
      'Embrace primal life',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'BONK GO TO HORNY JAIL',
    category: 'Reddit Meme',
    hints: [
      'Response to thirsty comments',
      'Doge with bat',
      'Inappropriate behavior punishment',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'ALWAYS HAS BEEN',
    category: 'Reddit Meme',
    hints: [
      'Astronaut betrayal meme',
      'Wait its all ___',
      'Shooter behind phrase',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'ITS FREE REAL ESTATE',
    category: 'Reddit Meme',
    hints: [
      'Tim and Eric sketch',
      'Claiming territory',
      'Commercial parody',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'SUFFERING FROM SUCCESS',
    category: 'Reddit Meme',
    hints: [
      'DJ Khaled album',
      'First world problems',
      'Winning but struggling',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'THEY HAD US IN THE FIRST HALF',
    category: 'Reddit Meme',
    hints: [
      'Football press conference',
      'Not gonna lie',
      'Unexpected twist phrase',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'PERHAPS',
    category: 'Reddit Meme',
    hints: [
      'Cow from Barnyard movie',
      'One word maybe response',
      'Sarcastic agreement',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'SHAME',
    category: 'Reddit Meme',
    hints: [
      'Game of Thrones walk',
      'Septa Unella bell',
      'One word judgment',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'YOU UNDERESTIMATE MY POWER',
    category: 'Reddit Meme',
    hints: [
      'Anakin before defeat',
      'High ground response',
      'Overconfident declaration',
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'ITS OVER ANAKIN I HAVE THE HIGH GROUND',
    category: 'Reddit Meme',
    hints: [
      'Obi-Wan tactical advantage',
      'Before the lava fight end',
      'Prequel battle cry',
    ],
  },
  // Science & Tech
  {
    type: 'word' as MysteryType,
    answer: 'HELLO WORLD',
    category: 'Programming',
    hints: ['First program everyone writes', 'Classic programming tradition', 'Two word greeting'],
  },
  {
    type: 'word' as MysteryType,
    answer: 'THERE ARE TEN TYPES OF PEOPLE',
    category: 'Programming Joke',
    hints: [
      'Binary number joke',
      'Starts with "There are..."',
      "Those who understand binary and those who don't",
    ],
  },
  {
    type: 'word' as MysteryType,
    answer: 'FORTY TWO',
    category: 'Sci-Fi',
    hints: [
      'The answer to life, universe, and everything',
      "From Hitchhiker's Guide to the Galaxy",
      'A number spelled out',
    ],
  },
  // Wisdom & Philosophy
  {
    type: 'word' as MysteryType,
    answer: 'WITH GREAT POWER COMES GREAT RESPONSIBILITY',
    category: 'Superhero Quote',
    hints: ["Uncle Ben's advice", 'Spider-Man wisdom', 'About using power wisely'],
  },
  {
    type: 'word' as MysteryType,
    answer: 'LIVE LONG AND PROSPER',
    category: 'TV Quote',
    hints: ['Vulcan greeting', 'Accompanied by hand gesture', 'From Star Trek'],
  },
];

// ==================== COMMUNITY VOTING SYSTEM ====================

export interface MysterySubmission {
  id: string;
  userId: string;
  username: string;
  answer: string;
  category: string;
  hints: string[];
  votes: number;
  voters: string[]; // userIds who voted
  submittedAt: number;
  status: 'pending' | 'approved' | 'rejected' | 'selected';
}

export interface SubmitMysteryRequest {
  answer: string;
  category: string;
  hints: string[];
}

export interface SubmitMysteryResponse {
  success: boolean;
  submission?: MysterySubmission;
  message: string;
}

export interface VoteMysteryRequest {
  submissionId: string;
}

export interface VoteMysteryResponse {
  success: boolean;
  newVoteCount: number;
  message: string;
}

export interface GetSubmissionsResponse {
  submissions: MysterySubmission[];
  userVotesRemaining: number;
}

// ==================== ACHIEVEMENT SYSTEM ====================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'solving' | 'participation' | 'community' | 'special';
  requirement: {
    type: 'streak' | 'total_solves' | 'first_solve' | 'submit_mystery' | 'vote' | 'speed_solve';
    threshold?: number;
    timeLimit?: number; // For speed solves (milliseconds)
  };
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_solve',
    name: 'Mystery Apprentice',
    description: 'Solve your first mystery',
    icon: '🎓',
    category: 'solving',
    requirement: { type: 'total_solves', threshold: 1 },
  },
  {
    id: 'veteran_solver',
    name: 'Mystery Detective',
    description: 'Solve 10 mysteries',
    icon: '🔍',
    category: 'solving',
    requirement: { type: 'total_solves', threshold: 10 },
  },
  {
    id: 'master_solver',
    name: 'Mystery Master',
    description: 'Solve 50 mysteries',
    icon: '🏆',
    category: 'solving',
    requirement: { type: 'total_solves', threshold: 50 },
  },
  {
    id: 'streak_3',
    name: 'Dedicated Detective',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    category: 'participation',
    requirement: { type: 'streak', threshold: 3 },
  },
  {
    id: 'streak_7',
    name: 'Weekly Wonder',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    category: 'participation',
    requirement: { type: 'streak', threshold: 7 },
  },
  {
    id: 'streak_30',
    name: 'Monthly Legend',
    description: 'Maintain a 30-day streak',
    icon: '👑',
    category: 'participation',
    requirement: { type: 'streak', threshold: 30 },
  },
  {
    id: 'first_blood',
    name: 'Quick Draw',
    description: 'Be the first to solve a mystery',
    icon: '⭐',
    category: 'special',
    requirement: { type: 'first_solve' },
  },
  {
    id: 'speed_demon',
    name: 'Speed Solver',
    description: 'Solve within 60 seconds',
    icon: '⚡',
    category: 'solving',
    requirement: { type: 'speed_solve', timeLimit: 60000 },
  },
  {
    id: 'mystery_maker',
    name: 'Mystery Creator',
    description: 'Submit a mystery',
    icon: '✍️',
    category: 'community',
    requirement: { type: 'submit_mystery', threshold: 1 },
  },
  {
    id: 'democratic_voter',
    name: 'Community Voice',
    description: 'Vote on 10 mysteries',
    icon: '🗳️',
    category: 'community',
    requirement: { type: 'vote', threshold: 10 },
  },
];

export interface AchievementUnlockResponse {
  newAchievements: Achievement[];
}

// ==================== POWER-UPS ====================

export const POWER_UPS: PowerUp[] = [
  {
    type: 'reveal_letter',
    name: 'Reveal Letter',
    description: 'Reveal one random hidden letter',
    cost: 50,
    icon: '💡',
  },
  {
    type: 'skip_hint',
    name: 'Skip to Hint',
    description: 'Unlock the next hint immediately',
    cost: 75,
    icon: '⚡',
  },
  {
    type: 'fifty_fifty',
    name: '50/50 Mode',
    description: 'Eliminate half of the wrong letters',
    cost: 100,
    icon: '🎯',
  },
];

// ==================== BADGES & TITLES ====================

export const BADGES: Badge[] = [
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Be the first solver 3 times',
    icon: '🥇',
    requirement: 'firstSolves >= 3',
    rarity: 'rare',
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Solve a mystery in under 30 seconds',
    icon: '⚡',
    requirement: 'fastestSolve < 30000',
    rarity: 'epic',
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Solve 50 mysteries total',
    icon: '📚',
    requirement: 'correctGuesses >= 50',
    rarity: 'epic',
  },
  {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    requirement: 'streak >= 7',
    rarity: 'rare',
  },
  {
    id: 'team_player',
    name: 'Team Player',
    description: 'Contribute 10 solves to your team',
    icon: '👥',
    requirement: 'teamSolves >= 10',
    rarity: 'common',
  },
  {
    id: 'mystery_master',
    name: 'Mystery Master',
    description: 'Solve 100 mysteries',
    icon: '👑',
    requirement: 'correctGuesses >= 100',
    rarity: 'legendary',
  },
  {
    id: 'streak_keeper',
    name: 'Streak Keeper',
    description: 'Maintain a 30-day streak',
    icon: '🌟',
    requirement: 'streak >= 30',
    rarity: 'legendary',
  },
  {
    id: 'contributor',
    name: 'Contributor',
    description: 'Submit 10 approved mysteries',
    icon: '✍️',
    requirement: 'mysteriesSubmitted >= 10',
    rarity: 'rare',
  },
  {
    id: 'vote_master',
    name: 'Vote Master',
    description: 'Cast 50 votes on submissions',
    icon: '🗳️',
    requirement: 'totalVotesEver >= 50',
    rarity: 'common',
  },
  {
    id: 'challenger',
    name: 'Challenger',
    description: 'Win 10 VS challenges',
    icon: '⚔️',
    requirement: 'challengesWon >= 10',
    rarity: 'epic',
  },
];

export const TITLES: { [key in BadgeType]: string } = {
  first_blood: 'Pioneer',
  speed_demon: 'Lightning Solver',
  scholar: 'Wise Detective',
  perfect_week: 'Dedicated Sleuth',
  team_player: 'Squad Leader',
  mystery_master: 'Grand Detective',
  streak_keeper: 'Persistent Hunter',
  contributor: 'Mystery Crafter',
  vote_master: 'Community Judge',
  challenger: 'Duel Champion',
};

// ==================== DIFFICULTY SYSTEM ====================

export const DIFFICULTY_CONFIG = {
  easy: {
    wordCount: { min: 3, max: 5 },
    pointValue: 10,
    label: 'Easy',
    color: '#22c55e',
    emoji: '🟢',
  },
  medium: {
    wordCount: { min: 6, max: 8 },
    pointValue: 25,
    label: 'Medium',
    color: '#f59e0b',
    emoji: '🟡',
  },
  hard: {
    wordCount: { min: 9, max: 15 },
    pointValue: 50,
    label: 'Hard',
    color: '#ef4444',
    emoji: '🔴',
  },
};

// ==================== SEASONS & EVENTS ====================

export interface Season {
  id: string;
  name: string;
  startDate: number;
  endDate: number;
  theme: string;
  rewards: string[];
  specialCategories?: string[];
}

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  eventType: 'themed_week' | 'speed_challenge' | 'team_tournament';
  multiplier: number; // Points multiplier
  specialRules?: string[];
}

// ==================== DAILY THEMES ====================

export interface DailyTheme {
  day: string; // 'Monday', 'Tuesday', etc.
  name: string;
  description: string;
  color: string;
  emoji: string;
  categoryBonus?: string; // Preferred category for this day
}

export const DAILY_THEMES: DailyTheme[] = [
  {
    day: 'Monday',
    name: 'Meme Monday',
    description: 'Internet memes and Reddit culture',
    color: '#f97316', // orange
    emoji: '😂',
    categoryBonus: 'Reddit Meme',
  },
  {
    day: 'Tuesday',
    name: 'Tech Tuesday',
    description: 'Programming, gaming, and technology',
    color: '#3b82f6', // blue
    emoji: '💻',
    categoryBonus: 'Programming',
  },
  {
    day: 'Wednesday',
    name: 'Wisdom Wednesday',
    description: 'Famous quotes and philosophy',
    color: '#8b5cf6', // purple
    emoji: '📚',
    categoryBonus: 'Famous Quote',
  },
  {
    day: 'Thursday',
    name: 'Throwback Thursday',
    description: 'Classic internet culture',
    color: '#ec4899', // pink
    emoji: '⏰',
    categoryBonus: 'Classic Reddit',
  },
  {
    day: 'Friday',
    name: 'Fun Friday',
    description: 'Movies, TV shows, and pop culture',
    color: '#f59e0b', // amber
    emoji: '🎬',
    categoryBonus: 'Movie Quote',
  },
  {
    day: 'Saturday',
    name: 'Community Saturday',
    description: 'User-submitted mysteries shine',
    color: '#10b981', // green
    emoji: '🎨',
    categoryBonus: 'Community',
  },
  {
    day: 'Sunday',
    name: 'Super Sunday',
    description: 'Challenging mysteries for champions',
    color: '#ef4444', // red
    emoji: '🔥',
    categoryBonus: 'Challenge',
  },
];

export function getTodaysTheme(): DailyTheme {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date().getDay();
  const dayName = days[today];
  return DAILY_THEMES.find((t) => t.day === dayName) || DAILY_THEMES[0]!;
}

// ==================== ACTIVITY FEED ====================

export interface ActivityEvent {
  id: string;
  type: 'guess' | 'solve' | 'achievement' | 'submission' | 'vote';
  username: string;
  message: string;
  timestamp: number;
  icon: string;
}

export interface GetActivityResponse {
  events: ActivityEvent[];
}

// ==================== ENHANCED API RESPONSES ====================

export interface EnhancedInitResponse extends InitResponse {
  achievements: Achievement[];
  unlockedAchievements: string[];
  dailyTheme: DailyTheme;
  recentActivity: ActivityEvent[];
  topSubmissions: MysterySubmission[];
}

// ==================== NEW FEATURE API TYPES ====================

// Power-Ups
export interface UsePowerUpRequest {
  powerUpType: PowerUpType;
}

export interface UsePowerUpResponse {
  success: boolean;
  userState: UserState;
  revealedContent?: string;
  unlockedHint?: string;
  eliminatedLetters?: string[];
  message: string;
}

// Teams
export interface CreateTeamRequest {
  teamName: string;
  emblem: string;
}

export interface JoinTeamRequest {
  teamId: string;
}

export interface TeamResponse {
  team: Team;
  members: { username: string; solves: number }[];
  teamRank: number;
}

// Challenges
export interface CreateChallengeRequest {
  challengedUsername: string;
}

export interface RespondChallengeRequest {
  challengeId: string;
  accept: boolean;
}

export interface ChallengeResponse {
  challenge: Challenge;
  userState: UserState;
}

// Stats Dashboard
export interface StatsResponse {
  totalSolves: number;
  averageSolveTime: number;
  fastestSolve: number;
  accuracyRate: number;
  categoriesStats: { [category: string]: number };
  last7Days: { date: string; solves: number }[];
  totalPoints: number;
  seasonRank: number;
}

// Themes
export interface UpdateThemeRequest {
  theme: ThemeMode;
}

// Share
export interface ShareProgressRequest {
  type: 'streak' | 'solve' | 'achievement';
  data: any;
}

export interface ShareProgressResponse {
  shareUrl: string;
  message: string;
}
