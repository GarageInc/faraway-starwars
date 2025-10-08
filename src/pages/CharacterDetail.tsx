import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { saveCharacter, getCharacter } from '../services/storage';

export const CharacterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [character, setCharacter] = useState<LocalCharacter | null>(null);
  const [editedCharacter, setEditedCharacter] = useState<LocalCharacter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
        // First check if we have a locally stored version
        const localCharacter = getCharacter(id);
        
        if (localCharacter) {
          setCharacter(localCharacter);
          setEditedCharacter(localCharacter);
        } else {
          // Fetch from API if not in local storage
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
  }, [id]);

  const handleInputChange = (field: keyof LocalCharacter, value: string) => {
    if (!editedCharacter) return;
    
    setEditedCharacter({
      ...editedCharacter,
      [field]: value,
    });
  };

  const handleSave = () => {
    if (!id || !editedCharacter) return;
    
    saveCharacter(id, editedCharacter);
    setCharacter(editedCharacter);
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
          <TextField
            fullWidth
            label="Name"
            value={editedCharacter.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={!isEditing}
            variant={isEditing ? 'outlined' : 'filled'}
          />

          <TextField
            fullWidth
            label="Birth Year"
            value={editedCharacter.birth_year}
            onChange={(e) => handleInputChange('birth_year', e.target.value)}
            disabled={!isEditing}
            variant={isEditing ? 'outlined' : 'filled'}
          />

          <TextField
            fullWidth
            label="Gender"
            value={editedCharacter.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            disabled={!isEditing}
            variant={isEditing ? 'outlined' : 'filled'}
          />

          <TextField
            fullWidth
            label="Height (cm)"
            value={editedCharacter.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            disabled={!isEditing}
            variant={isEditing ? 'outlined' : 'filled'}
          />

          <TextField
            fullWidth
            label="Mass (kg)"
            value={editedCharacter.mass}
            onChange={(e) => handleInputChange('mass', e.target.value)}
            disabled={!isEditing}
            variant={isEditing ? 'outlined' : 'filled'}
          />

          <TextField
            fullWidth
            label="Hair Color"
            value={editedCharacter.hair_color}
            onChange={(e) => handleInputChange('hair_color', e.target.value)}
            disabled={!isEditing}
            variant={isEditing ? 'outlined' : 'filled'}
          />

          <TextField
            fullWidth
            label="Skin Color"
            value={editedCharacter.skin_color}
            onChange={(e) => handleInputChange('skin_color', e.target.value)}
            disabled={!isEditing}
            variant={isEditing ? 'outlined' : 'filled'}
          />

          <TextField
            fullWidth
            label="Eye Color"
            value={editedCharacter.eye_color}
            onChange={(e) => handleInputChange('eye_color', e.target.value)}
            disabled={!isEditing}
            variant={isEditing ? 'outlined' : 'filled'}
          />
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

