export type BunnyTypeId = 'angry' | 'happy' | 'smart' | 'wild';

export interface BunnyType {
  id: BunnyTypeId;
  emoji: string;
  name: string;
  color: string;
  image: any;
  description: string;
  quotes: string[];
  tags: string[];
}

export const BUNNY_TYPES: Record<BunnyTypeId, BunnyType> = {
  angry: {
    id: 'angry',
    emoji: '😡',
    name: 'Angry Bunny',
    color: '#FF4D4D',
    image: require('../assets/bunny_angry.png'),
    description: 'You are direct, powerful, and unapologetically real. You act fast, speak truth, and never back down from a challenge.',
    quotes: [
      '"I don\'t wait. I act."',
      '"Say it straight or don\'t say it at all."',
      '"I\'d rather be real than liked."',
      '"Pressure makes me sharper."',
      '"I don\'t lose control — I take it."',
      '"If it matters, I go all in."',
      '"I don\'t ignore problems. I face them."',
      '"Strong feelings mean strong moves."',
      '"I don\'t step back. I step forward."',
      '"Respect is earned, not asked."',
    ],
    tags: ['Direct', 'Bold', 'Passionate', 'Strong'],
  },
  happy: {
    id: 'happy',
    emoji: '😄',
    name: 'Happy Bunny',
    color: '#FFD700',
    image: require('../assets/bunny_happy.png'),
    description: 'You radiate warmth and joy wherever you go. Positivity is your superpower and your smile is contagious.',
    quotes: [
      '"Every day has something good in it."',
      '"Smile first, figure it out later."',
      '"Happiness is my default mode."',
      '"Little moments matter most."',
      '"I choose joy, always."',
      '"Good vibes only, no exceptions."',
      '"I turn ordinary into fun."',
      '"Laugh more, worry less."',
      '"Life feels better when you smile."',
      '"Positivity is my superpower."',
    ],
    tags: ['Joyful', 'Warm', 'Optimistic', 'Kind'],
  },
  smart: {
    id: 'smart',
    emoji: '🧠',
    name: 'Smart Bunny',
    color: '#A78BFA',
    image: require('../assets/bunny_smart.png'),
    description: 'You think before you act, see what others miss, and always find the best solution. Logic is your greatest strength.',
    quotes: [
      '"Think first, act better."',
      '"Every choice shapes the outcome."',
      '"Clarity beats chaos."',
      '"I look deeper before I decide."',
      '"Smart moves win long-term."',
      '"Logic leads, emotions follow."',
      '"I solve, not guess."',
      '"Understanding is power."',
      '"Details make the difference."',
      '"I don\'t rush. I analyze."',
    ],
    tags: ['Curious', 'Analytical', 'Wise', 'Precise'],
  },
  wild: {
    id: 'wild',
    emoji: '🐾',
    name: 'Wild Bunny',
    color: '#34D399',
    image: require('../assets/bunny_wild.png'),
    description: 'You live for freedom, adventure, and the unexpected. Rules can\'t hold you — you follow your instincts.',
    quotes: [
      '"Rules are just suggestions."',
      '"I go where the energy takes me."',
      '"Safe is boring."',
      '"I live for the rush."',
      '"Every day is an adventure."',
      '"I don\'t plan — I explore."',
      '"Freedom is everything."',
      '"Why stay still when you can move?"',
      '"I chase moments, not comfort."',
      '"Wild heart, free soul."',
    ],
    tags: ['Free', 'Adventurous', 'Spontaneous', 'Bold'],
  },
};

export function getRandomQuote(typeId: BunnyTypeId): string {
  const quotes = BUNNY_TYPES[typeId].quotes;
  return quotes[Math.floor(Math.random() * quotes.length)];
}