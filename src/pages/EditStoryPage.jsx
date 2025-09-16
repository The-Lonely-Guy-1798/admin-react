import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Button,
  Tabs,
  Tab,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import ManageCharactersModal from '../components/common/ManageCharactersModal';
import ChapterList from '../components/common/ChapterList';
import { useStories } from '../contexts/StoryContext.jsx';
import { useChapters } from '../contexts/ChapterContext.jsx';

const EditStoryPage = () => {
  const navigate = useNavigate();
  const { storyId } = useParams();
  const { stories, updateStory, getStoryById } = useStories();
  const { chapters, deleteChapter, getChaptersByStoryId } = useChapters();

  const [story, setStory] = useState(null);
  const [storyChapters, setStoryChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingSynopsis, setIsEditingSynopsis] = useState(false);
  const [synopsisText, setSynopsisText] = useState('');
  const [tabValue, setTabValue] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState(null);

  // Load story and chapters
  useEffect(() => {
    const loadStoryData = async () => {
      if (!storyId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // First try to find story in context
        let currentStory = stories.find(s => s.id === storyId);
        
        // If not found in context, fetch from Firebase
        if (!currentStory) {
          currentStory = await getStoryById(storyId);
        }
        
        if (currentStory) {
          setStory(currentStory);
          setSynopsisText(currentStory.description || currentStory.abstract || '');
          
          // Load chapters for this story
          const storyChapters = await getChaptersByStoryId(storyId);
          setStoryChapters(storyChapters);
        } else {
          setError('Story not found');
        }
      } catch (err) {
        console.error('Error loading story:', err);
        setError(err.message || 'Failed to load story');
      } finally {
        setLoading(false);
      }
    };

    loadStoryData();
  }, [storyId, stories, getStoryById, getChaptersByStoryId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSaveSynopsis = async () => {
    try {
      const updatedStory = await updateStory(storyId, { 
        description: synopsisText 
      });
      setStory(updatedStory);
      setIsEditingSynopsis(false);
    } catch (err) {
      console.error('Error updating synopsis:', err);
      setError('Failed to update synopsis');
    }
  };
  
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDeleteClick = (chapterId) => {
    setChapterToDelete(chapterId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setChapterToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteChapter(chapterToDelete);
      // Refresh chapters after deletion
      const updatedChapters = await getChaptersByStoryId(storyId);
      setStoryChapters(updatedChapters);
      handleDeleteDialogClose();
    } catch (err) {
      console.error('Error deleting chapter:', err);
      setError('Failed to delete chapter');
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/stories')}>
          Back to Stories
        </Button>
      </Box>
    );
  }

  // Story not found
  if (!story) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Story not found
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/stories')}>
          Back to Stories
        </Button>
      </Box>
    );
  }
  
  // Filter chapters by status
  const publishedChapters = storyChapters
    .filter(c => c.status === 'published')
    .sort((a, b) => a.chapterNumber - b.chapterNumber);

  const draftChapters = storyChapters
    .filter(c => c.status === 'draft')
    .sort((a, b) => a.chapterNumber - b.chapterNumber);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/stories')}>
          Back to Stories
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<PeopleIcon />} onClick={() => setIsModalOpen(true)}>
            Manage Characters
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate(`/stories/edit/${storyId}/create-chapter`)}>
            Create Chapter
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box 
          onClick={handleMenuOpen}
          sx={{ 
            width: 80, 
            height: 80, 
            backgroundColor: 'primary.main', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            '&:hover': {
                opacity: 0.9
            }
        }}>
          <Typography variant="h3" sx={{color: 'white', fontWeight: 'bold'}}>
            {story.title.charAt(0).toUpperCase()}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">{story.title}</Typography>
          {isEditingSynopsis ? (
            <Box>
              <TextField 
                multiline 
                rows={3} 
                fullWidth 
                value={synopsisText} 
                onChange={(e) => setSynopsisText(e.target.value)} 
                variant="outlined" 
                sx={{ my: 1 }}
                placeholder="Enter story description..."
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button size="small" variant="contained" onClick={handleSaveSynopsis}>
                  Save
                </Button>
                <Button size="small" onClick={() => setIsEditingSynopsis(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" color="text.secondary">
                {story.description || story.abstract || 'No description available.'}
              </Typography>
              <IconButton size="small" onClick={() => setIsEditingSynopsis(true)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </Paper>
      
      <Menu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Preview Cover</MenuItem>
        <MenuItem onClick={handleMenuClose}>Change Cover</MenuItem>
      </Menu>

      <Paper sx={{ p: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`Published (${publishedChapters.length})`} />
          <Tab label={`Drafts (${draftChapters.length})`} />
          <Tab label="Trash (0)" />
        </Tabs>
        <Box sx={{pt: 2, minHeight: 200}}>
          {tabValue === 0 && (
            <ChapterList 
              chapters={publishedChapters} 
              onChapterClick={(chapterId) => navigate(`/stories/edit/${storyId}/chapters/${chapterId}`)} 
              onDeleteClick={handleDeleteClick} 
            />
          )}
          {tabValue === 1 && (
            <ChapterList 
              chapters={draftChapters} 
              onChapterClick={(chapterId) => navigate(`/stories/edit/${storyId}/chapters/${chapterId}`)} 
              onDeleteClick={handleDeleteClick} 
            />
          )}
          {tabValue === 2 && <ChapterList chapters={[]} />}
        </Box>
      </Paper>

      <ManageCharactersModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <Dialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this chapter? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditStoryPage;