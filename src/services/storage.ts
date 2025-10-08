import { type LocalCharacter } from '../types/character';

const STORAGE_KEY = 'starwars_characters';

export const saveCharacter = (id: string, character: LocalCharacter): void => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const characters = stored ? JSON.parse(stored) : {};
  characters[id] = { ...character, isEdited: true };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
};

export const getCharacter = (id: string): LocalCharacter | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  const characters = JSON.parse(stored);
  return characters[id] || null;
};

export const getAllCharacters = (): Record<string, LocalCharacter> => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

