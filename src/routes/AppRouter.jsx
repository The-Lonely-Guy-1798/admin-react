import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminLayout from '../components/layout/AdminLayout.jsx';

// Import Pages
import DashboardPage from '../pages/DashboardPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import StoryListPage from '../pages/StoryListPage.jsx';
import ArticleListPage from '../pages/ArticleListPage.jsx';
import AnalyticsPage from '../pages/AnalyticsPage.jsx';
import UserManagementPage from '../pages/UserManagementPage.jsx';
import CategoryManagementPage from '../pages/CategoryManagementPage.jsx';
import SettingsPage from '../pages/SettingsPage.jsx';
import AddStoryPage from '../pages/AddStoryPage.jsx';
import EditStoryPage from '../pages/EditStoryPage.jsx';
import CreateChapterPage from '../pages/CreateChapterPage.jsx';
import EditArticlePage from '../pages/EditArticlePage.jsx';
import AddArticlePage from '../pages/AddArticlePage.jsx';
import UserDetailPage from '../pages/UserDetailPage.jsx';
import EditChapterPage from '../pages/EditChapterPage.jsx'; // Import the new page

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route 
        path="/*" // Match all other routes
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* These routes are children of AdminLayout and will render in its <Outlet> */}
        <Route index element={<DashboardPage />} />
        <Route path="stories" element={<StoryListPage />} />
        <Route path="stories/add" element={<AddStoryPage />} />
        <Route path="stories/edit/:storyId" element={<EditStoryPage />} />
        <Route path="stories/edit/:storyId/create-chapter" element={<CreateChapterPage />} />
        <Route path="stories/edit/:storyId/chapters/:chapterId" element={<EditChapterPage />} />
        <Route path="articles" element={<ArticleListPage />} />
        <Route path="articles/add" element={<AddArticlePage />} />
        <Route path="articles/edit/:articleId" element={<EditArticlePage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="users/:userId" element={<UserDetailPage />} />
        <Route path="categories" element={<CategoryManagementPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;