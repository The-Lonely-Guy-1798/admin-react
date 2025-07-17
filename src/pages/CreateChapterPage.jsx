import React, { useState, useMemo } from 'react';
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { useChapters } from '../contexts/ChapterContext.jsx';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CreateChapterPage = () => {
  const navigate = useNavigate();
  const { storyId } = useParams();
  const { chapters, addChapter } = useChapters();

  const [title, setTitle] = useState('');
  const [chapterNumber, setChapterNumber] = useState('');
  const [content, setContent] = useState('<p>Start writing your chapter here...</p>');

  const { lastPublished, lastDraft } = useMemo(() => {
    const storyChapters = chapters.filter(c => c.storyId === parseInt(storyId));
    const findLast = (status) => storyChapters
        .filter(c => c.status === status)
        .sort((a, b) => b.chapterNumber - a.chapterNumber)[0];
    
    return {
        lastPublished: findLast('Published'),
        lastDraft: findLast('Draft')
    };
  }, [chapters, storyId]);

  const handleSave = (status) => {
    const num = parseInt(chapterNumber);
    if (!title || !num) {
        alert('Chapter Title and Number are required.');
        return;
    }
    
    // Check for duplicates for this specific story
    const isDuplicate = chapters.some(c => c.storyId === parseInt(storyId) && c.chapterNumber === num);

    if (isDuplicate) {
        alert(`Chapter number ${num} already exists for this story. Please use a different number.`);
        return;
    }

    const newChapter = {
        storyId: parseInt(storyId),
        chapterNumber: num,
        title,
        content,
        status,
        lastUpdated: new Date().toISOString().slice(0, 10),
        wordCount: content.replace(/<[^>]*>?/gm, '').split(/\s+/).length,
    };
    addChapter(newChapter);
    navigate(`/stories/edit/${storyId}`);
  };

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
      </Typography>

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
            />
        </Box>

      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button variant="outlined" onClick={() => handleSave('Draft')}>
            Save as Draft
        </Button>
        <Button variant="contained" size="large" onClick={() => handleSave('Published')}>
            Publish Chapter
        </Button>
      </Box>
    </Box>
  );
};

export default CreateChapterPage;