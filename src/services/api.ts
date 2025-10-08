import { type Character, type CharactersResponse } from '../types/character';

const BASE_URL = 'https://swapi.py4e.com/api';

export const getCharacters = async (page: number = 1, search?: string): Promise<CharactersResponse> => {
  let url = `${BASE_URL}/people/?page=${page}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch characters');
  }
  
  return response.json();
};

export const getCharacterById = async (id: string): Promise<Character> => {
  const response = await fetch(`${BASE_URL}/people/${id}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch character');
  }
  
  return response.json();
};

export const extractIdFromUrl = (url: string): string => {
  const matches = url.match(/\/people\/(\d+)\//);
  return matches ? matches[1] : '';
};

