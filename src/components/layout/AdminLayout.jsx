// src/components/layout/AdminLayout.jsx

import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom'; // Outlet renders the child routes

const AdminLayout = () => {
  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(180deg, #161B22 0%, #0D1117 100%)',
    }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh', 
          overflow: 'auto',
          background: 'transparent',
          p: 3, 
        }}
      >
        <Outlet /> {/* Child pages will be rendered here */}
      </Box>
    </Box>
  );
};

export default AdminLayout;