import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { StoryProvider } from './contexts/StoryContext.jsx';
import { ArticleProvider } from './contexts/ArticleContext.jsx';
import { UserProvider } from './contexts/UserContext.jsx';
import { CategoryProvider } from './contexts/CategoryContext.jsx';
import { ChapterProvider } from './contexts/ChapterContext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StoryProvider>
          <ArticleProvider>
            <UserProvider>
              <CategoryProvider>
                <ChapterProvider> {/* 2. Wrap App */}
                  <App />
                </ChapterProvider>
              </CategoryProvider>
            </UserProvider>
          </ArticleProvider>
        </StoryProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);