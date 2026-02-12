# 🎁 Mystery Box

> **Interactive word-guessing game built for Reddit communities**

Mystery Box is a community-driven puzzle game that combines the addictive mechanics of Wordle with the collaborative spirit of Reddit. Players solve daily mysteries, create their own puzzles, vote for tomorrow's challenge, and compete on live leaderboards—all within Reddit's native platform using Devvit.

[![Built with Devvit](https://img.shields.io/badge/Built%20with-Devvit-FF4500?style=flat&logo=reddit)](https://developers.reddit.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite)](https://vite.dev)

---

## 🌟 Features

### 🎯 Core Gameplay
- **Progressive Mystery System** - Solve word puzzles by revealing letters one at a time
- **Community-Unlocked Hints** - More guesses from the community unlock additional clues
- **3 Daily Attempts** - Each player gets 3 guesses per day to solve the mystery
- **Letter Reveal Display** - Beautiful animated letter boxes that flip when revealed

### 🏆 Social & Competitive
- **Live Leaderboard** - Real-time rankings of top solvers
- **Stats Dashboard** - Track your guesses used, total solves, and win streaks
- **Activity Feed** - See real-time community achievements and solves
- **Streak Tracking** - Build your solving streak across consecutive days

### ✍️ Community Creation
- **Mystery Creator Studio** - Build custom puzzles with your own words and hints
- **Voting System** - Vote for your favorite community submissions
- **Democratic Selection** - Most voted mysteries become tomorrow's challenge
- **Category Tags** - Organize mysteries by themes and difficulty

### 🎨 User Experience
- **Celebration Animations** - Confetti explosions and success overlays when you win
- **Tutorial System** - Interactive onboarding for first-time players
- **Responsive Design** - Optimized for both mobile and desktop
- **Progress Indicators** - Visual feedback on reveal thresholds and community progress

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 22+** - [Download here](https://nodejs.org/)
- **Reddit Account** - Required for Devvit authentication
- **Devvit CLI** - Installed automatically during setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mystery-box-p.git
   cd mystery-box-p
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Login to Reddit**
   ```bash
   npm run login
   ```
   Follow the prompts to authenticate with your Reddit account.

4. **Start development server**
   ```bash
   npm run dev
   ```
   This launches the Devvit playtest environment. Open the provided URL in your browser.

5. **Access your game**
   - Navigate to the playtest URL (format: `https://www.reddit.com/r/your_subreddit/?playtest=mystery-box-p`)
   - Click on your Mystery Box post
   - Click "🔓 Unlock Today's Mystery" to start playing

---

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts Devvit playtest server for local development |
| `npm run build` | Compiles client and server for production |
| `npm run deploy` | Uploads new version to Reddit (runs checks first) |
| `npm run launch` | Publishes app for public review |
| `npm run login` | Authenticates CLI with Reddit account |
| `npm run type-check` | Runs TypeScript type checking |
| `npm run lint` | Lints all TypeScript files |
| `npm run prettier` | Formats code with Prettier |
| `npm test` | Runs test suite |

---

## 🛠️ Tech Stack

### Frontend
- **[React 19](https://react.dev)** - UI library with latest features
- **[TypeScript 5.9](https://www.typescriptlang.org)** - Type-safe JavaScript
- **[Vite 7](https://vite.dev)** - Fast build tool and dev server
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first styling
- **[Canvas Confetti](https://github.com/catdad/canvas-confetti)** - Celebration animations

### Backend
- **[Devvit](https://developers.reddit.com)** - Reddit's developer platform
- **[Express.js 5](https://expressjs.com)** - Web server framework
- **[Hono](https://hono.dev)** - Lightweight API routing
- **[Redis](https://redis.io)** - Real-time state management
- **[Reddit API](https://www.reddit.com/dev/api)** - User authentication & data

### Development Tools
- **[ESLint](https://eslint.org)** - Code linting
- **[Prettier](https://prettier.io)** - Code formatting
- **[Vitest](https://vitest.dev)** - Unit testing

---

## 📁 Project Structure

```
mystery-box-p/
├── src/
│   ├── client/              # Frontend React application
│   │   ├── game/            # Main game components
│   │   │   ├── components/  # 30+ React components
│   │   │   │   ├── ActivityFeed.tsx
│   │   │   │   ├── CelebrationOverlay.tsx
│   │   │   │   ├── CommunitySubmissions.tsx
│   │   │   │   ├── Leaderboard.tsx
│   │   │   │   ├── LetterRevealDisplay.tsx
│   │   │   │   ├── MysterySubmissionForm.tsx
│   │   │   │   └── ... (24+ more)
│   │   │   ├── App.tsx      # Main game logic
│   │   │   └── game.tsx     # Game entry point
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useRealm.ts  # Game state management
│   │   │   └── useCounter.ts
│   │   ├── splash/          # Landing page
│   │   │   └── splash.tsx
│   │   ├── game.html        # Game HTML template
│   │   ├── splash.html      # Splash HTML template
│   │   └── index.css        # Global styles
│   │
│   ├── server/              # Backend API & logic
│   │   ├── core/            # Core game mechanics
│   │   │   ├── realm.ts     # Game state functions
│   │   │   └── post.ts      # Reddit post creation
│   │   ├── routes/          # API endpoints
│   │   │   ├── api.ts       # Main API routes
│   │   │   ├── forms.ts
│   │   │   ├── menu.ts
│   │   │   └── triggers.ts
│   │   └── index.ts         # Server entry point
│   │
│   └── shared/              # Shared types & utilities
│       ├── api.ts
│       └── types/
│           ├── api.ts       # API type definitions
│           └── realm.ts     # Game type definitions
│
├── tools/                   # TypeScript configs
│   ├── tsconfig.base.json
│   ├── tsconfig.client.json
│   ├── tsconfig.server.json
│   └── tsconfig.shared.json
│
├── demo.html               # Interactive demo website
├── devvit.json             # Devvit app configuration
├── package.json            # Dependencies & scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config
├── eslint.config.js        # ESLint rules
└── README.md               # You are here!
```

---

## 🎮 How to Play

1. **View the Mystery** - See partially revealed letters with blanks
2. **Make Your Guess** - Submit your answer (3 attempts per day)
3. **Unlock Hints** - Community guesses unlock progressive hints
4. **Track Progress** - Watch your stats and climb the leaderboard
5. **Create Content** - Submit your own mysteries for tomorrow
6. **Vote** - Help choose which community mystery becomes official

---

## 🔧 Configuration

### Devvit Settings (`devvit.json`)

```json
{
  "name": "mystery-box-p",
  "post": {
    "dir": "dist/client",
    "entrypoints": {
      "default": { "inline": true, "entry": "splash.html" },
      "game": { "entry": "game.html" }
    }
  },
  "server": {
    "dir": "dist/server",
    "entry": "index.cjs"
  }
}
```

### Environment Variables

No environment variables are required for local development. Devvit handles authentication automatically.

---

## 🧪 Development Workflow

### Local Development

```bash
# Start playtest server
npm run dev

# In another terminal, make changes to src/
# Vite will hot-reload automatically
```

### Type Checking

```bash
# Check for TypeScript errors
npm run type-check

# Auto-fix linting issues
npm run lint

# Format code
npm run prettier
```

### Building for Production

```bash
# Build optimized bundle
npm run build

# Deploy to Reddit
npm run deploy

# Publish for review
npm run launch
```

---

## 🐛 Troubleshooting

### White Screen Issues

**Problem:** App shows white screen after `npm run dev`

**Solution:** Use `devvit playtest` instead:
```bash
npm run dev  # This runs 'devvit playtest'
```
The app requires Devvit context (postId, username) which is only available in the playtest environment.

### Component Prop Errors

**Problem:** `Cannot read properties of undefined`

**Solution:** Ensure all components have proper default props:
```typescript
interface Props {
  events?: ActivityEvent[];  // Optional with default
}

export function Component({ events = [] }: Props) {
  // Always works even if events is undefined
}
```

### Build Errors

**Problem:** TypeScript compilation errors

**Solution:** Run type checking first:
```bash
npm run type-check
```

---

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/init` | GET | Initialize game state |
| `/api/submitGuess` | POST | Submit player guess |
| `/api/submitMystery` | POST | Submit new mystery |
| `/api/voteMystery` | POST | Vote for submission |
| `/api/submissions` | GET | Get top submissions |
| `/api/activity` | GET | Get recent activity |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting (Prettier)
- Add types for all functions and components
- Write meaningful commit messages

---

## 📝 License

This project is licensed under the **BSD-3-Clause License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Reddit Devvit Team** - For the amazing developer platform
- **React Team** - For the powerful UI library
- **Vite Team** - For the blazing-fast build tool
- **Reddit Community** - For inspiration and feedback

---

## 🔗 Links

- **Demo**: [Interactive Demo with AI Narration](demo.html)
- **Playtest**: [https://www.reddit.com/r/mystery_box_p_dev/?playtest=mystery-box-p](https://www.reddit.com/r/mystery_box_p_dev/?playtest=mystery-box-p)
- **Devvit Docs**: [https://developers.reddit.com/docs](https://developers.reddit.com/docs)
- **Reddit Developer Community**: [r/Devvit](https://www.reddit.com/r/Devvit)

---

## 📞 Support

Having issues? Here's how to get help:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](../../issues)
3. Join [r/Devvit](https://www.reddit.com/r/Devvit) on Reddit
4. Open a new [Issue](../../issues/new) with details

---

**Built with ❤️ for Reddit Communities** | [View Demo](demo.html) | [Play Now](https://www.reddit.com/r/mystery_box_p_dev/?playtest=mystery-box-p)
