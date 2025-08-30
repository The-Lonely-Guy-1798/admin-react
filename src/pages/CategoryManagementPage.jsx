import React, { useState, useMemo } from 'react';
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
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Tabs,
  Tab,
  TablePagination,
  TableSortLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCategories } from '../contexts/CategoryContext.jsx';

// Helper functions and headCells remain the same
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
  const isNumber = orderBy === 'count';
  return order === 'desc'
    ? (a, b) => (isNumber ? b[orderBy] - a[orderBy] : (b[orderBy] < a[orderBy] ? -1 : 1))
    : (a, b) => (isNumber ? a[orderBy] - b[orderBy] : (a[orderBy] < b[orderBy] ? -1 : 1));
}

const headCells = [
    { id: 'name', label: 'Name', sortable: true },
    { id: 'type', label: 'Type', sortable: true },
    { id: 'count', label: 'Count', sortable: true },
    { id: 'actions', label: 'Actions', align: 'right' },
];

const CategoryManagementPage = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('Story');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryType, setEditCategoryType] = useState('Story');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const createSortHandler = (property) => (event) => handleRequestSort(event, property);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory({ name: newCategoryName, type: newCategoryType });
    setNewCategoryName('');
  };
  
  const handleEditClick = (category) => {
    setCategoryToEdit(category);
    setEditCategoryName(category.name);
    setEditCategoryType(category.type);
    setIsEditModalOpen(true);
  };
  const handleEditModalClose = () => setIsEditModalOpen(false);
  const handleUpdateCategory = () => {
    if (!editCategoryName.trim() || !categoryToEdit) return;
    updateCategory({ ...categoryToEdit, name: editCategoryName, type: editCategoryType });
    handleEditModalClose();
  };

  const handleDeleteClick = (categoryId) => {
    setCategoryToDelete(categoryId);
    setIsDeleteDialogOpen(true);
  };
  const handleDeleteDialogClose = () => setIsDeleteDialogOpen(false);
  const handleDeleteConfirm = () => {
    deleteCategory(categoryToDelete);
    handleDeleteDialogClose();
  };

  const visibleRows = useMemo(() => {
    const filters = ['All', 'Story', 'Article'];
    const typeFilter = filters[activeTab];

    let categoryList = [...categories];
    if (typeFilter !== 'All') {
        categoryList = categoryList.filter(cat => cat.type === typeFilter);
    }
    if (searchTerm) {
        categoryList = categoryList.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    return stableSort(categoryList, getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [categories, activeTab, searchTerm, order, orderBy, page, rowsPerPage]);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Category Management
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        <Box sx={{ flex: '1 1 35%' }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Add New Category</Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <TextField label="Category Name" fullWidth sx={{ mb: 2 }} value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
              <FormControl>
                <FormLabel>Category Type</FormLabel>
                <RadioGroup row value={newCategoryType} onChange={(e) => setNewCategoryType(e.target.value)}>
                  <FormControlLabel value="Story" control={<Radio />} label="Story" />
                  <FormControlLabel value="Article" control={<Radio />} label="Article" />
                </RadioGroup>
              </FormControl>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddCategory}>Save Category</Button>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: '1 1 65%' }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Tabs value={activeTab} onChange={(e, val) => {setActiveTab(val); setPage(0);}} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tab label="All" />
                <Tab label="Story" />
                <Tab label="Article" />
              </Tabs>
              <TextField size="small" variant="outlined" placeholder="Search categories..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setPage(0);}} sx={{ width: '300px' }}/>
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
                  {visibleRows.map((cat) => (
                    <TableRow key={cat.id} hover>
                      <TableCell sx={{ fontWeight: '500' }}>{cat.name}</TableCell>
                      <TableCell>{cat.type}</TableCell>
                      <TableCell>{cat.count}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="info" onClick={() => handleEditClick(cat)}><EditIcon /></IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(cat.id)}><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={categories.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </Paper>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose} PaperProps={{sx: {backgroundColor: 'background.paper'}}}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent><DialogContentText>Are you sure you want to delete this category?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Category Modal */}
      <Modal open={isEditModalOpen} onClose={handleEditModalClose}>
         {/* The styling for this Box is now updated to match the other modal */}
         <Box sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              width: 400, 
              bgcolor: 'background.paper',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              boxShadow: 24, 
              p: 4, 
              borderRadius: '16px' 
            }}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>Edit Category</Typography>
            <TextField label="Category Name" fullWidth sx={{ mb: 2 }} value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} />
            <FormControl>
              <FormLabel>Category Type</FormLabel>
              <RadioGroup row value={editCategoryType} onChange={(e) => setEditCategoryType(e.target.value)}>
                <FormControlLabel value="Story" control={<Radio />} label="Story" />
                <FormControlLabel value="Article" control={<Radio />} label="Article" />
              </RadioGroup>
            </FormControl>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={handleEditModalClose}>Cancel</Button>
                <Button variant="contained" onClick={handleUpdateCategory}>Save Changes</Button>
            </Box>
         </Box>
      </Modal>
    </Box>
  );
};

export default CategoryManagementPage;