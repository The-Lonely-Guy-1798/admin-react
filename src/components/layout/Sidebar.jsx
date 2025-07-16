// src/components/layout/Sidebar.jsx

import React from 'react';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Divider
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

// Import icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import ArticleIcon from '@mui/icons-material/Article';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout'; // Import Logout Icon

const drawerWidth = 240;

const navItems = [
  // ... (navItems array remains the same)
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Stories', icon: <BookIcon />, path: '/stories' },
  { text: 'Articles', icon: <ArticleIcon />, path: '/articles' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Users', icon: <PeopleIcon />, path: '/users' },
  { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar = () => {
  const { logout } = useAuth(); // Get the logout function

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'rgba(18, 18, 18, 0.85)',
          borderRight: '1px solid rgba(255, 255, 255, 0.15)',
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
        <Typography variant="h5" component="div">
          Freemium Novels
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  '&.active': {
                    backgroundColor: 'rgba(0, 174, 239, 0.2)',
                    borderRight: '3px solid #00AEEF',
                    color: 'primary.main',
                  },
                  '&.active .MuiListItemIcon-root': { color: 'primary.main' },
                  m: 1,
                  borderRadius: '8px',
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      {/* --- LOGOUT BUTTON START --- */}
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={logout} sx={{ m: 1, borderRadius: '8px' }}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
      {/* --- LOGOUT BUTTON END --- */}
    </Drawer>
  );
};

export default Sidebar;