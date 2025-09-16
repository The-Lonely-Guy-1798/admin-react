import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// This function determines cell color based on retention percentage
const getCellColor = (value, theme) => {
  if (value === null) return 'transparent';
  const opacity = value / 100;
  // Use the primary theme color with varying opacity
  const color = theme.palette.primary.main;
  // This is a simple way to convert hex to rgb for rgba
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const CohortAnalysisTable = ({ data }) => {
  const theme = useTheme();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Cohort</TableCell>
            <TableCell>New Users</TableCell>
            {/* Generate month headers dynamically */}
            {data.length > 0 && data[0].retention.map((_, index) => (
              <TableCell key={index}>Month {index + 1}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.cohort}>
              <TableCell>{row.cohort}</TableCell>
              <TableCell>{row.newUsers.toLocaleString()}</TableCell>
              {row.retention.map((value, index) => (
                <TableCell
                  key={index}
                  sx={{
                    backgroundColor: getCellColor(value, theme),
                    color: value !== null && value > 50 ? 'white' : 'text.primary',
                    textAlign: 'center',
                    fontWeight: '500',
                  }}
                >
                  {value !== null ? `${value}%` : ''}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CohortAnalysisTable;