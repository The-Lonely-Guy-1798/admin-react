import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate, useParams } from 'react-router-dom';
import ManageCharactersModal from '../components/common/ManageCharactersModal';
import ChapterList from '../components/common/ChapterList'; // 1. Import the new component

// Mock Data
const story = {
    title: 'The Last Voyager',
    abstract: 'A sci-fi epic about the last human exploring the void, searching for relics of a long-lost civilization to understand what went wrong.'
};
// 2. Add mock data for chapters
const publishedChapters = [
    {id: 1, title: 'Chapter 1: The Anomaly', lastUpdated: '1 day ago', wordCount: 2500},
    {id: 2, title: 'Chapter 2: Ghost Signal', lastUpdated: '3 days ago', wordCount: 3100},
    {id: 3, title: 'Chapter 3: The Leviathan', lastUpdated: '1 week ago', wordCount: 2800},
];
const draftChapters = [
    {id: 4, title: 'Chapter 4: Echoes (Draft)', lastUpdated: '2 hours ago', wordCount: 1500},
];

const EditStoryPage = () => {
  const navigate = useNavigate();
  const { storyId } = useParams();
  const [tabValue, setTabValue] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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

      {/* Story Details Header */}
      <Paper sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box sx={{ 
            width: 80, height: 80, backgroundColor: 'primary.main', borderRadius: '12px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <Typography variant="h3" sx={{color: 'white', fontWeight: 'bold'}}>S</Typography>
        </Box>
        <Box>
            <Typography variant="h4">{story.title}</Typography>
            <Typography variant="body1" color="text.secondary">{story.abstract}</Typography>
        </Box>
      </Paper>
      
      {/* Chapter List Tabs */}
      <Paper sx={{ p: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label={`Published (${publishedChapters.length})`} />
            <Tab label={`Drafts (${draftChapters.length})`} />
            <Tab label="Trash (0)" />
        </Tabs>
        <Box sx={{pt: 2, minHeight: 200}}>
            {/* 3. Replace placeholder text with the ChapterList component */}
            {tabValue === 0 && <ChapterList chapters={publishedChapters} />}
            {tabValue === 1 && <ChapterList chapters={draftChapters} />}
            {tabValue === 2 && <ChapterList chapters={[]} />}
        </Box>
      </Paper>

      <ManageCharactersModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
};

export default EditStoryPage;