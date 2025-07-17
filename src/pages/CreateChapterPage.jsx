import React, { useState, useMemo, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { useChapters } from '../contexts/ChapterContext.jsx';
import { useStories } from '../contexts/StoryContext.jsx';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CreateChapterPage = () => {
  const navigate = useNavigate();
  const { storyId } = useParams();
  const { addChapter, getChaptersByStoryId, getNextChapterNumberForStory } = useChapters();
  const { getStoryById } = useStories();

  const [title, setTitle] = useState('');
  const [chapterNumber, setChapterNumber] = useState('');
  const [content, setContent] = useState('<p>Start writing your chapter here...</p>');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [story, setStory] = useState(null);
  const [storyChapters, setStoryChapters] = useState([]);

  // Load story data and chapters
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load story details
        const storyData = await getStoryById(storyId);
        setStory(storyData);
        
        // Load chapters for this story
        const chapters = await getChaptersByStoryId(storyId);
        setStoryChapters(chapters);
        
        // Get next chapter number
        const nextNumber = await getNextChapterNumberForStory(storyId);
        setChapterNumber(nextNumber.toString());
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message || 'Failed to load story data');
      } finally {
        setLoading(false);
      }
    };

    if (storyId) {
      loadData();
    }
  }, [storyId, getStoryById, getChaptersByStoryId, getNextChapterNumberForStory]);

  const { lastPublished, lastDraft } = useMemo(() => {
    const findLast = (status) => storyChapters
        .filter(c => c.status === status)
        .sort((a, b) => b.chapterNumber - a.chapterNumber)[0];
    
    return {
        lastPublished: findLast('published'),
        lastDraft: findLast('draft')
    };
  }, [storyChapters]);

  const handleSave = async (status) => {
    const num = parseInt(chapterNumber);
    if (!title || !num) {
        setError('Chapter Title and Number are required.');
        return;
    }
    
    // Check for duplicates for this specific story
    const isDuplicate = storyChapters.some(c => c.chapterNumber === num);

    if (isDuplicate) {
        setError(`Chapter number ${num} already exists for this story. Please use a different number.`);
        return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const newChapter = {
        storyId: storyId, // Keep as string
        chapterNumber: num,
        title,
        content,
        status: status.toLowerCase() // Ensure lowercase status
      };
      
      await addChapter(newChapter);
      navigate(`/stories/edit/${storyId}`);
    } catch (err) {
      console.error('Error saving chapter:', err);
      setError(err.message || 'Failed to save chapter');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error && !story) {
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

  return (
    <Box>
      <style>{`
        .ck-editor__editable_inline { min-height: 350px; background: #2D323C !important; color: #FFFFFF !important; border-color: rgba(255, 255, 255, 0.2) !important; }
        .ck.ck-toolbar { background: #1E2128 !important; border-color: rgba(255, 255, 255, 0.2) !important; }
        .ck.ck-button, .ck.ck-button.ck-on { color: #FFFFFF !important; }
        .ck.ck-button:hover, .ck.ck-button.ck-on:hover { background: #2D323C !important; }
      `}</style>
      
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/stories/edit/${storyId}`)}
        sx={{ mb: 2 }}
      >
        Back to Story
      </Button>

      <Typography variant="h4" sx={{ mb: 3 }}>
        Create New Chapter
        {story && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            for "{story.title}"
          </Typography>
        )}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="caption" color="text.secondary">
            Last Published: {lastPublished ? `Ch. ${lastPublished.chapterNumber}` : 'N/A'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
            Last Draft: {lastDraft ? `Ch. ${lastDraft.chapterNumber}` : 'N/A'}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
                <TextField
                    label="Chapter Number"
                    type="number"
                    variant="outlined"
                    fullWidth
                    required
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(e.target.value)}
                    disabled={saving}
                />
            </Grid>
            <Grid item xs={12} md={9}>
                <TextField
                    label="Chapter Title"
                    variant="outlined"
                    fullWidth
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={saving}
                />
            </Grid>
        </Grid>
        
        <Box sx={{mt: 3}}>
            <CKEditor
                editor={ ClassicEditor }
                data={content}
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    setContent(data);
                } }
                disabled={saving}
            />
        </Box>

      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={() => handleSave('draft')}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save as Draft'}
        </Button>
        <Button 
          variant="contained" 
          size="large" 
          onClick={() => handleSave('published')}
          disabled={saving}
        >
          {saving ? 'Publishing...' : 'Publish Chapter'}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateChapterPage;