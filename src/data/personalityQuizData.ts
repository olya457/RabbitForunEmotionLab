import { BunnyTypeId } from './bunnyTypes';

export interface PersonalityOption {
  text: string;
  type: BunnyTypeId;
}

export interface PersonalityQuestion {
  id: number;
  question: string;
  options: PersonalityOption[];
}

export const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
  {
    id: 1,
    question: 'How do you react to a problem?',
    options: [
      { text: 'I get frustrated and act immediately.', type: 'angry' },
      { text: 'I try to stay positive and move on.', type: 'happy' },
      { text: 'I analyze the situation before doing anything.', type: 'smart' },
      { text: 'I take risks and try something unexpected.', type: 'wild' },
    ],
  },
  {
    id: 2,
    question: 'How do you behave around friends?',
    options: [
      { text: 'I speak my mind, even if it\'s harsh.', type: 'angry' },
      { text: 'I joke around and keep the mood light.', type: 'happy' },
      { text: 'I observe and give thoughtful advice.', type: 'smart' },
      { text: 'I suggest spontaneous fun activities.', type: 'wild' },
    ],
  },
  {
    id: 3,
    question: 'What is most important to you?',
    options: [
      { text: 'Being strong and respected.', type: 'angry' },
      { text: 'Feeling happy and enjoying life.', type: 'happy' },
      { text: 'Making smart decisions.', type: 'smart' },
      { text: 'Freedom and excitement.', type: 'wild' },
    ],
  },
  {
    id: 4,
    question: 'How do you make decisions?',
    options: [
      { text: 'Quickly, based on emotions.', type: 'angry' },
      { text: 'Based on what feels good.', type: 'happy' },
      { text: 'Carefully, with logic and thinking.', type: 'smart' },
      { text: 'Spontaneously, without overthinking.', type: 'wild' },
    ],
  },
  {
    id: 5,
    question: 'Your ideal day looks like this:',
    options: [
      { text: 'Taking control and achieving something big.', type: 'angry' },
      { text: 'Laughing, relaxing, and having fun.', type: 'happy' },
      { text: 'Learning something new or solving a problem.', type: 'smart' },
      { text: 'Going on an unexpected adventure.', type: 'wild' },
    ],
  },
];