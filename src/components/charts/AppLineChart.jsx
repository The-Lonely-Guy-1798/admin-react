import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useTheme } from '@mui/material/styles';

const AppLineChart = ({ data }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.4}/>
            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="name" 
          stroke={theme.palette.text.secondary} 
          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} 
        />
        <YAxis 
          stroke={theme.palette.text.secondary} 
          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} 
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.text.secondary}`,
            borderRadius: '12px'
          }}
        />
        <Area type="monotone" dataKey="users" stroke={theme.palette.primary.main} strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AppLineChart;