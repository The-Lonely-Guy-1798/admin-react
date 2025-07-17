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
  DialogTitle
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
  const { stories, updateStory } = useStories();
  const { chapters, deleteChapter } = useChapters();

  const [story, setStory] = useState(null);
  const [isEditingSynopsis, setIsEditingSynopsis] = useState(false);
  const [synopsisText, setSynopsisText] = useState('');
  const [tabValue, setTabValue] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState(null);

  useEffect(() => {
    const currentStory = stories.find(s => s.id === parseInt(storyId));
    if (currentStory) {
        setStory(currentStory);
        setSynopsisText(currentStory.abstract || '');
    }
  }, [storyId, stories]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSaveSynopsis = () => {
      const updatedStory = { ...story, abstract: synopsisText };
      updateStory(updatedStory);
      setIsEditingSynopsis(false);
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

  const handleDeleteConfirm = () => {
    deleteChapter(chapterToDelete);
    handleDeleteDialogClose();
  };

  if (!story) {
    return (
        <Box>
            <Typography variant="h4">Story not found</Typography>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/stories')} sx={{mt: 2}}>
                Back to Stories
            </Button>
        </Box>
    );
  }
  
  // Add .sort() to order the chapters by their number
  const publishedChapters = chapters
    .filter(c => c.storyId === story.id && c.status === 'Published')
    .sort((a, b) => a.chapterNumber - b.chapterNumber);

  const draftChapters = chapters
    .filter(c => c.storyId === story.id && c.status === 'Draft')
    .sort((a, b) => a.chapterNumber - b.chapterNumber);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/stories')}>Back to Stories</Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<PeopleIcon />} onClick={() => setIsModalOpen(true)}>Manage Characters</Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate(`/stories/edit/${storyId}/create-chapter`)}>Create Chapter</Button>
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
            <Typography variant="h3" sx={{color: 'white', fontWeight: 'bold'}}>{story.title.charAt(0).toUpperCase()}</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4">{story.title}</Typography>
            {isEditingSynopsis ? (
                <Box>
                    <TextField multiline rows={3} fullWidth value={synopsisText} onChange={(e) => setSynopsisText(e.target.value)} variant="outlined" sx={{ my: 1 }}/>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Button size="small" variant="contained" onClick={handleSaveSynopsis}>Save</Button>
                        <Button size="small" onClick={() => setIsEditingSynopsis(false)}>Cancel</Button>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" color="text.secondary">{story.abstract || 'No abstract available.'}</Typography>
                    <IconButton size="small" onClick={() => setIsEditingSynopsis(true)}><EditIcon fontSize="small" /></IconButton>
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
            {tabValue === 0 && <ChapterList chapters={publishedChapters} onChapterClick={(chapterId) => navigate(`/stories/edit/${storyId}/chapters/${chapterId}`)} onDeleteClick={handleDeleteClick} />}
            {tabValue === 1 && <ChapterList chapters={draftChapters} onChapterClick={(chapterId) => navigate(`/stories/edit/${storyId}/chapters/${chapterId}`)} onDeleteClick={handleDeleteClick} />}
            {tabValue === 2 && <ChapterList chapters={[]} />}
        </Box>
      </Paper>

      <ManageCharactersModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <Dialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent><DialogContentText>Are you sure you want to delete this chapter? This cannot be undone.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditStoryPage;