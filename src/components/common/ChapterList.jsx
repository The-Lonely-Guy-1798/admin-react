import React from 'react';
import {
  Typography,
  Box,
  Paper,
  IconButton,
  List,
  ListItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ChapterList = ({ chapters }) => {
  if (chapters.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: 'center', p: 3 }}>
        No chapters in this section.
      </Typography>
    );
  }

  return (
    <List disablePadding>
      {chapters.map((chapter) => (
        <ListItem key={chapter.id} disablePadding sx={{ mb: 1.5 }}>
          <Paper 
            variant="outlined"
            sx={{
              p: 2,
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box>
              <Typography fontWeight="500">{chapter.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {`Last updated: ${chapter.lastUpdated} • ${chapter.wordCount} words`}
              </Typography>
            </Box>
            <Box>
              <IconButton size="small" color="info"><EditIcon /></IconButton>
              <IconButton size="small" color="error"><DeleteIcon /></IconButton>
            </Box>
          </Paper>
        </ListItem>
      ))}
    </List>
  );
};

export default ChapterList;