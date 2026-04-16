export interface EmotionRound {
  id: number;
  bunnyImage: any;
  correctAnswer: string;
  options: string[];
}

export const EMOTION_ROUNDS: EmotionRound[] = [
  {
    id: 1,
    bunnyImage: require('../assets/bunny_thinking.png'),
    correctAnswer: 'Angry',
    options: ['Angry', 'Confused', 'Nervous'],
  },
  {
    id: 2,
    bunnyImage: require('../assets/bunny_default.png'),
    correctAnswer: 'Happy',
    options: ['Happy', 'Scared', 'Surprised'],
  },
  {
    id: 3,
    bunnyImage: require('../assets/bunny_thinking.png'),
    correctAnswer: 'Confused',
    options: ['Sad', 'Confused', 'Angry'],
  },
  {
    id: 4,
    bunnyImage: require('../assets/bunny_walking.png'),
    correctAnswer: 'Nervous',
    options: ['Nervous', 'Excited', 'Happy'],
  },
  {
    id: 5,
    bunnyImage: require('../assets/bunny_default.png'),
    correctAnswer: 'Surprised',
    options: ['Surprised', 'Angry', 'Sad'],
  },
];

export const EMOTION_QUIZ_CONFIG = {
  totalRounds: 5,
  secondsPerRound: 10,
};

export interface EmotionResultTier {
  minScore: number;
  maxScore: number;
  title: string;
  emoji: string;
}

export const EMOTION_RESULT_TIERS: EmotionResultTier[] = [
  { minScore: 0, maxScore: 1, title: 'Keep Practicing!', emoji: '😅' },
  { minScore: 2, maxScore: 3, title: 'Getting There!', emoji: '🙂' },
  { minScore: 4, maxScore: 4, title: 'Emotion Expert!', emoji: '✨' },
  { minScore: 5, maxScore: 5, title: 'Bunny Whisperer!', emoji: '🏆' },
];