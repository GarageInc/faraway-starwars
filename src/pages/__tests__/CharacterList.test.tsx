import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CharacterList } from '../CharacterList';
import * as api from '../../services/api';

vi.mock('../../services/api');

const mockCharacters = {
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
    {
      name: 'Darth Vader',
      height: '202',
      mass: '136',
      hair_color: 'none',
      skin_color: 'white',
      eye_color: 'yellow',
      birth_year: '41.9BBY',
      gender: 'male',
      homeworld: 'https://swapi.py4e.com/api/planets/1/',
      films: [],
      species: [],
      vehicles: [],
      starships: [],
      created: '2014-12-10T15:18:20.704000Z',
      edited: '2014-12-20T21:17:50.313000Z',
      url: 'https://swapi.py4e.com/api/people/4/',
    },
  ],
};

describe('CharacterList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    vi.spyOn(api, 'getCharacters').mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <BrowserRouter>
        <CharacterList />
      </BrowserRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render characters after loading', async () => {
    vi.spyOn(api, 'getCharacters').mockResolvedValue(mockCharacters);

    render(
      <BrowserRouter>
        <CharacterList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
      expect(screen.getByText('Darth Vader')).toBeInTheDocument();
    });
  });

  it('should render error message on fetch failure', async () => {
    vi.spyOn(api, 'getCharacters').mockRejectedValue(new Error('Failed to fetch'));

    render(
      <BrowserRouter>
        <CharacterList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });

  it('should display search input', async () => {
    vi.spyOn(api, 'getCharacters').mockResolvedValue(mockCharacters);

    render(
      <BrowserRouter>
        <CharacterList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search characters...')).toBeInTheDocument();
    });
  });
});

