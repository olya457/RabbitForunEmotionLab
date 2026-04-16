import { BunnyTypeId } from '../data/bunnyTypes';

export interface QuizOption {
  text: string;
  emoji: string;
  type: BunnyTypeId;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface SavedQuote {
  id: string;
  bunnyType: BunnyTypeId;
  quote: string;
  date: string;
}