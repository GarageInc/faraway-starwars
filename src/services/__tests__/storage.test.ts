import { describe, it, expect, beforeEach } from 'vitest';
import { saveCharacter, getCharacter, getAllCharacters } from '../storage';
import { LocalCharacter } from '../../types/character';

describe('Storage Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockCharacter: LocalCharacter = {
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

  describe('saveCharacter', () => {
    it('should save character to localStorage', () => {
      saveCharacter('1', mockCharacter);

      const stored = localStorage.getItem('starwars_characters');
      expect(stored).not.toBeNull();
      
      const parsed = JSON.parse(stored!);
      expect(parsed['1']).toEqual({ ...mockCharacter, isEdited: true });
    });

    it('should update existing character', () => {
      saveCharacter('1', mockCharacter);
      
      const updatedCharacter = { ...mockCharacter, name: 'Updated Name' };
      saveCharacter('1', updatedCharacter);

      const stored = localStorage.getItem('starwars_characters');
      const parsed = JSON.parse(stored!);
      expect(parsed['1'].name).toBe('Updated Name');
    });

    it('should save multiple characters', () => {
      saveCharacter('1', mockCharacter);
      saveCharacter('2', { ...mockCharacter, name: 'Darth Vader' });

      const stored = localStorage.getItem('starwars_characters');
      const parsed = JSON.parse(stored!);
      expect(Object.keys(parsed)).toHaveLength(2);
    });
  });

  describe('getCharacter', () => {
    it('should retrieve saved character', () => {
      saveCharacter('1', mockCharacter);

      const retrieved = getCharacter('1');
      expect(retrieved).toEqual({ ...mockCharacter, isEdited: true });
    });

    it('should return null for non-existent character', () => {
      const retrieved = getCharacter('999');
      expect(retrieved).toBeNull();
    });

    it('should return null when localStorage is empty', () => {
      const retrieved = getCharacter('1');
      expect(retrieved).toBeNull();
    });
  });

  describe('getAllCharacters', () => {
    it('should retrieve all saved characters', () => {
      saveCharacter('1', mockCharacter);
      saveCharacter('2', { ...mockCharacter, name: 'Darth Vader' });

      const all = getAllCharacters();
      expect(Object.keys(all)).toHaveLength(2);
      expect(all['1'].name).toBe('Luke Skywalker');
      expect(all['2'].name).toBe('Darth Vader');
    });

    it('should return empty object when localStorage is empty', () => {
      const all = getAllCharacters();
      expect(all).toEqual({});
    });
  });
});

