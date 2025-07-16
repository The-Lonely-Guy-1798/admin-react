import React from 'react';
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';

// Import CKEditor Components
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CreateChapterPage = () => {
  const navigate = useNavigate();
  const { storyId } = useParams();

  // Dummy next chapter number
  const nextChapterNumber = 53;

  return (
    <Box>
      {/* CKEditor has its own theme, we need to override some styles for our dark theme */}
      <style>{`
        .ck-editor__editable_inline {
            min-height: 350px;
            background: #2D323C !important;
            color: #FFFFFF !important;
            border-color: rgba(255, 255, 255, 0.2) !important;
        }
        .ck.ck-toolbar {
            background: #1E2128 !important;
            border-color: rgba(255, 255, 255, 0.2) !important;
        }
        .ck.ck-button, .ck.ck-button.ck-on {
            color: #FFFFFF !important;
        }
        .ck.ck-button:hover, .ck.ck-button.ck-on:hover {
            background: #2D323C !important;
        }
      `}</style>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/stories/edit/${storyId}`)}
        sx={{ mb: 2 }}
      >
        Back to Story
      </Button>

      <Typography variant="h4" sx={{ mb: 1 }}>
        Chapter - {nextChapterNumber}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        for The Last Voyager
      </Typography>

      <Paper sx={{ p: 3 }}>
         <TextField
            label="Chapter Title"
            variant="outlined"
            fullWidth
            required
            sx={{ mb: 3 }}
          />
        
        <CKEditor
            editor={ ClassicEditor }
            data="<p>Start writing your chapter here...</p>"
            onChange={ ( event, editor ) => {
                const data = editor.getData();
                console.log( { event, editor, data } );
            } }
        />

      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button variant="outlined">
            Save as Draft
        </Button>
        <Button variant="contained" size="large">
            Publish Chapter
        </Button>
      </Box>
    </Box>
  );
};

export default CreateChapterPage;