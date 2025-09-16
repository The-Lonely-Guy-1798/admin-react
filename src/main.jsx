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
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StoryProvider>
          <ArticleProvider>
            <UserProvider>
              <CategoryProvider>
                <ChapterProvider>
                  <App />
                  <Toaster 
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: '#363636',
                        color: '#fff',
                        border: '1px solid #00AEEF',
                      },
                      success: {
                        style: {
                          background: '#2e7d32',
                          border: '1px solid #4caf50',
                        },
                      },
                      error: {
                        style: {
                          background: '#d32f2f',
                          border: '1px solid #f44336',
                        },
                      },
                    }}
                  />
                </ChapterProvider>
              </CategoryProvider>
            </UserProvider>
          </ArticleProvider>
        </StoryProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
