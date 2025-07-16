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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useArticles } from '../contexts/ArticleContext.jsx';

const AddArticlePage = () => {
  const navigate = useNavigate();
  const { addArticle } = useArticles();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [content, setContent] = useState('<p>Start writing your article here...</p>');

  const handleSave = () => {
      if (!title) return;
      const newArticle = {
          title,
          category,
          status: 'Published', // Defaulting to published on save
          lastUpdated: 'Just now',
          content,
      };
      addArticle(newArticle);
      navigate('/articles');
  };

  return (
    <Box>
      <style>{`
        .ck-editor__editable_inline { min-height: 250px; background: #2D323C !important; color: #FFFFFF !important; border-color: rgba(255, 255, 255, 0.2) !important; }
        .ck.ck-toolbar { background: #1E2128 !important; border-color: rgba(255, 255, 255, 0.2) !important; }
        .ck.ck-button, .ck.ck-button.ck-on { color: #FFFFFF !important; }
        .ck.ck-button:hover, .ck.ck-button.ck-on:hover { background: #2D323C !important; }
      `}</style>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/articles')} sx={{ mb: 2 }}>
        Back to Articles
      </Button>
      <Typography variant="h4" sx={{ mb: 3 }}>Add New Article</Typography>

      <Paper sx={{ p: 4, width: '100%' }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField label="Article Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth required />
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <MenuItem value="Finance & Crypto">Finance & Crypto</MenuItem>
                <MenuItem value="Entertainment">Entertainment</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
              </Select>
            </FormControl>
            <Button component="label" variant="outlined">
                Upload Cover Image
                <input type="file" hidden accept="image/*" />
            </Button>
          </Box>
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>Article Content</Typography>
            <CKEditor
                editor={ ClassicEditor }
                data={content}
                onChange={(event, editor) => setContent(editor.getData())}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
            <Button variant="text" onClick={() => navigate('/articles')}>Cancel</Button>
            <Button variant="contained" size="large" onClick={handleSave}>Publish Article</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddArticlePage;