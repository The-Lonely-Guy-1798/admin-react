import React, { useState, useMemo } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentTable from '../components/common/ContentTable';
import { useNavigate } from 'react-router-dom';
import { useStories } from '../contexts/StoryContext.jsx';
import { useChapters } from '../contexts/ChapterContext.jsx';

const storyHeaders = [
    { id: 'cover', label: 'Cover' },
    { id: 'title', label: 'Title', sortable: true },
    { id: 'category', label: 'Category', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'chapters', label: 'Chapters', sortable: true },
    { id: 'lastUpdated', label: 'Last Updated', sortable: true },
    { id: 'actions', label: 'Actions', align: 'right' },
];

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
  const isNumber = orderBy === 'chapters';
  return order === 'desc'
    ? (a, b) => (isNumber ? b[orderBy] - a[orderBy] : (b[orderBy] < a[orderBy] ? -1 : 1))
    : (a, b) => (isNumber ? a[orderBy] - b[orderBy] : (a[orderBy] < b[orderBy] ? -1 : 1));
}

const StoryListPage = () => {
  const navigate = useNavigate();
  const { stories, deleteStory } = useStories();
  const { chapters: allChapters } = useChapters();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('lastUpdated');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredAndSortedStories = useMemo(() => {
    let storyList = [...stories]; 
    
    // Category filter - handle both old and new format
    if (categoryFilter !== 'All') {
      const filterValue = categoryFilter === 'Fan-Fiction' ? 'fan-fiction' : categoryFilter.toLowerCase();
      storyList = storyList.filter(story => {
        const storyCategory = story.category?.toLowerCase() || '';
        return storyCategory === filterValue || storyCategory === categoryFilter.toLowerCase();
      });
    }
    
    // Status filter - handle both old and new format  
    if (statusFilter !== 'All') {
      storyList = storyList.filter(story => {
        const storyStatus = story.status?.toLowerCase() || '';
        const filterValue = statusFilter.toLowerCase();
        return storyStatus === filterValue;
      });
    }
    
    // Search filter
    if (searchTerm) {
      storyList = storyList.filter(story => 
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (story.description && story.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Map over the stories to add the dynamic chapter count
    const storiesWithChapterCounts = storyList.map(story => ({
        ...story,
        chapters: allChapters.filter(c => c.storyId === story.id && c.status === 'published').length,
        // Ensure proper date formatting for display
        lastUpdated: story.updatedAt ? 
          (story.updatedAt instanceof Date ? story.updatedAt.toLocaleDateString() : 
           typeof story.updatedAt === 'string' ? story.updatedAt : 
           new Date(story.updatedAt).toLocaleDateString()) :
          story.lastUpdated || 'Unknown'
    }));

    return stableSort(storiesWithChapterCounts, getComparator(order, orderBy));
  }, [stories, allChapters, categoryFilter, statusFilter, searchTerm, order, orderBy]);

  const visibleRows = useMemo(() => 
    filteredAndSortedStories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
  [filteredAndSortedStories, page, rowsPerPage]);

  const handleCategoryTabChange = (event, newValue) => {
    setCategoryFilter(['All', 'Original', 'Fan-Fiction'][newValue]);
    setPage(0);
  };
  
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
      setPage(0);
  };

  const handleDeleteClick = (storyId) => {
    setStoryToDelete(storyId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setStoryToDelete(null);
  };

  const handleDeleteConfirm = () => {
    deleteStory(storyToDelete);
    handleCloseDialog();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Story Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/stories/add')}>
          Add New Story
        </Button>
      </Box>

      <Paper sx={{ p: 2, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Tabs value={['All', 'Original', 'Fan-Fiction'].indexOf(categoryFilter)} onChange={handleCategoryTabChange}>
              <Tab label="All" />
              <Tab label="Original" />
              <Tab label="Fan-Fiction" />
            </Tabs>
            <FormControl size="small" sx={{minWidth: 150}}>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={handleStatusFilterChange}>
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                </Select>
            </FormControl>
          </Box>
          <TextField size="small" variant="outlined" placeholder="Search by story title..." value={searchTerm} onChange={handleSearchChange} sx={{ minWidth: '300px' }}/>
        </Box>
        <ContentTable 
            headers={storyHeaders} 
            data={visibleRows}
            onRowClick={(id) => navigate(`/stories/edit/${id}`)}
            onEdit={(id) => navigate(`/stories/edit/${id}`)}
            onDelete={handleDeleteClick}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
        />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAndSortedStories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDialog}
        PaperProps={{sx: {backgroundColor: 'background.paper'}}}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this story? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StoryListPage;