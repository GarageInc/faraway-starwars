# Star Wars Characters SPA

A modern Single Page Application built with React and TypeScript that displays Star Wars characters using the [SWAPI (Star Wars API)](https://swapi.py4e.com/).

## Features

- 🎬 **Character List**: Browse Star Wars characters with elegant card-based layout
- 🔍 **Search**: Real-time search functionality using the API
- 📄 **Pagination**: Navigate through all characters with intuitive pagination
- ✏️ **Edit Characters**: Edit character information locally without server requests
- 💾 **Local Storage**: All edits are saved in browser's localStorage
- 🎨 **Material-UI**: Beautiful, responsive design using Material-UI components
- ✅ **Tests**: Comprehensive test coverage with Vitest and React Testing Library

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - UI component library
- **React Router** - Client-side routing
- **usehooks-ts** - React hooks library (useLocalStorage)
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- Bun package manager

### Installation

```bash
# Install dependencies
bun install
```

### Development

```bash
# Start development server
bun run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Build for production
bun run build
```

### Testing

```bash
# Run tests
bun run test

# Run tests with UI
bun run test:ui

# Run tests with coverage
bun run test:coverage
```

## Project Structure

```
src/
├── pages/
│   ├── CharacterList.tsx      # Main page with character cards
│   ├── CharacterDetail.tsx    # Character detail page with edit functionality
│   └── __tests__/             # Page tests
├── services/
│   ├── api.ts                 # Star Wars API service
│   ├── storage.ts             # LocalStorage utilities
│   └── __tests__/             # Service tests
├── types/
│   └── character.ts           # TypeScript interfaces
├── App.tsx                    # Main app component with routing
├── main.tsx                   # Entry point
└── setupTests.ts              # Test configuration
```

## Features in Detail

### Character List Page

- Displays characters in a responsive grid layout
- Search bar filters characters via API
- Pagination controls for browsing all characters
- Visual indicator for edited characters
- Click any card to view details

### Character Detail Page

- Displays all character information
- Edit mode to modify character data
- Save changes locally (stored in localStorage)
- Cancel option to discard changes
- Success notification on save
- "Edited" badge for modified characters

### Local Storage

All character edits are saved in the browser's localStorage under the key `starwars_characters`. This means:
- Edits persist across page refreshes
- No server requests for saving data
- Each character's edited state is tracked
- Original data can be fetched from API at any time

## API Integration

This app uses the [Star Wars API (SWAPI)](https://swapi.py4e.com/):
- `GET /api/people/` - List characters with pagination and search
- `GET /api/people/:id/` - Get individual character details

## License

This project was created as a test task for a React Engineer position.
