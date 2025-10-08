import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCharacters, getCharacterById, extractIdFromUrl } from '../api';

global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCharacters', () => {
    it('should fetch characters successfully', async () => {
      const mockResponse = {
        count: 82,
        next: 'https://swapi.py4e.com/api/people/?page=2',
        previous: null,
        results: [
          {
            name: 'Luke Skywalker',
            height: '172',
            mass: '77',
            hair_color: 'blond',
            skin_color: 'fair',
            eye_color: 'blue',
            birth_year: '19BBY',
            gender: 'male',
            homeworld: 'https://swapi.py4e.com/api/planets/1/',
            films: [],
            species: [],
            vehicles: [],
            starships: [],
            created: '2014-12-09T13:50:51.644000Z',
            edited: '2014-12-20T21:17:56.891000Z',
            url: 'https://swapi.py4e.com/api/people/1/',
          },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getCharacters(1);

      expect(fetch).toHaveBeenCalledWith('https://swapi.py4e.com/api/people/?page=1');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch characters with search query', async () => {
      const mockResponse = {
        count: 1,
        next: null,
        previous: null,
        results: [],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await getCharacters(1, 'Luke');

      expect(fetch).toHaveBeenCalledWith('https://swapi.py4e.com/api/people/?page=1&search=Luke');
    });

    it('should throw error on failed fetch', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(getCharacters(1)).rejects.toThrow('Failed to fetch characters');
    });
  });

  describe('getCharacterById', () => {
    it('should fetch character by id successfully', async () => {
      const mockCharacter = {
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        birth_year: '19BBY',
        gender: 'male',
        homeworld: 'https://swapi.py4e.com/api/planets/1/',
        films: [],
        species: [],
        vehicles: [],
        starships: [],
        created: '2014-12-09T13:50:51.644000Z',
        edited: '2014-12-20T21:17:56.891000Z',
        url: 'https://swapi.py4e.com/api/people/1/',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCharacter,
      });

      const result = await getCharacterById('1');

      expect(fetch).toHaveBeenCalledWith('https://swapi.py4e.com/api/people/1/');
      expect(result).toEqual(mockCharacter);
    });

    it('should throw error on failed fetch', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(getCharacterById('1')).rejects.toThrow('Failed to fetch character');
    });
  });

  describe('extractIdFromUrl', () => {
    it('should extract id from URL', () => {
      const url = 'https://swapi.py4e.com/api/people/1/';
      expect(extractIdFromUrl(url)).toBe('1');
    });

    it('should extract id from URL with higher numbers', () => {
      const url = 'https://swapi.py4e.com/api/people/42/';
      expect(extractIdFromUrl(url)).toBe('42');
    });

    it('should return empty string for invalid URL', () => {
      const url = 'invalid-url';
      expect(extractIdFromUrl(url)).toBe('');
    });
  });
});

