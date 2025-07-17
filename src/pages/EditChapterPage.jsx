import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { useChapters } from '../contexts/ChapterContext.jsx';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const EditChapterPage = () => {
  const navigate = useNavigate();
  const { storyId, chapterId } = useParams();
  const { chapters, updateChapter } = useChapters();

  const [chapter, setChapter] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [chapterNumber, setChapterNumber] = useState('');

  useEffect(() => {
    const currentChapter = chapters.find(c => c.id === parseInt(chapterId));
    if (currentChapter) {
      setChapter(currentChapter);
      setTitle(currentChapter.title);
      setChapterNumber(currentChapter.chapterNumber);
      setContent(currentChapter.content || '');
    }
  }, [chapterId, chapters]);

  const handleSave = (newStatus) => {
    if (!title || !chapterNumber || !chapter) return;
    
    // --- VALIDATION LOGIC START ---
    const num = parseInt(chapterNumber);
    // Check if another chapter (with a different ID) already has this number for this story
    const isDuplicate = chapters.some(
      c => c.storyId === parseInt(storyId) && c.chapterNumber === num && c.id !== chapter.id
    );

    if (isDuplicate) {
      alert(`Chapter number ${num} already exists for this story. Please use a different number.`);
      return; // Stop the save process
    }
    // --- VALIDATION LOGIC END ---

    const updatedChapter = { 
        ...chapter, 
        title, 
        content,
        chapterNumber: num,
        lastUpdated: new Date().toISOString().slice(0, 10),
        status: newStatus || chapter.status 
    };
    updateChapter(updatedChapter);
    navigate(`/stories/edit/${storyId}`);
  };

  if (!chapter) {
    return <Typography>Loading Chapter...</Typography>;
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
      </Typography>

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
        
        <CKEditor
            editor={ ClassicEditor }
            data={content}
            onChange={ ( event, editor ) => {
                const data = editor.getData();
                setContent(data);
            } }
        />
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate(`/stories/edit/${storyId}`)}>
            Cancel
        </Button>
        
        {chapter.status === 'Draft' ? (
            <>
                <Button variant="outlined" size="large" onClick={() => handleSave('Draft')}>
                    Save Changes
                </Button>
                <Button variant="contained" size="large" onClick={() => handleSave('Published')}>
                    Publish
                </Button>
            </>
        ) : (
            <Button variant="contained" size="large" onClick={() => handleSave('Published')}>
                Save Changes
            </Button>
        )}
      </Box>
    </Box>
  );
};

export default EditChapterPage;