import { BunnyTypeId } from './bunnyTypes';

export interface CompatibilityEntry {
  percentage: number;
  description: string;
}

export const COMPATIBILITY_MATRIX: Record<BunnyTypeId, Record<BunnyTypeId, CompatibilityEntry>> = {
  angry: {
    angry: {
      percentage: 70,
      description: 'Two strong characters can understand each other well, but frequent conflicts are possible due to the emotionality of both.',
    },
    happy: {
      percentage: 85,
      description: 'Happy Bunny softens Angry Bunny\'s tension, creating a balance between emotions and positivity.',
    },
    smart: {
      percentage: 80,
      description: 'Smart Bunny helps structure Angry Bunny\'s impulsiveness, but sometimes their approaches may not coincide.',
    },
    wild: {
      percentage: 90,
      description: 'Both love action and energy — together they are a strong, driving duo, although sometimes too chaotic.',
    },
  },
  happy: {
    angry: {
      percentage: 85,
      description: 'Happy Bunny softens Angry Bunny\'s tension, creating a balance between emotions and positivity.',
    },
    happy: {
      percentage: 95,
      description: 'A perfect harmony of positivity, lightness and support. Together they create a very comfortable atmosphere.',
    },
    smart: {
      percentage: 88,
      description: 'Happy Bunny adds lightness, and Smart Bunny adds depth. Good balance of emotions and logic.',
    },
    wild: {
      percentage: 92,
      description: 'Fun and adventure — the perfect combination for bright emotions and constant movement.',
    },
  },
  smart: {
    angry: {
      percentage: 80,
      description: 'Smart Bunny helps structure Angry Bunny\'s impulsiveness, but sometimes their approaches may not coincide.',
    },
    happy: {
      percentage: 88,
      description: 'Happy Bunny adds lightness, and Smart Bunny adds depth. Good balance of emotions and logic.',
    },
    smart: {
      percentage: 85,
      description: 'Deep understanding and stability, but may lack emotions and spontaneity.',
    },
    wild: {
      percentage: 78,
      description: 'Wild Bunny adds chaos and drive, Smart Bunny — control. Works if there is a balance.',
    },
  },
  wild: {
    angry: {
      percentage: 90,
      description: 'Both love action and energy — together they are a strong, driving duo, although sometimes too chaotic.',
    },
    happy: {
      percentage: 92,
      description: 'Fun and adventure — the perfect combination for bright emotions and constant movement.',
    },
    smart: {
      percentage: 78,
      description: 'Wild Bunny adds chaos and drive, Smart Bunny — control. Works if there is a balance.',
    },
    wild: {
      percentage: 88,
      description: 'Complete freedom and adventure, but sometimes lacks stability and planning.',
    },
  },
};