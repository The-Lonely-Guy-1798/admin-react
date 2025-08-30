import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Button,
  ButtonGroup
} from '@mui/material';
import AppLineChart from '../charts/AppLineChart';

// This component will manage its own state for the active filter
const AnalyticsChartCard = ({ title, data, initialFilter = 'daily' }) => {
  const [filter, setFilter] = useState(initialFilter);
  const [chartData, setChartData] = useState(data[initialFilter]);

  // This effect updates the chart when the filter changes
  useEffect(() => {
    setChartData(data[filter]);
  }, [filter, data]);
  
  // This effect updates the filter if the initialFilter prop changes (from URL)
  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  return (
    <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <ButtonGroup variant="outlined" size="small">
          <Button onClick={() => setFilter('daily')} variant={filter === 'daily' ? 'contained' : 'outlined'}>Daily</Button>
          <Button onClick={() => setFilter('weekly')} variant={filter === 'weekly' ? 'contained' : 'outlined'}>Weekly</Button>
          <Button onClick={() => setFilter('monthly')} variant={filter === 'monthly' ? 'contained' : 'outlined'}>Monthly</Button>
        </ButtonGroup>
      </Box>
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <AppLineChart data={chartData} />
        </Box>
      </Box>
    </Paper>
  );
};

export default AnalyticsChartCard;