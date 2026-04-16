import AsyncStorage from '@react-native-async-storage/async-storage';
import { BunnyTypeId } from '../data/bunnyTypes';

const KEY = 'bunnymood_my_bunny_type';

export async function getMyBunnyType(): Promise<BunnyTypeId | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (raw as BunnyTypeId) : null;
  } catch {
    return null;
  }
}

export async function setMyBunnyType(typeId: BunnyTypeId): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, typeId);
  } catch {}
}