import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CharacterDetail } from '../CharacterDetail';
import * as api from '../../services/api';
import * as storage from '../../services/storage';

vi.mock('../../services/api');
vi.mock('../../services/storage');

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

const renderWithRouter = (id: string = '1') => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/character/:id" element={<CharacterDetail />} />
      </Routes>
    </BrowserRouter>,
    { hydrate: false }
  );
};

describe('CharacterDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', '/character/1');
  });

  it('should render loading state initially', () => {
    vi.spyOn(api, 'getCharacterById').mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );
    vi.spyOn(storage, 'getCharacter').mockReturnValue(null);

    renderWithRouter();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render character details after loading', async () => {
    vi.spyOn(api, 'getCharacterById').mockResolvedValue(mockCharacter);
    vi.spyOn(storage, 'getCharacter').mockReturnValue(null);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Luke Skywalker')).toBeInTheDocument();
      expect(screen.getByDisplayValue('19BBY')).toBeInTheDocument();
      expect(screen.getByDisplayValue('male')).toBeInTheDocument();
    });
  });

  it('should enable editing when Edit button is clicked', async () => {
    vi.spyOn(api, 'getCharacterById').mockResolvedValue(mockCharacter);
    vi.spyOn(storage, 'getCharacter').mockReturnValue(null);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Edit Character')).toBeInTheDocument();
    });

    const editButton = screen.getByText('Edit Character');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  it('should load from localStorage when available', async () => {
    const editedCharacter = { ...mockCharacter, name: 'Edited Name', isEdited: true };
    vi.spyOn(storage, 'getCharacter').mockReturnValue(editedCharacter);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Edited Name')).toBeInTheDocument();
      expect(screen.getByText('Edited')).toBeInTheDocument();
    });
  });
});

