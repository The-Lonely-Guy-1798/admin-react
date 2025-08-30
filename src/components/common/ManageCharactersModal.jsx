import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ManageCharactersModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper', // This uses our semi-transparent color

          // Reduce the blur effect
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',

          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 24,
          p: 3,
          borderRadius: '16px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Manage Characters
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1">Add New Character</Typography>
            <TextField label="Character Name" size="small" />
            <Button component="label" variant="outlined" size="small">
                Character Image
                <input type="file" hidden accept="image/*" />
            </Button>
            <Button variant="contained">Add Character</Button>
        </Box>
        <Divider sx={{ my: 2 }} />
         <Box>
            <Typography variant="subtitle1">Existing Characters</Typography>
            <Typography variant="body2" color="text.secondary" sx={{mt: 2, textAlign: 'center'}}>
                No characters added yet.
            </Typography>
         </Box>
      </Box>
    </Modal>
  );
};

export default ManageCharactersModal;