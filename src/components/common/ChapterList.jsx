import React from 'react';
import {
  Typography,
  Box,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Create a formatter for the desired date and time style
const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata'
});

const ChapterList = ({ chapters, onChapterClick, onEditClick, onDeleteClick }) => {
  if (!chapters || chapters.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: 'center', p: 3 }}>
        No chapters in this section.
      </Typography>
    );
  }

  const formatDateTime = (date) => {
      // Intl.DateTimeFormat can be complex; we reformat its output for DD-MM-YYYY - HH:MM
      const parts = dateTimeFormatter.formatToParts(date).reduce((acc, part) => {
          acc[part.type] = part.value;
          return acc;
      }, {});
      return `${parts.day}-${parts.month}-${parts.year} - ${parts.hour}:${parts.minute}`;
  };

  return (
    <List disablePadding>
      {chapters.map((chapter) => (
        <ListItem key={chapter.id} disablePadding sx={{ mb: 1.5 }}>
          <ListItemButton 
            onClick={() => onChapterClick && onChapterClick(chapter.id)}
            sx={{ p: 0, borderRadius: '12px' }}
          >
            <Paper 
              variant="outlined"
              sx={{ p: 2, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: 'rgba(255, 255, 255, 0.1)'}}
            >
              <Box>
                <Typography fontWeight="500">{`Chapter ${chapter.chapterNumber}: ${chapter.title}`}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {`Last updated: ${formatDateTime(chapter.lastUpdated)} • ${chapter.wordCount} words`}
                </Typography>
              </Box>
              <Box>
                <IconButton size="small" color="info" onClick={(e) => { e.stopPropagation(); onChapterClick && onChapterClick(chapter.id); }}>
                    <EditIcon />
                </IconButton>
                <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDeleteClick && onDeleteClick(chapter.id); }}>
                    <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default ChapterList;