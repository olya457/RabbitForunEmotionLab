export interface GameRound {
  roundNumber: number;
  timeSeconds: number;
  gridColumns: number;
  gridRows: number;
}

export const GAME_ROUNDS: GameRound[] = [
  { roundNumber: 1, timeSeconds: 45, gridColumns: 5, gridRows: 5 },
  { roundNumber: 2, timeSeconds: 30, gridColumns: 5, gridRows: 6 },
  { roundNumber: 3, timeSeconds: 20, gridColumns: 6, gridRows: 6 },
];

export interface GameResultTier {
  minScore: number;
  maxScore: number;
  title: string;
  emoji: string;
  description: string;
}

export const GAME_RESULT_TIERS: GameResultTier[] = [
  { minScore: 0, maxScore: 0, title: 'Keep Trying!',    emoji: '😅', description: 'The bunnies tricked you. Try again!' },
  { minScore: 1, maxScore: 1, title: 'Good Eye!',       emoji: '👁️', description: 'You found one! Your eagle eye is waking up.' },
  { minScore: 2, maxScore: 2, title: 'Sharp Looker!',   emoji: '🔍', description: 'Great eye! You found most of the unique bunnies.' },
  { minScore: 3, maxScore: 3, title: 'Eagle Eye!',      emoji: '🦅', description: 'Perfect score! Nothing escapes your sharp gaze!' },
];