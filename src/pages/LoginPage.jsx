// src/pages/LoginPage.jsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';

const LoginPage = () => {
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you'd validate credentials here
    login();
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(180deg, #161B22 0%, #0D1117 100%)',
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: '400px' }}>
        <Typography variant="h5" component="h1" sx={{ textAlign: 'center', mb: 1 }}>
          Admin Panel Login
        </Typography>
        <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          Sign in to manage your application.
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            required
            sx={{ mb: 2 }}
            defaultValue="admin@example.com"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            sx={{ mb: 3 }}
            defaultValue="password"
          />
          <Button type="submit" variant="contained" fullWidth size="large">
            Sign In
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;