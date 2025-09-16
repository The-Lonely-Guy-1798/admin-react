import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

// Add onClick to the props
const StatCard = ({ icon, title, value, trend, trendDirection = 'up', onClick }) => {
  const trendColor = trendDirection === 'up' ? 'success.main' : 'error.main';

  return (
    <Paper
      elevation={3}
      onClick={onClick} // Apply the onClick handler
      sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '12px',
        backgroundColor: 'background.paper',
        // Add hover effect if it's clickable
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
            transform: onClick ? 'translateY(-4px)' : 'none',
            boxShadow: onClick ? '0 8px 24px 0 rgba(0, 174, 239, 0.2)' : '0 4px 12px 0 rgba(0, 0, 0, 0.3)'
        }
      }}
    >
      <Box display="flex" alignItems="center">
        <Box sx={{ mr: 2, color: 'primary.main' }}>
          {icon}
        </Box>
        <Box>
          <Typography color="text.secondary" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h5" component="div" fontWeight="600">
            {value}
          </Typography>
        </Box>
      </Box>
      {trend && (
        <Typography sx={{ color: trendColor, fontWeight: '500' }}>
          {trend}
        </Typography>
      )}
    </Paper>
  );
};

export default StatCard;