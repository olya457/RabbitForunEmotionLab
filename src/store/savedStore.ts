import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedQuote } from '../types/quiz';

const KEY = 'bunnymood_saved_quotes';

export async function getSavedQuotes(): Promise<SavedQuote[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveQuote(quote: SavedQuote): Promise<void> {
  try {
    const current = await getSavedQuotes();
    const updated = [quote, ...current];
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
}

export async function deleteQuote(id: string): Promise<void> {
  try {
    const current = await getSavedQuotes();
    const updated = current.filter(q => q.id !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
}