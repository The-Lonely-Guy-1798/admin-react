import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TableSortLabel,
  Box,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Add onRowClick to the props
const ContentTable = ({ headers, data, onEdit, onDelete, onRowClick, order, orderBy, onRequestSort }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((headCell) => (
              <TableCell
                key={headCell.id}
                align={headCell.align || 'left'}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                {headCell.sortable ? (
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                ) : (
                  headCell.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow 
                key={item.id} 
                hover 
                onClick={() => onRowClick && onRowClick(item.id)}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              <TableCell>
                <Box sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: 'primary.dark',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Typography variant="h6" sx={{color: 'white', fontWeight: 'bold'}}>
                        {item.title.charAt(0).toUpperCase()}
                    </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: '500' }}>{item.title}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>
                <Chip 
                  label={item.status} 
                  color={item.status?.toLowerCase() === 'published' ? 'success' : 'warning'}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              {item.chapters !== undefined && <TableCell>{item.chapters}</TableCell>}
              <TableCell>{item.lastUpdated}</TableCell>
              <TableCell align="right">
                <IconButton 
                    size="small" 
                    color="info" 
                    onClick={(e) => { e.stopPropagation(); onEdit && onEdit(item.id); }}
                >
                    <EditIcon />
                </IconButton>
                <IconButton 
                    size="small" 
                    color="error" 
                    onClick={(e) => { e.stopPropagation(); onDelete && onDelete(item.id); }}
                >
                    <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContentTable;