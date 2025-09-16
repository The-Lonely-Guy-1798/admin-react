import React, { useState, useEffect, useMemo } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Tabs,
  Tab,
  TextField,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentTable from '../components/common/ContentTable';
import { useNavigate } from 'react-router-dom';
import { useArticles } from '../contexts/ArticleContext.jsx';

const articleHeaders = [
    { id: 'cover', label: 'Cover' },
    { id: 'title', label: 'Title', sortable: true },
    { id: 'category', label: 'Category', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'lastUpdated', label: 'Last Updated' },
    { id: 'actions', label: 'Actions', align: 'right' },
];

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const ArticleListPage = () => {
  const navigate = useNavigate();
  const { articles, deleteArticle, loading } = useArticles();

  const [activeTab, setActiveTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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

  const handleDeleteClick = (articleId) => {
    setArticleToDelete(articleId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setArticleToDelete(null);
  };

  const handleDeleteConfirm = () => {
    deleteArticle(articleToDelete);
    handleCloseDialog();
  };

  const visibleRows = useMemo(() => {
    const categories = ['All', 'Finance & Crypto', 'Entertainment', 'Sports'];
    const categoryFilter = categories[activeTab];

    let articleList = [...articles];
    if (categoryFilter !== 'All') {
        articleList = articleList.filter(article => {
          const articleCategory = article.category || '';
          return articleCategory === categoryFilter;
        });
    }
    if (statusFilter !== 'All') {
        articleList = articleList.filter(article => {
          const articleStatus = article.status?.toLowerCase() || '';
          const filterValue = statusFilter.toLowerCase();
          return articleStatus === filterValue;
        });
    }
    if (searchTerm) {
        articleList = articleList.filter(article => article.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    // Add proper lastUpdated formatting
    const articlesWithFormatting = articleList.map(article => ({
      ...article,
      lastUpdated: article.updatedAt ? 
        (article.updatedAt instanceof Date ? article.updatedAt.toLocaleDateString() : 
         typeof article.updatedAt === 'string' ? article.updatedAt : 
         new Date(article.updatedAt).toLocaleDateString()) :
        article.lastUpdated || 'Unknown'
    }));
    
    return stableSort(articlesWithFormatting, getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [articles, activeTab, statusFilter, searchTerm, order, orderBy, page, rowsPerPage]);

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '400px', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography>Loading articles...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Article Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/articles/add')}>
          Add New Article
        </Button>
      </Box>



      <Paper sx={{ p: 2, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="All" />
                    <Tab label="Finance & Crypto" />
                    <Tab label="Entertainment" />
                    <Tab label="Sports" />
                </Tabs>
                <FormControl size="small" sx={{minWidth: 150}}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={handleStatusFilterChange}
                    >
                        <MenuItem value="All">All Statuses</MenuItem>
                        <MenuItem value="published">Published</MenuItem>
                        <MenuItem value="draft">Draft</MenuItem>
                    </Select>
                </FormControl>
            </Box>
          <TextField size="small" variant="outlined" placeholder="Search by article title..." value={searchTerm} onChange={handleSearchChange} sx={{ minWidth: '300px' }}/>
        </Box>
        <ContentTable 
            headers={articleHeaders} 
            data={visibleRows} 
            onRowClick={(id) => navigate(`/articles/edit/${id}`)} // Add this line
            onEdit={(id) => navigate(`/articles/edit/${id}`)}
            onDelete={handleDeleteClick}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
        />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={articles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      <Dialog open={openDeleteDialog} onClose={handleCloseDialog} PaperProps={{sx: {backgroundColor: 'background.paper'}}}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent><DialogContentText>Are you sure you want to delete this article? This action cannot be undone.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ArticleListPage;