// src/components/layout/Sidebar.jsx

import React from 'react';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Divider, Avatar
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
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Stories', icon: <BookIcon />, path: '/stories' },
  { text: 'Articles', icon: <ArticleIcon />, path: '/articles' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Users', icon: <PeopleIcon />, path: '/users' },
  { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar = () => {
  const { logout, user } = useAuth();

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
      
      {/* User Profile and Logout Section */}
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <Box sx={{ p: 2 }}>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <AdminPanelSettingsIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {user.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {user.email}
              </Typography>
            </Box>
          </Box>
        )}
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={logout} sx={{ borderRadius: '8px' }}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;