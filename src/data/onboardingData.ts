export interface OnboardingPage {
  id: number;
  image: any;
  iconEmoji: string;
  title: string;
  subtitle: string;
  description: string;
  buttonLabel: string;
}

export const ONBOARDING_PAGES: OnboardingPage[] = [
  {
    id: 1,
    image: require('../assets/bunny_default.png'),
    iconEmoji: '🐇',
    title: 'Welcome to BunnyMood!',
    subtitle: 'Your fluffy emotional guide 🐾',
    description:
      'Explore emotions, discover your bunny personality, and have fun with friends — all in one adorable app!',
    buttonLabel: 'Next',
  },
  {
    id: 2,
    image: require('../assets/bunny_thinking.png'),
    iconEmoji: '🎯',
    title: 'Guess the Bunny Emotion',
    subtitle: 'How well do you read feelings?',
    description:
      'Look at a bunny photo and guess what emotion it\'s showing. Race against the clock in 5 timed rounds!',
    buttonLabel: 'Okay',
  },
  {
    id: 3,
    image: require('../assets/bunny_walking.png'),
    iconEmoji: '✨',
    title: 'Which Bunny Are You?',
    subtitle: 'Uncover your inner bunny type',
    description:
      'Take a fun personality quiz and find out if you\'re a Happy, Angry, Smart, or Wild bunny — then share your result!',
    buttonLabel: 'Understood',
  },
  {
    id: 4,
    image: require('../assets/bunny_duo.png'),
    iconEmoji: '👥',
    title: 'Bond With Your Friend',
    subtitle: 'Compatibility mode unlocked!',
    description:
      'Both of you take the quiz separately. Then discover what bunny types you both are and how well you match!',
    buttonLabel: 'Continue',
  },
  {
    id: 5,
    image: require('../assets/bunny_magnifier.png'),
    iconEmoji: '🔍',
    title: 'Find the Unique Bunny',
    subtitle: 'Train your eagle eye!',
    description:
      'Spot the one bunny that\'s different from the rest in 3 increasingly tricky rounds. Can you beat the clock?',
    buttonLabel: 'Start',
  },
];