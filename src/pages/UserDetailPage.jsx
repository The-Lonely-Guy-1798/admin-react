import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import StatCard from '../components/common/StatCard';

// Icons
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PostAddIcon from '@mui/icons-material/PostAdd';

// Find a user from our mock data based on the ID from the URL
const allUsers = [
  { id: 1, email: 'reader.one@example.com', signUpDate: '2025-07-09', storiesRead: 12, articlesRead: 34, status: 'Active', type: 'new' },
  { id: 2, email: 'another.fan@example.com', signUpDate: '2025-07-08', storiesRead: 5, articlesRead: 10, status: 'Active', type: 'new' },
  { id: 3, email: 'test.user@example.com', signUpDate: '2025-07-05', storiesRead: 0, articlesRead: 1, status: 'Active', type: 'returning' },
];

const UserDetailPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  // For now, we'll just find the user from our mock data
  const user = allUsers.find(u => u.id === parseInt(userId));

  if (!user) {
    return <Typography>User not found.</Typography>;
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/users')}
        sx={{ mb: 2 }}
      >
        Back to User List
      </Button>
      <Typography variant="h4" sx={{ mb: 1 }}>
        {user.email}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
            Signed up on: {user.signUpDate}
        </Typography>
        <Chip 
            label={user.status} 
            color={user.status === 'Active' ? 'success' : 'error'}
            size="small"
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <StatCard icon={<LibraryBooksIcon fontSize="large" />} title="Stories Read" value={user.storiesRead} />
          <StatCard icon={<PostAddIcon fontSize="large" />} title="Articles Read" value={user.articlesRead} />
      </Box>

      <Paper sx={{p: 2}}>
        <Typography variant="h6">Activity Feed</Typography>
        <Typography color="text.secondary" sx={{mt: 2}}>User activity feed will be displayed here.</Typography>
      </Paper>
    </Box>
  );
};

export default UserDetailPage;