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

  // State for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Original');
  const [status, setStatus] = useState('Draft');
  
  // State for image preview and validation
  const [coverPreview, setCoverPreview] = useState(null);
  const [fileError, setFileError] = useState('');
  const [coverFile, setCoverFile] = useState(null);

  const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) {
    setCoverPreview(null);
    setCoverFile(null);
    setFileError('');
    return;
  }

    // Validation: Check file size (300KB = 300 * 1024 bytes)
    if (file.size > 300 * 1024) {
      setFileError('File is too large. Maximum size is 300KB.');
      setCoverPreview(null);
      setCoverFile(null);
      return;
    }

    // Create a URL for image preview
    setFileError('');
    setCoverPreview(URL.createObjectURL(file));
     setCoverFile(file);
  };

  
  const handleSave = async () => {
  if (!title) {
    alert('Title is required!');
    return;
  }

  const newStory = {
    title,
    description,
    category,
    status,
    chapters: 0,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };

  await addStory(newStory, coverFile); // ✅ pass file
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
                label="Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
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
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
                {fileError && <Typography color="error" sx={{mt: 1}}>{fileError}</Typography>}
            </Box>
            
            {/* Image Preview */}
            {coverPreview && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Image Preview:</Typography>
                    <Box 
                        component="img"
                        src={coverPreview}
                        alt="Cover preview"
                        sx={{
                            width: '150px',
                            height: 'auto',
                            borderRadius: '8px',
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    />
                </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
                <Button variant="text" onClick={() => navigate('/stories')}>Cancel</Button>
                <Button variant="contained" size="large" onClick={handleSave}>
                  {/* Dynamic Button Text */}
                  {status === 'Draft' ? 'Save Story' : 'Publish Story'}
                </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddStoryPage;