import React, { useState, useEffect } from 'react';
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

const EditChapterPage = () => {
  const navigate = useNavigate();
  const { storyId, chapterId } = useParams();
  const { updateChapter, getChapterById, getChaptersByStoryId } = useChapters();
  const { getStoryById } = useStories();

  const [chapter, setChapter] = useState(null);
  const [story, setStory] = useState(null);
  const [storyChapters, setStoryChapters] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [chapterNumber, setChapterNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load chapter data
        const chapterData = await getChapterById(chapterId);
        setChapter(chapterData);
        setTitle(chapterData.title);
        setChapterNumber(chapterData.chapterNumber.toString());
        setContent(chapterData.content || '');
        
        // Load story data
        const storyData = await getStoryById(storyId);
        setStory(storyData);
        
        // Load all chapters for this story (for validation)
        const chapters = await getChaptersByStoryId(storyId);
        setStoryChapters(chapters);
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message || 'Failed to load chapter data');
      } finally {
        setLoading(false);
      }
    };

    if (chapterId && storyId) {
      loadData();
    }
  }, [chapterId, storyId, getChapterById, getStoryById, getChaptersByStoryId]);

  const handleSave = async (newStatus) => {
    if (!title || !chapterNumber || !chapter) {
      setError('Chapter title and number are required.');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const num = parseInt(chapterNumber);
      
      // Check if another chapter (with a different ID) already has this number for this story
      const isDuplicate = storyChapters.some(
        c => c.chapterNumber === num && c.id !== chapter.id
      );

      if (isDuplicate) {
        setError(`Chapter number ${num} already exists for this story. Please use a different number.`);
        return;
      }

      const updatedChapter = await updateChapter(chapterId, { 
        title, 
        content,
        chapterNumber: num,
        status: newStatus ? newStatus.toLowerCase() : chapter.status
      });
      
      setChapter(updatedChapter);
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

  if (error && !chapter) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/stories/edit/${storyId}`)}>
          Back to Story
        </Button>
      </Box>
    );
  }

  if (!chapter) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Chapter not found
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/stories/edit/${storyId}`)}>
          Back to Story
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
        Edit Chapter
        {story && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            from "{story.title}"
          </Typography>
        )}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
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
        
        <CKEditor
            editor={ ClassicEditor }
            data={content}
            onChange={ ( event, editor ) => {
                const data = editor.getData();
                setContent(data);
            } }
            disabled={saving}
        />
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate(`/stories/edit/${storyId}`)}
          disabled={saving}
        >
          Cancel
        </Button>
        
        {chapter.status === 'draft' ? (
            <>
                <Button 
                  variant="outlined" 
                  size="large" 
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={() => handleSave('published')}
                  disabled={saving}
                >
                  {saving ? 'Publishing...' : 'Publish'}
                </Button>
            </>
        ) : (
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => handleSave('published')}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
        )}
      </Box>
    </Box>
  );
};

export default EditChapterPage;