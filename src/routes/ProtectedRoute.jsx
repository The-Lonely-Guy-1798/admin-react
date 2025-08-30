// src/routes/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

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

  if (!isLoggedIn) {
    // If not logged in, redirect to the /login page
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;