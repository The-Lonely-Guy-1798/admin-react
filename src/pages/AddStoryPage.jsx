import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useStories } from '../contexts/StoryContext.jsx';

const AddStoryPage = () => {
  const navigate = useNavigate();
  const { addStory } = useStories();

  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [category, setCategory] = useState('Original');
  const [status, setStatus] = useState('Draft');

  const handleSave = () => {
    if (!title) {
        alert('Title is required!');
        return;
    }
    const newStory = {
        title,
        synopsis,
        category,
        status,
        chapters: 0,
        lastUpdated: 'Just now',
    };
    addStory(newStory);
    navigate('/stories');
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/stories')}
        sx={{ mb: 2 }}
      >
        Back to Stories
      </Button>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ mb: 3, alignSelf: 'flex-start' }}>
          Add New Story
        </Typography>

        <Paper sx={{ p: 3, maxWidth: '900px', width: '100%' }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField 
                label="Story Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                fullWidth 
                required 
            />
            <TextField 
                label="Synopsis" 
                value={synopsis} 
                onChange={(e) => setSynopsis(e.target.value)} 
                multiline 
                rows={4} 
                fullWidth 
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <MenuItem value="Original">Original</MenuItem>
                    <MenuItem value="Fan-Fiction">Fan-Fiction</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                 <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <MenuItem value="Draft">Draft</MenuItem>
                    <MenuItem value="Published">Published</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>Cover Image</Typography>
                <Button component="label" variant="outlined">
                    Choose File
                    <input type="file" hidden accept="image/*" />
                </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
                <Button variant="text" onClick={() => navigate('/stories')}>Cancel</Button>
                <Button variant="contained" size="large" onClick={handleSave}>Save Story</Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddStoryPage;