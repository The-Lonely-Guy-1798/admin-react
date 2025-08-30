import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useTheme } from '@mui/material/styles';

const AppBarChart = ({ data }) => {
  const theme = useTheme();
  const colors = ['#00AEEF', '#FF8042', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
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
          cursor={{fill: 'rgba(255, 255, 255, 0.1)'}}
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.text.secondary}`,
            borderRadius: '12px'
          }}
        />
        <Bar dataKey="reads">
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AppBarChart;