import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';

// 1. Add onItemClick to the props
const RecentActivityTable = ({ title, items, onItemClick }) => {
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <TableContainer>
        <Table>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                onClick={() => onItemClick && onItemClick(item.id)} // 2. Add the onClick handler
                sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    // 3. Add hover styles if clickable
                    cursor: onItemClick ? 'pointer' : 'default',
                    '&:hover': {
                        backgroundColor: onItemClick ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                    }
                }}
              >
                <TableCell component="th" scope="row" sx={{ p: 1 }}>
                  <Typography variant="body1" fontWeight="500">{item.primary}</Typography>
                </TableCell>
                <TableCell align="right" sx={{ p: 1 }}>
                    <Typography variant="body2" color="text.secondary">{item.secondary}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RecentActivityTable;