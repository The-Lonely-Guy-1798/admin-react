import React, { useState, useEffect, useMemo } from 'react';
import {
  Typography,
  Box,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
  TableSortLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useUsers } from '../contexts/UserContext.jsx';

// Helper function for sorting
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

const headCells = [
    { id: 'email', label: 'User', sortable: true },
    { id: 'signUpDate', label: 'Sign-up Date', sortable: true },
    { id: 'storiesRead', label: 'Stories Read', sortable: true },
    { id: 'articlesRead', label: 'Articles Read', sortable: true },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions', align: 'right' },
];

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { users, toggleUserStatus } = useUsers();

  const initialFilter = searchParams.get('filter') || 'all';

  // State management
  const [filter, setFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('email');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [userToModify, setUserToModify] = useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(() => {
    let filteredData = [...users];
    // Apply filters
    switch (filter) {
        case 'new': filteredData = filteredData.filter(user => user.type === 'new'); break;
        case 'returning': filteredData = filteredData.filter(user => user.type === 'returning'); break;
        case 'active': filteredData = filteredData.filter(user => user.status === 'Active'); break;
        case 'banned': filteredData = filteredData.filter(user => user.status === 'Banned'); break;
        default: break;
    }
    if (searchTerm) {
        filteredData = filteredData.filter(user => 
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    // Apply sorting and pagination
    return stableSort(filteredData, getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [users, filter, searchTerm, order, orderBy, page, rowsPerPage]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
      setPage(0);
  };

  // Handlers for the dialog
  const handleActionClick = (event, user) => {
    event.stopPropagation(); // Prevents the row's onClick from firing
    setUserToModify(user);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUserToModify(null);
  };
  const handleConfirmAction = () => {
    toggleUserStatus(userToModify.id);
    handleCloseDialog();
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>User Management</Typography>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <TextField 
            size="small" 
            variant="outlined" 
            placeholder="Search by user email..." 
            sx={{flexGrow: 1, mr: 2}}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <FormControl size="small" sx={{minWidth: 150}}>
            <InputLabel>Filter By</InputLabel>
            <Select value={filter} label="Filter By" onChange={handleFilterChange}>
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="new">New Users</MenuItem>
              <MenuItem value="returning">Returning Users</MenuItem>
              <MenuItem value="active">Active Status</MenuItem>
              <MenuItem value="banned">Banned Status</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                    <TableCell key={headCell.id} align={headCell.align || 'left'} sortDirection={orderBy === headCell.id ? order : false}>
                        {headCell.sortable ? (
                            <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'} onClick={createSortHandler(headCell.id)}>
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
              {visibleRows.map((user) => (
                <TableRow 
                    key={user.id} 
                    hover 
                    onClick={() => navigate(`/users/${user.id}`)}
                    sx={{ cursor: 'pointer' }}
                >
                  <TableCell sx={{ fontWeight: '500' }}>{user.email}</TableCell>
                  <TableCell>{user.signUpDate}</TableCell>
                  <TableCell>{user.storiesRead}</TableCell>
                  <TableCell>{user.articlesRead}</TableCell>
                  <TableCell>
                    <Chip label={user.status} color={user.status === 'Active' ? 'success' : 'error'} size="small"/>
                  </TableCell>
                  <TableCell align="right">
                    {user.status === 'Active' ? (
                       <IconButton size="small" color="error" title="Ban User" onClick={(e) => handleActionClick(e, user)}>
                           <BlockIcon />
                       </IconButton>
                    ) : (
                        <IconButton size="small" color="success" title="Unban User" onClick={(e) => handleActionClick(e, user)}>
                            <CheckCircleIcon />
                        </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{sx: {backgroundColor: 'background.paper'}}}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {userToModify?.status === 'Active' ? 'ban' : 'unban'} the user "{userToModify?.email}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmAction} color={userToModify?.status === 'Active' ? 'error' : 'success'} autoFocus>
            {userToModify?.status === 'Active' ? 'Ban User' : 'Unban User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagementPage;