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

const AppHorizontalBarChart = ({ data }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis type="number" stroke={theme.palette.text.secondary} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
        <YAxis type="category" dataKey="name" stroke={theme.palette.text.secondary} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
        <Tooltip
            cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} 
            contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.text.secondary}`,
                borderRadius: '12px'
            }}
        />
        <Bar dataKey="users" fill={theme.palette.primary.main} barSize={30}>
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={theme.palette.primary.main} opacity={1 - (index * 0.15)} />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AppHorizontalBarChart;