// src/pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';

const LoginPage = () => {
  const { login, error, clearError, isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      navigate('/');
    }
  }, [isLoggedIn, isLoading, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        // Error is already set in the context
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking authentication status
  if (isLoading) {
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
        <CircularProgress size={60} sx={{ color: '#00AEEF' }} />
      </Box>
    );
  }

  // Don't render login form if already logged in
  if (isLoggedIn) {
    return null;
  }

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
          Only authorized administrators can access this panel.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            label="Email Address"
            name="email"
            type="email"
            fullWidth
            required
            value={formData.email}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            disabled={isSubmitting}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            value={formData.password}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;