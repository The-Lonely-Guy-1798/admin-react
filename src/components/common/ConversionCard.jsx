import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const ConversionCard = ({ title, value, description }) => {
  return (
    <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography>
      <Typography variant="h3" component="div" color="primary.main" sx={{ fontWeight: 700, my: 2 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );
};

export default ConversionCard;