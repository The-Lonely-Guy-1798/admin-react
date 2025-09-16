import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Sector } from 'recharts';
import { useTheme } from '@mui/material/styles';

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10} // The "pop out" effect
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};


const AppPieChart = ({ data, onSliceClick }) => {
    const theme = useTheme();
    const COLORS = [theme.palette.primary.main, '#FF8042'];
    const [activeIndex, setActiveIndex] = useState(null);

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(null);
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    // The innerRadius prop has been removed to make it a solid pie
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    onClick={onSliceClick}
                    style={{cursor: onSliceClick ? 'pointer' : 'default'}}
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend iconSize={10} wrapperStyle={{fontSize: '14px', color: theme.palette.text.secondary}} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default AppPieChart;