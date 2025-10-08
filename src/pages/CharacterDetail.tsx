import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import { type LocalCharacter } from '../types/character';
import { getCharacterById } from '../services/api';

export const CHARACTERS_STORAGE_KEY = 'starwars_characters';

const CHARACTER_FIELDS = [
  { key: 'name' as const, label: 'Name' },
  { key: 'birth_year' as const, label: 'Birth Year' },
  { key: 'gender' as const, label: 'Gender' },
  { key: 'height' as const, label: 'Height (cm)' },
  { key: 'mass' as const, label: 'Mass (kg)' },
  { key: 'hair_color' as const, label: 'Hair Color' },
  { key: 'skin_color' as const, label: 'Skin Color' },
  { key: 'eye_color' as const, label: 'Eye Color' },
] as const;

export const CharacterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Use useLocalStorage hook to manage stored characters
  const [storedCharacters, setStoredCharacters] = useLocalStorage<Record<string, LocalCharacter>>(
    CHARACTERS_STORAGE_KEY,
    {}
  );
  
  const [character, setCharacter] = useState<LocalCharacter | null>(null);
  const [editedCharacter, setEditedCharacter] = useState<LocalCharacter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const localCharacter = useMemo(() => 
    id ? storedCharacters[id] : undefined,
    [id, storedCharacters]
  );

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!id) {
        setError('Character ID is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        if (localCharacter) {
          setCharacter(localCharacter);
          setEditedCharacter(localCharacter);
        } else {
          const data = await getCharacterById(id);
          setCharacter(data);
          setEditedCharacter(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id, localCharacter]);

  const handleInputChange = (field: keyof LocalCharacter, value: string) => {
    if (!editedCharacter) return;
    
    setEditedCharacter({
      ...editedCharacter,
      [field]: value,
    });
  };

  const handleSave = () => {
    if (!id || !editedCharacter) return;
    
    // Save to localStorage using the hook
    setStoredCharacters({
      ...storedCharacters,
      [id]: { ...editedCharacter, isEdited: true },
    });
    
    setCharacter({ ...editedCharacter, isEdited: true });
    setIsEditing(false);
    setSaveSuccess(true);
    
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleCancel = () => {
    setEditedCharacter(character);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !character || !editedCharacter) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Character not found'}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to List
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to List
      </Button>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Character information saved successfully!
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            {character.name}
          </Typography>
          {character.isEdited && (
            <Chip label="Edited" color="secondary" />
          )}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
            },
            gap: 3,
          }}
        >
          {CHARACTER_FIELDS.map(({ key, label }) => (
            <TextField
              key={key}
              fullWidth
              label={label}
              value={editedCharacter[key]}
              onChange={(e) => handleInputChange(key, e.target.value)}
              disabled={!isEditing}
              variant={isEditing ? 'outlined' : 'filled'}
            />
          ))}
        </Box>

        <Box display="flex" gap={2} mt={4}>
          {isEditing ? (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            >
              Edit Character
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

